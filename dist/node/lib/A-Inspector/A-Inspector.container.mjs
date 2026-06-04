import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Container, A_Error, A_Concept, A_Inject, A_Feature } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_CONSTANTS__INSPECTOR_ENV_VARIABLES, A_CONSTANTS__INSPECTOR_DEFAULT_HOST, A_InspectorFeatures, A_CONSTANTS__INSPECTOR_DEFAULT_PORT, A_InspectorMessageType } from './A-Inspector.constants';
import { A_InspectorError } from './A-Inspector.error';
import { InspectorSnapshotHelper } from './commands/InspectorSnapshot.helper.component';
import { InspectorCommandRepository } from './commands/InspectorCommandRepository.component';
import { InspectConceptCommand } from './commands/InspectConceptCommand';
import { InspectScopeCommand } from './commands/InspectScopeCommand';
import { InspectFeatureCommand } from './commands/InspectFeatureCommand';
import { InspectorPingCommand } from './commands/InspectorPingCommand';

var _a;
async function loadNet() {
  try {
    const req = eval('typeof require !== "undefined" ? require : undefined');
    if (req) return req("net");
  } catch {
  }
  return await Function('return import("net")')();
}
let A_ConceptInspector = class extends A_Container {
  constructor() {
    super(...arguments);
    /** Underlying `net.Server` once started. */
    this._server = void 0;
  }
  /**
   * The fully resolved address (host + port) of the running inspector
   * server. `undefined` until `start()` has completed. Especially
   * useful when `A_CONCEPT_INSPECTOR_PORT=0` so the OS picks the port.
   */
  get address() {
    return this._address;
  }
  async autoStart(config, logger) {
    if (!this.isEnabled(config)) {
      logger?.debug("gray", `[A_ConceptInspector] disabled (set ${A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED}=1 to enable)`);
      return;
    }
    await this.serve(config, logger);
  }
  async autoStop(logger) {
    if (!this._server) return;
    await this.shutdown(logger);
  }
  // ====================================================================
  // =========================== SERVER SIDE ============================
  // ====================================================================
  /**
   * Opens the TCP server on the configured host/port and starts
   * accepting inspector clients. May be called directly when finer
   * lifecycle control is needed (e.g. tests).
   */
  async serve(config, logger) {
    if (this._server) {
      return this._address;
    }
    const secret = config.get(A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET);
    if (!secret) {
      throw new A_InspectorError({
        title: A_InspectorError.InspectorStartError,
        description: `Cannot start inspector without ${A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET} configured.`
      });
    }
    const host = String(config.get(A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_HOST) ?? A_CONSTANTS__INSPECTOR_DEFAULT_HOST);
    const portRaw = config.get(A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_PORT);
    const port = portRaw === void 0 || portRaw === null || portRaw === "" ? A_CONSTANTS__INSPECTOR_DEFAULT_PORT : Number(portRaw);
    const net = await loadNet();
    await this.call(A_InspectorFeatures.onBeforeServe, this.scope);
    const server = net.createServer((socket) => {
      this.handleConnection(socket, secret, logger);
    });
    await new Promise((resolve, reject) => {
      const onError = (err) => reject(this.wrapStartError(err));
      server.once("error", onError);
      server.listen(port, host, () => {
        server.off("error", onError);
        resolve();
      });
    });
    const addr = server.address();
    if (!addr || typeof addr === "string") {
      throw new A_InspectorError({
        title: A_InspectorError.InspectorStartError,
        description: "Inspector server did not report a usable address after listen()."
      });
    }
    this._server = server;
    this._address = { host: addr.address, port: addr.port };
    logger?.info(
      "green",
      `[A_ConceptInspector] listening on tcp://${this._address.host}:${this._address.port}`
    );
    await this.call(A_InspectorFeatures.onServe, this.scope);
    await this.call(A_InspectorFeatures.onAfterServe, this.scope);
    return this._address;
  }
  /**
   * Stops accepting new connections and closes the underlying server.
   */
  async shutdown(logger) {
    if (!this._server) return;
    await this.call(A_InspectorFeatures.onBeforeShutdown, this.scope);
    await new Promise((resolve, reject) => {
      this._server.close((err) => err ? reject(err) : resolve());
    });
    this._server = void 0;
    this._address = void 0;
    logger?.debug("gray", "[A_ConceptInspector] server stopped");
    await this.call(A_InspectorFeatures.onShutdown, this.scope);
    await this.call(A_InspectorFeatures.onAfterShutdown, this.scope);
  }
  async [_a = A_InspectorFeatures.onAuthenticate](..._args) {
  }
  // ====================================================================
  // ====================== CONNECTION HANDLING =========================
  // ====================================================================
  handleConnection(socket, secret, logger) {
    let authed = false;
    let buffer = "";
    socket.setEncoding("utf8");
    const send = (msg) => {
      try {
        socket.write(JSON.stringify(msg) + "\n");
      } catch {
      }
    };
    socket.on("data", async (chunk) => {
      buffer += chunk;
      let nl;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          send({
            type: A_InspectorMessageType.Error,
            error: { title: A_InspectorError.InspectorProtocolError, description: "malformed JSON" }
          });
          socket.end();
          return;
        }
        if (!authed) {
          if (msg.type !== A_InspectorMessageType.Auth || msg.secret !== secret) {
            send({
              type: A_InspectorMessageType.AuthFail,
              reason: "invalid secret"
            });
            socket.end();
            return;
          }
          authed = true;
          send({ type: A_InspectorMessageType.AuthOk });
          continue;
        }
        if (msg.type === A_InspectorMessageType.Command) {
          await this.runCommandMessage(msg, send, logger);
        } else {
          send({
            type: A_InspectorMessageType.Error,
            error: { title: A_InspectorError.InspectorProtocolError, description: `unexpected message type ${msg.type}` }
          });
        }
      }
    });
    socket.on("error", (err) => {
      logger?.debug("gray", `[A_ConceptInspector] socket error: ${err?.message ?? err}`);
    });
  }
  async runCommandMessage(msg, send, logger) {
    try {
      const code = msg.payload?.code;
      if (!code) {
        throw new A_InspectorError({
          title: A_InspectorError.InspectorProtocolError,
          description: "command payload missing `code`"
        });
      }
      const Ctor = this.scope.resolveConstructor(code);
      if (!Ctor) {
        throw new A_InspectorError({
          title: A_InspectorError.InspectorCommandNotFoundError,
          description: `command '${code}' is not registered on this inspector`
        });
      }
      const command = new Ctor(msg.payload);
      this.scope.register(command);
      await command.execute();
      this.scope.deregister(command);
      send({
        type: A_InspectorMessageType.Result,
        id: msg.id,
        payload: command.toJSON()
      });
    } catch (err) {
      logger?.error(err);
      send({
        type: A_InspectorMessageType.Error,
        id: msg.id,
        error: {
          title: err instanceof A_Error ? err.message ?? A_InspectorError.InspectorTransportError : A_InspectorError.InspectorTransportError,
          description: err?.description ?? err?.message ?? String(err)
        }
      });
    }
  }
  // ====================================================================
  // ============================  HELPERS  =============================
  // ====================================================================
  isEnabled(config) {
    const raw = config.get(A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED);
    if (raw === void 0 || raw === null) return false;
    const v = String(raw).trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "on";
  }
  wrapStartError(err) {
    return new A_InspectorError({
      title: A_InspectorError.InspectorStartError,
      description: err?.message ?? String(err),
      originalError: err
    });
  }
};
__decorateClass([
  A_Concept.Start(),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_Logger))
], A_ConceptInspector.prototype, "autoStart", 1);
__decorateClass([
  A_Concept.Stop(),
  __decorateParam(0, A_Inject(A_Logger))
], A_ConceptInspector.prototype, "autoStop", 1);
__decorateClass([
  A_Feature.Extend()
], A_ConceptInspector.prototype, _a, 1);
A_ConceptInspector = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Container that exposes A-Concept introspection (scopes, components, features, etc.) over a JSON-line TCP transport. Communication is done via A_Command serialization; access is guarded by A_CONCEPT_DEBUG_SECRET read through A_Config."
  })
], A_ConceptInspector);
const A_ConceptInspectorContainer = new A_ConceptInspector({
  name: "A_ConceptInspector",
  components: [
    InspectorSnapshotHelper,
    InspectorCommandRepository
  ],
  entities: [
    InspectorPingCommand,
    InspectConceptCommand,
    InspectScopeCommand,
    InspectFeatureCommand
  ]
});

export { A_ConceptInspector, A_ConceptInspectorContainer };
//# sourceMappingURL=A-Inspector.container.mjs.map
//# sourceMappingURL=A-Inspector.container.mjs.map