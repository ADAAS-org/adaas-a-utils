'use strict';

var aConcept = require('@adaas/a-concept');
var core = require('@adaas/a-frame/core');
var aLogger = require('@adaas/a-utils/a-logger');
var aConfig = require('@adaas/a-utils/a-config');
var AInspector_constants = require('./A-Inspector.constants');
var AInspector_error = require('./A-Inspector.error');
var InspectorSnapshot_helper_component = require('./commands/InspectorSnapshot.helper.component');
var InspectorCommandRepository_component = require('./commands/InspectorCommandRepository.component');
var InspectConceptCommand = require('./commands/InspectConceptCommand');
var InspectScopeCommand = require('./commands/InspectScopeCommand');
var InspectFeatureCommand = require('./commands/InspectFeatureCommand');
var InspectorPingCommand = require('./commands/InspectorPingCommand');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var _a;
async function loadNet() {
  try {
    const req = eval('typeof require !== "undefined" ? require : undefined');
    if (req) return req("net");
  } catch {
  }
  return await Function('return import("net")')();
}
exports.A_ConceptInspector = class A_ConceptInspector extends aConcept.A_Container {
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
      logger?.debug("gray", `[A_ConceptInspector] disabled (set ${AInspector_constants.A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED}=1 to enable)`);
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
    const secret = config.get(AInspector_constants.A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET);
    if (!secret) {
      throw new AInspector_error.A_InspectorError({
        title: AInspector_error.A_InspectorError.InspectorStartError,
        description: `Cannot start inspector without ${AInspector_constants.A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET} configured.`
      });
    }
    const host = String(config.get(AInspector_constants.A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_HOST) ?? AInspector_constants.A_CONSTANTS__INSPECTOR_DEFAULT_HOST);
    const portRaw = config.get(AInspector_constants.A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_PORT);
    const port = portRaw === void 0 || portRaw === null || portRaw === "" ? AInspector_constants.A_CONSTANTS__INSPECTOR_DEFAULT_PORT : Number(portRaw);
    const net = await loadNet();
    await this.call(AInspector_constants.A_InspectorFeatures.onBeforeServe, this.scope);
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
      throw new AInspector_error.A_InspectorError({
        title: AInspector_error.A_InspectorError.InspectorStartError,
        description: "Inspector server did not report a usable address after listen()."
      });
    }
    this._server = server;
    this._address = { host: addr.address, port: addr.port };
    logger?.info(
      "green",
      `[A_ConceptInspector] listening on tcp://${this._address.host}:${this._address.port}`
    );
    await this.call(AInspector_constants.A_InspectorFeatures.onServe, this.scope);
    await this.call(AInspector_constants.A_InspectorFeatures.onAfterServe, this.scope);
    return this._address;
  }
  /**
   * Stops accepting new connections and closes the underlying server.
   */
  async shutdown(logger) {
    if (!this._server) return;
    await this.call(AInspector_constants.A_InspectorFeatures.onBeforeShutdown, this.scope);
    await new Promise((resolve, reject) => {
      this._server.close((err) => err ? reject(err) : resolve());
    });
    this._server = void 0;
    this._address = void 0;
    logger?.debug("gray", "[A_ConceptInspector] server stopped");
    await this.call(AInspector_constants.A_InspectorFeatures.onShutdown, this.scope);
    await this.call(AInspector_constants.A_InspectorFeatures.onAfterShutdown, this.scope);
  }
  async [_a = AInspector_constants.A_InspectorFeatures.onAuthenticate](..._args) {
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
            type: AInspector_constants.A_InspectorMessageType.Error,
            error: { title: AInspector_error.A_InspectorError.InspectorProtocolError, description: "malformed JSON" }
          });
          socket.end();
          return;
        }
        if (!authed) {
          if (msg.type !== AInspector_constants.A_InspectorMessageType.Auth || msg.secret !== secret) {
            send({
              type: AInspector_constants.A_InspectorMessageType.AuthFail,
              reason: "invalid secret"
            });
            socket.end();
            return;
          }
          authed = true;
          send({ type: AInspector_constants.A_InspectorMessageType.AuthOk });
          continue;
        }
        if (msg.type === AInspector_constants.A_InspectorMessageType.Command) {
          await this.runCommandMessage(msg, send, logger);
        } else {
          send({
            type: AInspector_constants.A_InspectorMessageType.Error,
            error: { title: AInspector_error.A_InspectorError.InspectorProtocolError, description: `unexpected message type ${msg.type}` }
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
        throw new AInspector_error.A_InspectorError({
          title: AInspector_error.A_InspectorError.InspectorProtocolError,
          description: "command payload missing `code`"
        });
      }
      const Ctor = this.scope.resolveConstructor(code);
      if (!Ctor) {
        throw new AInspector_error.A_InspectorError({
          title: AInspector_error.A_InspectorError.InspectorCommandNotFoundError,
          description: `command '${code}' is not registered on this inspector`
        });
      }
      const command = new Ctor(msg.payload);
      this.scope.register(command);
      await command.execute();
      this.scope.deregister(command);
      send({
        type: AInspector_constants.A_InspectorMessageType.Result,
        id: msg.id,
        payload: command.toJSON()
      });
    } catch (err) {
      logger?.error(err);
      send({
        type: AInspector_constants.A_InspectorMessageType.Error,
        id: msg.id,
        error: {
          title: err instanceof aConcept.A_Error ? err.message ?? AInspector_error.A_InspectorError.InspectorTransportError : AInspector_error.A_InspectorError.InspectorTransportError,
          description: err?.description ?? err?.message ?? String(err)
        }
      });
    }
  }
  // ====================================================================
  // ============================  HELPERS  =============================
  // ====================================================================
  isEnabled(config) {
    const raw = config.get(AInspector_constants.A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED);
    if (raw === void 0 || raw === null) return false;
    const v = String(raw).trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "on";
  }
  wrapStartError(err) {
    return new AInspector_error.A_InspectorError({
      title: AInspector_error.A_InspectorError.InspectorStartError,
      description: err?.message ?? String(err),
      originalError: err
    });
  }
};
__decorateClass([
  aConcept.A_Concept.Debug(),
  __decorateParam(0, aConcept.A_Inject(aConfig.A_Config)),
  __decorateParam(1, aConcept.A_Inject(aLogger.A_Logger))
], exports.A_ConceptInspector.prototype, "autoStart", 1);
__decorateClass([
  aConcept.A_Concept.Stop(),
  __decorateParam(0, aConcept.A_Inject(aLogger.A_Logger))
], exports.A_ConceptInspector.prototype, "autoStop", 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_ConceptInspector.prototype, _a, 1);
exports.A_ConceptInspector = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Container that exposes A-Concept introspection (scopes, components, features, etc.) over a JSON-line TCP transport. Communication is done via A_Command serialization; access is guarded by A_CONCEPT_DEBUG_SECRET read through A_Config."
  })
], exports.A_ConceptInspector);
const A_ConceptInspectorContainer = new exports.A_ConceptInspector({
  name: "A_ConceptInspector",
  components: [
    InspectorSnapshot_helper_component.InspectorSnapshotHelper,
    InspectorCommandRepository_component.InspectorCommandRepository
  ],
  entities: [
    InspectorPingCommand.InspectorPingCommand,
    InspectConceptCommand.InspectConceptCommand,
    InspectScopeCommand.InspectScopeCommand,
    InspectFeatureCommand.InspectFeatureCommand
  ]
});

exports.A_ConceptInspectorContainer = A_ConceptInspectorContainer;
//# sourceMappingURL=A-Inspector.container.js.map
//# sourceMappingURL=A-Inspector.container.js.map