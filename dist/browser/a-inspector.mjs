import { A_ChannelRequest, A_Channel } from './chunk-7ZHXAHVE.mjs';
import { A_Command } from './chunk-DUX5BUM5.mjs';
import './chunk-VWWA2AWF.mjs';
import './chunk-MMJI7Z6T.mjs';
import { A_Logger } from './chunk-2UT5WCOA.mjs';
import { A_Config } from './chunk-SJU7LRGF.mjs';
import './chunk-ZSD77J3W.mjs';
import './chunk-SEQJPRV7.mjs';
import { __decorateClass, __decorateParam } from './chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Caller, A_Concept, A_Error, A_Component, A_CommonHelper, A_Context, A_Container, A_Fragment } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';

// src/lib/A-Inspector/A-Inspector.constants.ts
var A_CONSTANTS__INSPECTOR_ENV_VARIABLES = {
  /**
   * Shared secret used to authenticate inspector clients.
   *
   * The server side of the inspector will refuse any connection whose
   * handshake message does not carry exactly this value. If the variable
   * is not set, remote inspection is disabled on the server side.
   */
  A_CONCEPT_DEBUG_SECRET: "A_CONCEPT_DEBUG_SECRET",
  /**
   * If set to a truthy value (`'1'`, `'true'`, `'yes'`) the inspector
   * server is started automatically together with the concept (via the
   * `@A_Concept.Start()` lifecycle hook).
   */
  A_CONCEPT_INSPECTOR_ENABLED: "A_CONCEPT_INSPECTOR_ENABLED",
  /**
   * Hostname/interface the inspector TCP server binds to. Defaults to
   * `127.0.0.1` (loopback only) so the inspector is never exposed
   * outside the host unless explicitly configured.
   */
  A_CONCEPT_INSPECTOR_HOST: "A_CONCEPT_INSPECTOR_HOST",
  /**
   * TCP port the inspector server listens on. `0` lets the OS pick an
   * ephemeral port — useful for tests; the chosen port is announced via
   * the container's `address` property after `start()` resolves.
   */
  A_CONCEPT_INSPECTOR_PORT: "A_CONCEPT_INSPECTOR_PORT"
};
var A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY = [
  A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET,
  A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED,
  A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_HOST,
  A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_PORT
];
var A_InspectorFeatures = /* @__PURE__ */ ((A_InspectorFeatures2) => {
  A_InspectorFeatures2["onBeforeServe"] = "_A_Inspector_onBeforeServe";
  A_InspectorFeatures2["onServe"] = "_A_Inspector_onServe";
  A_InspectorFeatures2["onAfterServe"] = "_A_Inspector_onAfterServe";
  A_InspectorFeatures2["onBeforeShutdown"] = "_A_Inspector_onBeforeShutdown";
  A_InspectorFeatures2["onShutdown"] = "_A_Inspector_onShutdown";
  A_InspectorFeatures2["onAfterShutdown"] = "_A_Inspector_onAfterShutdown";
  A_InspectorFeatures2["onAuthenticate"] = "_A_Inspector_onAuthenticate";
  A_InspectorFeatures2["onCommand"] = "_A_Inspector_onCommand";
  return A_InspectorFeatures2;
})(A_InspectorFeatures || {});
var A_InspectorMessageType = /* @__PURE__ */ ((A_InspectorMessageType2) => {
  A_InspectorMessageType2["Auth"] = "auth";
  A_InspectorMessageType2["AuthOk"] = "auth-ok";
  A_InspectorMessageType2["AuthFail"] = "auth-fail";
  A_InspectorMessageType2["Command"] = "command";
  A_InspectorMessageType2["Result"] = "result";
  A_InspectorMessageType2["Error"] = "error";
  return A_InspectorMessageType2;
})(A_InspectorMessageType || {});
var A_CONSTANTS__INSPECTOR_DEFAULT_HOST = "127.0.0.1";
var A_CONSTANTS__INSPECTOR_DEFAULT_PORT = 0;
var A_InspectorError = class extends A_Error {
};
A_InspectorError.InspectorStartError = "Inspector start error";
A_InspectorError.InspectorStopError = "Inspector stop error";
A_InspectorError.InspectorAuthError = "Inspector authentication failure";
A_InspectorError.InspectorTransportError = "Inspector transport error";
A_InspectorError.InspectorProtocolError = "Inspector protocol error";
A_InspectorError.InspectorCommandNotFoundError = "Inspector command not found";
A_InspectorError.InspectorDisabledError = "Inspector disabled";
A_InspectorError.InspectorNotSupportedError = "Inspector not supported in this runtime";
var InspectorSnapshotHelper = class extends A_Component {
  scopeSnapshot(scope) {
    return {
      name: scope.name,
      fingerprint: scope.fingerprint,
      version: scope.version,
      parent: scope.parent?.name,
      imports: scope.imports.map((s) => s.name),
      components: scope.components.map((c) => ({
        name: A_CommonHelper.getComponentName(c),
        constructor: c.constructor.name
      })),
      fragments: scope.fragments.map((f) => ({
        name: A_CommonHelper.getComponentName(f),
        constructor: f.constructor.name
      })),
      entities: scope.entities.map((e) => ({
        name: A_CommonHelper.getComponentName(e),
        constructor: e.constructor.name,
        aseid: e.aseid?.toString?.() ?? ""
      })),
      errors: scope.errors.map((e) => ({
        name: e.constructor.name,
        code: e.code ?? ""
      })),
      allowedComponents: Array.from(scope.allowedComponents).map((c) => c.name),
      allowedEntities: Array.from(scope.allowedEntities).map((c) => c.name),
      allowedFragments: Array.from(scope.allowedFragments).map((c) => c.name),
      allowedErrors: Array.from(scope.allowedErrors).map((c) => c.name)
    };
  }
  /**
   * Walks the registry of allocated containers reachable from the
   * given scope (and its inherited/imported scopes) and returns a
   * stable list of container snapshots.
   */
  collectContainers(scope) {
    const seen = /* @__PURE__ */ new Set();
    const visitedScopes = /* @__PURE__ */ new Set();
    const out = [];
    const instance = A_Context.getInstance();
    const scopeIssuers = instance?._scopeIssuers;
    const addContainer = (c) => {
      if (seen.has(c)) return;
      seen.add(c);
      out.push({
        name: c.name,
        constructor: c.constructor.name,
        scope: this.safeScopeName(c)
      });
    };
    const visit = (s) => {
      if (visitedScopes.has(s)) return;
      visitedScopes.add(s);
      for (const c of s.components) {
        if (c instanceof A_Container) addContainer(c);
      }
      const issuer = scopeIssuers?.get(s);
      if (issuer instanceof A_Container) addContainer(issuer);
      const subs = s._subscribers;
      if (subs) {
        for (const ref of subs) {
          const child = ref.deref();
          if (child) visit(child);
        }
      }
      if (s.parent) visit(s.parent);
      for (const imp of s.imports) visit(imp);
    };
    visit(scope);
    return out;
  }
  /**
   * Build a feature snapshot for the given component + feature name
   * by reusing the same machinery `A_Feature` does (template steps).
   */
  featureSnapshot(component, feature, scope) {
    const steps = A_Context.featureTemplate(feature, component, scope);
    const stepSnapshots = steps.map((step) => ({
      handler: step.handler,
      dependency: step.dependency?.name ?? "",
      order: step.order,
      scope: step.scope?.toString?.(),
      override: step.override?.toString?.()
    }));
    return {
      component: A_CommonHelper.getComponentName(component),
      feature,
      steps: stepSnapshots
    };
  }
  safeScopeName(component) {
    try {
      return A_Context.scope(component).name;
    } catch {
      return "<unregistered>";
    }
  }
};
InspectorSnapshotHelper = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Helper component that turns the live A_Context / A_Scope graph into serializable inspector snapshots used by InspectXxxCommand results."
  })
], InspectorSnapshotHelper);
var InspectorPingCommand = class extends A_Command {
  static get entity() {
    return "inspector-ping";
  }
};
InspectorPingCommand = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Health-check / authentication-check command. Echoes back the token and the server timestamp."
  })
], InspectorPingCommand);
var InspectConceptCommand = class extends A_Command {
  static get entity() {
    return "inspect-concept";
  }
};
InspectConceptCommand = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Returns a snapshot of the running concept: name, environment, root scope, and all allocated containers."
  })
], InspectConceptCommand);
var InspectScopeCommand = class extends A_Command {
  static get entity() {
    return "inspect-scope";
  }
};
InspectScopeCommand = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Returns a snapshot of a single scope (components, fragments, entities, errors, imports) by name."
  })
], InspectScopeCommand);
var InspectFeatureCommand = class extends A_Command {
  static get entity() {
    return "inspect-feature";
  }
};
InspectFeatureCommand = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Returns the resolved feature template (stage steps) for a given component + feature + scope, exactly as A_Feature would execute it."
  })
], InspectFeatureCommand);

// src/lib/A-Inspector/commands/InspectorCommandRepository.component.ts
var InspectorCommandRepository = class extends A_Component {
  async onPingExecute(command, logger) {
    logger.debug(`Received ping command with params`, command.params);
    await command.complete({
      pong: true,
      token: command.params?.token ?? "",
      serverTime: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async onInspectConceptExecute(command, snap, logger) {
    const root = A_Context.root;
    logger.debug(`Executing Command ${command.aseid.toString()} in status ${command.status} with params`, command.params);
    const snapshot = {
      name: A_Context.concept,
      environment: A_Context.environment,
      rootScope: snap.scopeSnapshot(root),
      containers: snap.collectContainers(root)
    };
    await command.complete({ snapshot });
  }
  async onInspectScopeExecute(command, snap) {
    const target = command.params?.scope;
    const root = A_Context.root;
    const found = !target || target === root.name || target === "root" ? root : this.findScope(root, target);
    if (!found) {
      await command.fail(new A_InspectorError({
        title: A_InspectorError.InspectorCommandNotFoundError,
        description: `Scope '${target}' was not reachable from the root scope.`
      }));
      return;
    }
    await command.complete({ snapshot: snap.scopeSnapshot(found) });
  }
  async onInspectFeatureExecute(command, snap, logger) {
    const { component: componentName, feature, scope: scopeName } = command.params;
    const root = A_Context.root;
    const scope = !scopeName || scopeName === "root" || scopeName === root.name ? root : this.findScope(root, scopeName);
    logger.debug(`Executing Command ${command.aseid.toString()} in status ${command.status} with params`, command.params);
    if (!scope) {
      await command.fail(new A_InspectorError({
        title: A_InspectorError.InspectorCommandNotFoundError,
        description: `Scope '${scopeName}' not reachable from root scope.`
      }));
      return;
    }
    const componentInstance = scope.resolve(componentName);
    if (!componentInstance) {
      await command.fail(new A_InspectorError({
        title: A_InspectorError.InspectorCommandNotFoundError,
        description: `Component '${componentName}' is not registered in scope '${scope.name}'.`
      }));
      return;
    }
    const snapshot = snap.featureSnapshot(componentInstance, feature, scope);
    await command.complete({ snapshot });
  }
  // ====================================================================
  // =========================  HELPERS  ================================
  // ====================================================================
  findScope(start, name) {
    const seen = /* @__PURE__ */ new Set();
    const stack = [start];
    while (stack.length) {
      const s = stack.pop();
      if (seen.has(s)) continue;
      seen.add(s);
      if (s.name === name) return s;
      if (s.parent) stack.push(s.parent);
      for (const imp of s.imports) stack.push(imp);
      const subs = s._subscribers;
      if (subs) {
        for (const ref of subs) {
          const child = ref.deref();
          if (child) stack.push(child);
        }
      }
    }
    return void 0;
  }
};
__decorateClass([
  A_Feature.Extend({
    name: "_A_Command_onExecute" /* onExecute */,
    scope: [InspectorPingCommand]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_Logger))
], InspectorCommandRepository.prototype, "onPingExecute", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Command_onExecute" /* onExecute */,
    scope: [InspectConceptCommand]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(InspectorSnapshotHelper)),
  __decorateParam(2, A_Inject(A_Logger))
], InspectorCommandRepository.prototype, "onInspectConceptExecute", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Command_onExecute" /* onExecute */,
    scope: [InspectScopeCommand]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(InspectorSnapshotHelper))
], InspectorCommandRepository.prototype, "onInspectScopeExecute", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Command_onExecute" /* onExecute */,
    scope: [InspectFeatureCommand]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(InspectorSnapshotHelper)),
  __decorateParam(2, A_Inject(A_Logger))
], InspectorCommandRepository.prototype, "onInspectFeatureExecute", 1);
InspectorCommandRepository = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Server-side executor for InspectorPing / InspectConcept / InspectScope / InspectFeature commands."
  })
], InspectorCommandRepository);

// src/lib/A-Inspector/A-Inspector.container.ts
async function loadNet() {
  try {
    const req = eval('typeof require !== "undefined" ? require : undefined');
    if (req) return req("net");
  } catch {
  }
  return await Function('return import("net")')();
}
var _a;
var A_ConceptInspector = class extends A_Container {
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
    await this.call("_A_Inspector_onBeforeServe" /* onBeforeServe */, this.scope);
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
    await this.call("_A_Inspector_onServe" /* onServe */, this.scope);
    await this.call("_A_Inspector_onAfterServe" /* onAfterServe */, this.scope);
    return this._address;
  }
  /**
   * Stops accepting new connections and closes the underlying server.
   */
  async shutdown(logger) {
    if (!this._server) return;
    await this.call("_A_Inspector_onBeforeShutdown" /* onBeforeShutdown */, this.scope);
    await new Promise((resolve, reject) => {
      this._server.close((err) => err ? reject(err) : resolve());
    });
    this._server = void 0;
    this._address = void 0;
    logger?.debug("gray", "[A_ConceptInspector] server stopped");
    await this.call("_A_Inspector_onShutdown" /* onShutdown */, this.scope);
    await this.call("_A_Inspector_onAfterShutdown" /* onAfterShutdown */, this.scope);
  }
  async [_a = "_A_Inspector_onAuthenticate" /* onAuthenticate */](..._args) {
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
            type: "error" /* Error */,
            error: { title: A_InspectorError.InspectorProtocolError, description: "malformed JSON" }
          });
          socket.end();
          return;
        }
        if (!authed) {
          if (msg.type !== "auth" /* Auth */ || msg.secret !== secret) {
            send({
              type: "auth-fail" /* AuthFail */,
              reason: "invalid secret"
            });
            socket.end();
            return;
          }
          authed = true;
          send({ type: "auth-ok" /* AuthOk */ });
          continue;
        }
        if (msg.type === "command" /* Command */) {
          await this.runCommandMessage(msg, send, logger);
        } else {
          send({
            type: "error" /* Error */,
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
        type: "result" /* Result */,
        id: msg.id,
        payload: command.toJSON()
      });
    } catch (err) {
      logger?.error(err);
      send({
        type: "error" /* Error */,
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
var A_ConceptInspectorContainer = new A_ConceptInspector({
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
var InspectorChannel = class extends A_Channel {
  constructor() {
    super(...arguments);
    /** True once the auth handshake has been accepted by the server. */
    this.authed = false;
    /** Newline-delimited JSON read buffer. */
    this.readBuffer = "";
    /**
     * In-flight commands awaiting a Result/Error message correlated by id.
     */
    this.pending = /* @__PURE__ */ new Map();
  }
};
InspectorChannel = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side A_Channel for talking to a remote A_ConceptInspector server."
  })
], InspectorChannel);
var InspectorClientConfig = class extends A_Fragment {
  constructor(options) {
    super({ name: "InspectorClientConfig" });
    this.host = options.host;
    this.port = options.port;
    this.secret = options.secret;
    this.timeout = options.timeout ?? 1e4;
  }
};

// src/lib/A-Inspector/transport/InspectorChannelProcessor.component.ts
async function loadNet2() {
  try {
    const req = eval('typeof require !== "undefined" ? require : undefined');
    if (req) return req("net");
  } catch {
  }
  return await Function('return import("net")')();
}
var InspectorChannelProcessor = class extends A_Component {
  async onConnect(channel, config) {
    const net = await loadNet2();
    const { host, port, secret, timeout } = config;
    channel.authPromise = new Promise((resolve, reject) => {
      const socket = net.createConnection({ host, port }, () => {
        socket.write(JSON.stringify({
          type: "auth" /* Auth */,
          secret
        }) + "\n");
      });
      channel.socket = socket;
      socket.setEncoding("utf8");
      const authTimer = setTimeout(() => {
        socket.destroy();
        reject(new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: `inspector auth handshake timed out after ${timeout}ms`
        }));
      }, timeout);
      socket.on("data", (chunk) => {
        channel.readBuffer += chunk;
        this.drainBuffer(channel, resolve, reject, authTimer);
      });
      socket.on("error", (err) => {
        clearTimeout(authTimer);
        const e = new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: err?.message ?? String(err)
        });
        if (!channel.authed) reject(e);
        this.failAllPending(channel, e);
      });
      socket.on("close", () => {
        clearTimeout(authTimer);
        const e = new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: "inspector socket closed unexpectedly"
        });
        if (!channel.authed) reject(e);
        this.failAllPending(channel, e);
      });
    });
    await channel.authPromise;
  }
  async onRequest(channel, config, request) {
    if (!channel.socket || !channel.authed) {
      throw new A_InspectorError({
        title: A_InspectorError.InspectorTransportError,
        description: "inspector channel is not connected"
      });
    }
    const { code, payload } = request.params;
    const id = `inspector-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const timeout = config.timeout;
    const resultPayload = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        channel.pending.delete(id);
        reject(new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: `inspector command '${code}' timed out after ${timeout}ms`
        }));
      }, timeout);
      channel.pending.set(id, { id, resolve, reject, timer });
      const msg = {
        type: "command" /* Command */,
        id,
        payload: { ...payload, code }
      };
      channel.socket.write(JSON.stringify(msg) + "\n");
    });
    request.succeed({ payload: resultPayload });
  }
  async onDisconnect(channel) {
    this.failAllPending(channel, new A_InspectorError({
      title: A_InspectorError.InspectorTransportError,
      description: "inspector channel disconnected"
    }));
    try {
      channel.socket?.end();
    } catch {
    }
    try {
      channel.socket?.destroy();
    } catch {
    }
    channel.socket = void 0;
    channel.authed = false;
    channel.readBuffer = "";
    channel.authPromise = void 0;
  }
  // ====================================================================
  // ===========================  HELPERS  ==============================
  // ====================================================================
  drainBuffer(channel, resolveAuth, rejectAuth, authTimer) {
    let nl = channel.readBuffer.indexOf("\n");
    while (nl !== -1) {
      const line = channel.readBuffer.slice(0, nl);
      channel.readBuffer = channel.readBuffer.slice(nl + 1);
      nl = channel.readBuffer.indexOf("\n");
      if (!line.trim()) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch (err) {
        continue;
      }
      switch (msg.type) {
        case "auth-ok" /* AuthOk */: {
          channel.authed = true;
          clearTimeout(authTimer);
          resolveAuth();
          break;
        }
        case "auth-fail" /* AuthFail */: {
          clearTimeout(authTimer);
          rejectAuth(new A_InspectorError({
            title: A_InspectorError.InspectorAuthError,
            description: msg.reason ?? "auth rejected"
          }));
          break;
        }
        case "result" /* Result */: {
          const r = msg;
          const slot = channel.pending.get(r.id);
          if (!slot) break;
          channel.pending.delete(r.id);
          clearTimeout(slot.timer);
          slot.resolve(r.payload);
          break;
        }
        case "error" /* Error */: {
          const e = msg;
          if (!e.id) break;
          const slot = channel.pending.get(e.id);
          if (!slot) break;
          channel.pending.delete(e.id);
          clearTimeout(slot.timer);
          slot.reject(new A_InspectorError({
            title: e.error?.title ?? A_InspectorError.InspectorTransportError,
            description: e.error?.description
          }));
          break;
        }
      }
    }
  }
  failAllPending(channel, err) {
    for (const slot of channel.pending.values()) {
      clearTimeout(slot.timer);
      try {
        slot.reject(err);
      } catch {
      }
    }
    channel.pending.clear();
  }
};
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onConnect" /* onConnect */,
    scope: [InspectorChannel]
  }),
  __decorateParam(0, A_Inject(InspectorChannel)),
  __decorateParam(1, A_Inject(InspectorClientConfig))
], InspectorChannelProcessor.prototype, "onConnect", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onRequest" /* onRequest */,
    scope: [InspectorChannel]
  }),
  __decorateParam(0, A_Inject(InspectorChannel)),
  __decorateParam(1, A_Inject(InspectorClientConfig)),
  __decorateParam(2, A_Inject(A_ChannelRequest))
], InspectorChannelProcessor.prototype, "onRequest", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onDisconnect" /* onDisconnect */,
    scope: [InspectorChannel]
  }),
  __decorateParam(0, A_Inject(InspectorChannel))
], InspectorChannelProcessor.prototype, "onDisconnect", 1);
InspectorChannelProcessor = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Lifecycle handlers for InspectorChannel \u2014 TCP socket, auth handshake, multiplexed command roundtrips."
  })
], InspectorChannelProcessor);
var InspectorClientForwarder = class extends A_Component {
  async forward(command, channel) {
    await channel.initialize;
    const Ctor = command.constructor;
    const code = Ctor.entity ?? Ctor.code ?? Ctor.name;
    const payload = command.toJSON();
    let response;
    try {
      response = await channel.request({ code, payload });
    } catch (err) {
      const unwrapped = unwrapInspectorError(err);
      await command.fail(
        unwrapped instanceof A_InspectorError ? unwrapped : new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
          description: err?.message ?? String(err),
          originalError: err
        })
      );
      return;
    }
    const remote = response?.data?.payload;
    const remoteResult = remote?.result;
    if (process.env.A_INSPECTOR_TEST_VERBOSE) {
      console.log("[forwarder] response.data=", JSON.stringify(response?.data));
      console.log("[forwarder] remote=", JSON.stringify(remote));
      console.log("[forwarder] remoteResult=", JSON.stringify(remoteResult));
    }
    await command.complete(remoteResult);
  }
};
__decorateClass([
  A_Feature.Extend({
    name: "_A_Command_onExecute" /* onExecute */,
    scope: [A_Command]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(InspectorChannel))
], InspectorClientForwarder.prototype, "forward", 1);
InspectorClientForwarder = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side onExecute extension that forwards any A_Command it sees to a remote inspector server via the registered InspectorChannel."
  })
], InspectorClientForwarder);
function unwrapInspectorError(err) {
  let current = err;
  let found;
  const seen = /* @__PURE__ */ new Set();
  while (current && !seen.has(current)) {
    seen.add(current);
    if (current instanceof A_InspectorError) found = current;
    current = current.originalError ?? current._originalError ?? current.cause;
  }
  return found ?? err;
}

// src/lib/A-Inspector/A-InspectorClient.container.ts
var A_ConceptInspectorClient = class extends A_Container {
  constructor(config) {
    super({
      name: "inspector-client",
      components: [InspectorChannel, InspectorChannelProcessor, InspectorClientForwarder],
      entities: [
        InspectorPingCommand,
        InspectConceptCommand,
        InspectScopeCommand,
        InspectFeatureCommand
      ],
      fragments: [
        config
      ]
    });
  }
  /**
   * Gracefully disconnects the client's channel, if any. After calling
   * 
   * @returns 
   */
  async disconnect() {
    const channel = this.scope.resolve(InspectorChannel);
    if (!channel) return Promise.resolve();
    return await channel.disconnect();
  }
};
A_ConceptInspectorClient = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side running bundle for the A-Concept inspector: ships the channel transport processor + a polymorphic onExecute forwarder so any A_Command executed under its scope is shipped to a remote inspector server."
  })
], A_ConceptInspectorClient);

export { A_CONSTANTS__INSPECTOR_DEFAULT_HOST, A_CONSTANTS__INSPECTOR_DEFAULT_PORT, A_CONSTANTS__INSPECTOR_ENV_VARIABLES, A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY, A_ConceptInspector, A_ConceptInspectorClient, A_ConceptInspectorContainer, A_InspectorError, A_InspectorFeatures, A_InspectorMessageType, InspectConceptCommand, InspectFeatureCommand, InspectScopeCommand, InspectorChannel, InspectorChannelProcessor, InspectorClientConfig, InspectorClientForwarder, InspectorCommandRepository, InspectorPingCommand, InspectorSnapshotHelper };
//# sourceMappingURL=a-inspector.mjs.map
//# sourceMappingURL=a-inspector.mjs.map