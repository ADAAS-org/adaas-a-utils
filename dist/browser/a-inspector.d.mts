import { A_Error, A_Container, A_Fragment, A_Component, A_Scope, A_Entity } from '@adaas/a-concept';
import { t as A_Config, n as A_Logger } from './A-Logger.component-C7Tak6HK.mjs';
import { j as A_TYPES__Command_Serialized, A as A_Command } from './A-Command.entity-sQRtxHll.mjs';
import { A as A_Channel, b as A_ChannelRequest } from './A-Channel.component-CmLnTLks.mjs';
import './a-execution.mjs';
import './A-StateMachineTransition.context-BINjcsgq.mjs';
import './a-operation.mjs';

/**
 * A-Inspector Environment Variables
 *
 * These are read through `A_Config` (so they can come from environment
 * variables OR from a `<concept>.conf.json` file) and control how the
 * `A_ConceptInspector` container behaves at runtime.
 */
declare const A_CONSTANTS__INSPECTOR_ENV_VARIABLES: {
    /**
     * Shared secret used to authenticate inspector clients.
     *
     * The server side of the inspector will refuse any connection whose
     * handshake message does not carry exactly this value. If the variable
     * is not set, remote inspection is disabled on the server side.
     */
    readonly A_CONCEPT_DEBUG_SECRET: "A_CONCEPT_DEBUG_SECRET";
    /**
     * If set to a truthy value (`'1'`, `'true'`, `'yes'`) the inspector
     * server is started automatically together with the concept (via the
     * `@A_Concept.Start()` lifecycle hook).
     */
    readonly A_CONCEPT_INSPECTOR_ENABLED: "A_CONCEPT_INSPECTOR_ENABLED";
    /**
     * Hostname/interface the inspector TCP server binds to. Defaults to
     * `127.0.0.1` (loopback only) so the inspector is never exposed
     * outside the host unless explicitly configured.
     */
    readonly A_CONCEPT_INSPECTOR_HOST: "A_CONCEPT_INSPECTOR_HOST";
    /**
     * TCP port the inspector server listens on. `0` lets the OS pick an
     * ephemeral port — useful for tests; the chosen port is announced via
     * the container's `address` property after `start()` resolves.
     */
    readonly A_CONCEPT_INSPECTOR_PORT: "A_CONCEPT_INSPECTOR_PORT";
};
declare const A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY: readonly ["A_CONCEPT_DEBUG_SECRET", "A_CONCEPT_INSPECTOR_ENABLED", "A_CONCEPT_INSPECTOR_HOST", "A_CONCEPT_INSPECTOR_PORT"];
/**
 * Feature extension points exposed by the inspector container. Other
 * components can hook into these via `@A_Feature.Extend()` to customize
 * authentication, transport, or per-command behavior.
 */
declare enum A_InspectorFeatures {
    onBeforeServe = "_A_Inspector_onBeforeServe",
    onServe = "_A_Inspector_onServe",
    onAfterServe = "_A_Inspector_onAfterServe",
    onBeforeShutdown = "_A_Inspector_onBeforeShutdown",
    onShutdown = "_A_Inspector_onShutdown",
    onAfterShutdown = "_A_Inspector_onAfterShutdown",
    onAuthenticate = "_A_Inspector_onAuthenticate",
    onCommand = "_A_Inspector_onCommand"
}
/**
 * Wire-protocol message types exchanged between an inspector client and
 * server over the TCP transport. Messages are newline-delimited JSON.
 */
declare enum A_InspectorMessageType {
    Auth = "auth",
    AuthOk = "auth-ok",
    AuthFail = "auth-fail",
    Command = "command",
    Result = "result",
    Error = "error"
}
/** Default inspector bind host when none is configured. */
declare const A_CONSTANTS__INSPECTOR_DEFAULT_HOST = "127.0.0.1";
/** Default inspector port when none is configured (0 = OS-assigned). */
declare const A_CONSTANTS__INSPECTOR_DEFAULT_PORT = 0;

declare class A_InspectorError extends A_Error {
    static readonly InspectorStartError = "Inspector start error";
    static readonly InspectorStopError = "Inspector stop error";
    static readonly InspectorAuthError = "Inspector authentication failure";
    static readonly InspectorTransportError = "Inspector transport error";
    static readonly InspectorProtocolError = "Inspector protocol error";
    static readonly InspectorCommandNotFoundError = "Inspector command not found";
    static readonly InspectorDisabledError = "Inspector disabled";
    static readonly InspectorNotSupportedError = "Inspector not supported in this runtime";
}

type InspectorConfigVars = [
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_HOST,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_PORT
];
/**
 * Connection options used by `A_ConceptInspector.query()` to reach a
 * remote (or in-process) inspector server.
 */
type A_TYPES__InspectorClientOptions = {
    host: string;
    port: number;
    secret: string;
    /** Maximum time to wait for the remote response, in milliseconds. */
    timeout?: number;
};
/**
 * Resolved address of a running inspector server. Returned by the server
 * after `start()` completes (especially useful when port `0` was used).
 */
type A_TYPES__InspectorAddress = {
    host: string;
    port: number;
};
type A_TYPES__InspectorMessage_Auth = {
    type: A_InspectorMessageType.Auth;
    secret: string;
};
type A_TYPES__InspectorMessage_AuthOk = {
    type: A_InspectorMessageType.AuthOk;
};
type A_TYPES__InspectorMessage_AuthFail = {
    type: A_InspectorMessageType.AuthFail;
    reason: string;
};
type A_TYPES__InspectorMessage_Command = {
    type: A_InspectorMessageType.Command;
    /** Correlation id so multiple in-flight commands can share a socket. */
    id: string;
    payload: A_TYPES__Command_Serialized;
};
type A_TYPES__InspectorMessage_Result = {
    type: A_InspectorMessageType.Result;
    id: string;
    payload: A_TYPES__Command_Serialized;
};
type A_TYPES__InspectorMessage_Error = {
    type: A_InspectorMessageType.Error;
    id?: string;
    error: {
        title: string;
        description?: string;
    };
};
type A_TYPES__InspectorMessage = A_TYPES__InspectorMessage_Auth | A_TYPES__InspectorMessage_AuthOk | A_TYPES__InspectorMessage_AuthFail | A_TYPES__InspectorMessage_Command | A_TYPES__InspectorMessage_Result | A_TYPES__InspectorMessage_Error;
type A_TYPES__InspectorConceptSnapshot = {
    name: string;
    environment: string | undefined;
    rootScope: A_TYPES__InspectorScopeSnapshot;
    containers: Array<A_TYPES__InspectorContainerSnapshot>;
};
type A_TYPES__InspectorScopeSnapshot = {
    name: string;
    fingerprint: string;
    version: number;
    parent: string | undefined;
    imports: Array<string>;
    components: Array<{
        name: string;
        constructor: string;
    }>;
    fragments: Array<{
        name: string;
        constructor: string;
    }>;
    entities: Array<{
        name: string;
        constructor: string;
        aseid: string;
    }>;
    errors: Array<{
        name: string;
        code: string;
    }>;
    allowedComponents: Array<string>;
    allowedEntities: Array<string>;
    allowedFragments: Array<string>;
    allowedErrors: Array<string>;
};
type A_TYPES__InspectorContainerSnapshot = {
    name: string;
    constructor: string;
    scope: string;
};
type A_TYPES__InspectorFeatureStepSnapshot = {
    handler: string;
    dependency: string;
    order?: number;
    scope?: string;
    override?: string;
};
type A_TYPES__InspectorFeatureSnapshot = {
    component: string;
    feature: string;
    steps: Array<A_TYPES__InspectorFeatureStepSnapshot>;
};

/**
 * `A_ConceptInspector` — a container that exposes the running concept
 * to external inspector clients over a JSON-line TCP transport.
 *
 * The container ships with a built-in set of `A_Command` subclasses that
 * encode every supported introspection capability:
 *
 *   - {@link InspectConceptCommand}  – overview of the concept
 *   - {@link InspectScopeCommand}    – snapshot of a single scope
 *   - {@link InspectFeatureCommand}  – resolved feature step list
 *   - {@link InspectorPingCommand}   – auth/health check
 *
 * All wire communication is done by serializing those commands with
 * `A_Command.toJSON()`, shipping them over the socket, and executing the
 * deserialized counterpart on the server side. The server then replies
 * with the post-execution `toJSON()` payload (including `result`
 * and / or `error`). This honors the project rule that every
 * cross-process operation must travel as an `A_Command`.
 *
 * The container is safe to register in both browser and Node concepts —
 * the server-side socket is only opened in Node, and the static
 * {@link A_ConceptInspector.query} client helper uses a dynamic
 * `import('net')` so the browser build never pulls in `node:net`.
 */
declare class A_ConceptInspector extends A_Container {
    /** Underlying `net.Server` once started. */
    protected _server: any;
    /** Resolved address after the server has started listening. */
    protected _address: A_TYPES__InspectorAddress | undefined;
    /**
     * The fully resolved address (host + port) of the running inspector
     * server. `undefined` until `start()` has completed. Especially
     * useful when `A_CONCEPT_INSPECTOR_PORT=0` so the OS picks the port.
     */
    get address(): A_TYPES__InspectorAddress | undefined;
    /**
     * Auto-starts the inspector server iff `A_CONCEPT_INSPECTOR_ENABLED`
     * resolves to a truthy value through `A_Config`. The
     * `A_CONCEPT_DEBUG_SECRET` variable MUST be set as well — without it
     * we refuse to expose the introspection surface even on loopback.
     */
    autoStart(config: A_Config<InspectorConfigVars>, logger?: A_Logger): Promise<void>;
    /**
     * Gracefully shuts the server down at concept stop.
     */
    autoStop(logger?: A_Logger): Promise<void>;
    /**
     * Opens the TCP server on the configured host/port and starts
     * accepting inspector clients. May be called directly when finer
     * lifecycle control is needed (e.g. tests).
     */
    serve(config: A_Config<InspectorConfigVars>, logger?: A_Logger): Promise<A_TYPES__InspectorAddress>;
    /**
     * Stops accepting new connections and closes the underlying server.
     */
    shutdown(logger?: A_Logger): Promise<void>;
    /**
     * Default authenticator: constant-time string compare of the secret
     * configured via `A_Config` against the one the client sent.
     *
     * Other components may override this via `@A_Feature.Extend()` to
     * implement project-specific authentication (mTLS, JWT, ...).
     */
    [A_InspectorFeatures.onAuthenticate](..._args: any[]): Promise<void>;
    protected handleConnection(socket: any, secret: string, logger?: A_Logger): void;
    protected runCommandMessage(msg: A_TYPES__InspectorMessage_Command, send: (m: A_TYPES__InspectorMessage) => void, logger?: A_Logger): Promise<void>;
    protected isEnabled(config: A_Config<InspectorConfigVars>): boolean;
    protected wrapStartError(err: any): A_InspectorError;
}
/**
 * Pre-built, ready-to-register inspector SERVER container.
 *
 * Bundles everything needed to make a process remotely inspectable:
 *   - `InspectorSnapshotHelper`     — turns scope/feature graphs into
 *                                     plain JSON.
 *   - `InspectorCommandRepository`  — executes the four built-in
 *                                     `InspectXxxCommand` classes via
 *                                     `@A_Feature.Extend(onExecute)`.
 *   - The four `Inspect*` command classes themselves, registered as
 *     allowed entities so the server can rehydrate them on the wire
 *     via `scope.resolveConstructor(code)`.
 *
 * The container itself has no client / query API — it's just a running
 * bundle. Drop it into any concept that also supplies an `A_Config`
 * fragment + `ENVConfigReader` and the TCP server auto-starts when
 * `A_CONCEPT_INSPECTOR_ENABLED=1` is set.
 *
 * To open a remote connection FROM a test or tool, use
 * `A_ConceptInspectorClient` from this same module.
 */
declare const A_ConceptInspectorContainer: A_ConceptInspector;

/**
 * `InspectorClientConfig` — configuration A_Fragment that supplies
 * connection options (host / port / secret / timeout) to the inspector
 * client stack.
 *
 * The fragment is registered in the client scope by the caller. The
 * `InspectorChannel` and `InspectorChannelProcessor` resolve it via
 * `@A_Inject(InspectorClientConfig)` instead of receiving options
 * through a constructor — keeping channels and components pure
 * framework entities with no ad-hoc construction parameters.
 *
 * @example
 * ```ts
 * const config = new InspectorClientConfig({ host, port, secret });
 * client.scope.register(config);
 * client.scope.register(new InspectorChannel());
 * ```
 */
declare class InspectorClientConfig extends A_Fragment {
    readonly host: string;
    readonly port: number;
    readonly secret: string;
    readonly timeout: number;
    constructor(options: A_TYPES__InspectorClientOptions);
}

/**
 * `A_ConceptInspectorClient` — running bundle for the CLIENT side of
 * the inspector protocol.
 *
 * The container itself exposes no query / RPC API — it is, like every
 * `A_Container`, just a registration bundle. Combined with a freshly
 * registered `InspectorChannel`, it lets callers execute any
 * `A_Command` instance locally and have the call transparently
 * forwarded to a remote `A_ConceptInspectorContainer`.
 *
 * Typical usage:
 *
 * ```ts
 * import {
 *     A_ConceptInspectorClient,
 *     InspectorChannel,
 *     InspectorPingCommand,
 * } from '@adaas/a-utils/a-inspector';
 *
 * const client  = new A_ConceptInspectorClient({ name: 'inspector-client' });
 * const channel = new InspectorChannel({ host, port, secret });
 *
 * client.scope.register(channel);
 *
 * const ping = new InspectorPingCommand({ token: 'hello' });
 * client.scope.register(ping);
 *
 * await ping.execute();              // travels over the wire
 * console.log(ping.result?.pong);    // -> true
 * ```
 *
 * The container pre-registers `InspectorChannelProcessor` (so the
 * channel actually opens / authenticates), `InspectorClientForwarder`
 * (the polymorphic `onExecute` interceptor), and the four built-in
 * `Inspect*` command classes as allowed entities — registering custom
 * command classes is done at consumer level.
 */
declare class A_ConceptInspectorClient extends A_Container {
    constructor(config: InspectorClientConfig);
    /**
     * Gracefully disconnects the client's channel, if any. After calling
     *
     * @returns
     */
    disconnect(): Promise<void>;
}

/**
 * Trivial command that round-trips a single string token. Used by
 * clients to verify connectivity and authentication without doing
 * any introspection work on the server.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onPingExecute`.
 */
declare class InspectorPingCommand extends A_Command<{
    token?: string;
}, {
    pong: true;
    token: string;
    serverTime: string;
}> {
    static get entity(): string;
}

/**
 * Returns a high-level snapshot of the running concept: its name,
 * runtime environment, root scope contents, and all containers known
 * through `A_Context`'s allocation registry.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectConceptExecute`.
 */
declare class InspectConceptCommand extends A_Command<{}, {
    snapshot: A_TYPES__InspectorConceptSnapshot;
}> {
    static get entity(): string;
}

type InspectScopeCommandParams = {
    /**
     * Either a scope name (matches against `scope.name`) or the literal
     * string `"root"` to inspect the concept's root scope. If omitted,
     * defaults to the root scope.
     */
    scope?: string;
};
/**
 * Returns a snapshot of a single scope reachable from the root scope.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectScopeExecute`.
 */
declare class InspectScopeCommand extends A_Command<InspectScopeCommandParams, {
    snapshot: A_TYPES__InspectorScopeSnapshot;
}> {
    static get entity(): string;
}

type InspectFeatureCommandParams = {
    /** Name of the component / container / entity to inspect. */
    component: string;
    /** Name of the feature to inspect. */
    feature: string;
    /** Optional scope name to evaluate the feature template under. */
    scope?: string;
};
/**
 * Returns the topologically-sorted step list that would execute when
 * `<component>.call(<feature>)` is invoked under the given scope.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectFeatureExecute`.
 */
declare class InspectFeatureCommand extends A_Command<InspectFeatureCommandParams, {
    snapshot: A_TYPES__InspectorFeatureSnapshot;
}> {
    static get entity(): string;
}

/**
 * `InspectorSnapshotHelper` is a regular `A_Component` (NOT a loose
 * utility module) whose only purpose is to turn the live in-memory
 * `A_Context`/`A_Scope` graph into plain serializable snapshots that
 * the inspection commands can return as their `result`.
 *
 * Keeping the snapshot logic inside a component keeps it within the
 * A-Concept dependency-injection world: commands receive it via
 * `@A_Inject(InspectorSnapshotHelper)`, individual hosts can replace
 * it by registering a subclass, and we don't leak any "free functions"
 * into the public surface.
 */
declare class InspectorSnapshotHelper extends A_Component {
    scopeSnapshot(scope: A_Scope): A_TYPES__InspectorScopeSnapshot;
    /**
     * Walks the registry of allocated containers reachable from the
     * given scope (and its inherited/imported scopes) and returns a
     * stable list of container snapshots.
     */
    collectContainers(scope: A_Scope): Array<A_TYPES__InspectorContainerSnapshot>;
    /**
     * Build a feature snapshot for the given component + feature name
     * by reusing the same machinery `A_Feature` does (template steps).
     */
    featureSnapshot(component: A_Component | A_Container | A_Entity, feature: string, scope: A_Scope): A_TYPES__InspectorFeatureSnapshot;
    protected safeScopeName(component: A_Container | A_Component): string;
}

/**
 * `InspectorCommandRepository` — server-side executor for every
 * `A_Command` shipped by `A_ConceptInspector`.
 *
 * Mirrors the canonical ADAAS "command + repository" pattern (see
 * `AisKnowledgeBaseRepository.onIngestKbFileCommandExecute`):
 *
 *   - The command classes (`InspectorPingCommand`, `InspectConceptCommand`,
 *     ...) are pure typed data shells — they declare `params` /
 *     `result` shapes and a stable `entity` name. They can therefore
 *     live in any environment (browser, Node, worker) and ship over
 *     the wire by themselves.
 *   - This component listens on `A_CommandFeatures.onExecute` scoped to
 *     each command class, and supplies the actual execution logic.
 *     `A_ConceptInspector` registers it into the inspector container's
 *     own scope, so feature dispatch resolves it for any command that
 *     is registered into that scope before `execute()` is invoked.
 */
declare class InspectorCommandRepository extends A_Component {
    onPingExecute(command: InspectorPingCommand, logger: A_Logger): Promise<void>;
    onInspectConceptExecute(command: InspectConceptCommand, snap: InspectorSnapshotHelper, logger: A_Logger): Promise<void>;
    onInspectScopeExecute(command: InspectScopeCommand, snap: InspectorSnapshotHelper): Promise<void>;
    onInspectFeatureExecute(command: InspectFeatureCommand, snap: InspectorSnapshotHelper, logger: A_Logger): Promise<void>;
    protected findScope(start: A_Scope, name: string): A_Scope | undefined;
}

/**
 * Pending request slot kept while a command roundtrip is in-flight on
 * the multiplexed inspector socket.
 */
type A_TYPES__InspectorPendingRequest = {
    id: string;
    resolve: (payload: any) => void;
    reject: (err: any) => void;
    timer?: any;
};
/**
 * `InspectorChannel` — `A_Channel` specialization that owns ONE TCP
 * socket to a remote `A_ConceptInspector` server.
 *
 * The channel is a pure typed marker: it carries the per-connection
 * runtime state (`socket`, `authed`, `readBuffer`, `pending`) and the
 * processor (`InspectorChannelProcessor`) supplies all behavior.
 * Connection options (host / port / secret / timeout) are NOT passed
 * through a constructor — they are resolved from an
 * `InspectorClientConfig` A_Fragment registered in the client scope.
 *
 * @example
 * ```ts
 * client.scope.register(new InspectorClientConfig({ host, port, secret }));
 * client.scope.register(new InspectorChannel());
 * ```
 */
declare class InspectorChannel extends A_Channel {
    /** Live socket — set by `InspectorChannelProcessor.onConnect`. */
    socket?: any;
    /** True once the auth handshake has been accepted by the server. */
    authed: boolean;
    /** Newline-delimited JSON read buffer. */
    readBuffer: string;
    /**
     * In-flight commands awaiting a Result/Error message correlated by id.
     */
    readonly pending: Map<string, A_TYPES__InspectorPendingRequest>;
    /**
     * Resolved by the processor when the server replies with `AuthOk`
     * (or rejected when it replies with `AuthFail`). Created by the
     * processor's `onConnect` hook.
     */
    authPromise?: Promise<void>;
}

/**
 * `InspectorClientForwarder` — the client-side counterpart of
 * `InspectorCommandRepository`.
 *
 * Where the server's repository defines `@A_Feature.Extend(onExecute)`
 * handlers for each concrete inspect command, this forwarder defines a
 * SINGLE polymorphic `onExecute` extension scoped to `A_Command`. The
 * feature template builder walks the caller's class chain — for any
 * concrete `Inspect*Command` subclass the chain includes `A_Command`,
 * so this extension applies to every command executed under a scope
 * that has the forwarder + a connected `InspectorChannel` registered.
 *
 * The forwarder serializes the command, ships it through the channel,
 * waits for the server's serialized response, then completes / fails
 * the local command instance with the remote result. This means tests
 * (and tools) can simply write:
 *
 * ```ts
 * client.scope.register(channel);
 * const ping = new InspectorPingCommand({ token: 'hi' });
 * client.scope.register(ping);
 * await ping.execute();
 * console.log(ping.result?.pong); // true
 * ```
 *
 * No `query()` helper, no static command list — execution flows through
 * the standard `A_Command` pipeline.
 */
declare class InspectorClientForwarder extends A_Component {
    forward(command: A_Command<any, any>, channel: InspectorChannel): Promise<void>;
}

/**
 * `InspectorChannelProcessor` — supplies the real lifecycle behavior
 * for `InspectorChannel`. Mirrors the canonical A-Channel split where
 * the channel class is a typed marker and the processor component
 * (scoped to that class) holds the logic.
 *
 * Responsibilities:
 *   - `onConnect`  → open TCP socket, send `Auth`, wait for `AuthOk`.
 *   - `onRequest`  → ship a `Command` message, await its correlated
 *                    `Result` (or `Error`), and write the payload back
 *                    into the `A_ChannelRequest` result.
 *   - `onDisconnect` → resolve any in-flight pendings with an error
 *                      and close the socket.
 */
declare class InspectorChannelProcessor extends A_Component {
    onConnect(channel: InspectorChannel, config: InspectorClientConfig): Promise<void>;
    onRequest(channel: InspectorChannel, config: InspectorClientConfig, request: A_ChannelRequest<{
        code: string;
        payload: any;
    }, {
        payload: any;
    }>): Promise<void>;
    onDisconnect(channel: InspectorChannel): Promise<void>;
    protected drainBuffer(channel: InspectorChannel, resolveAuth: () => void, rejectAuth: (err: any) => void, authTimer: any): void;
    protected failAllPending(channel: InspectorChannel, err: any): void;
}

export { A_CONSTANTS__INSPECTOR_DEFAULT_HOST, A_CONSTANTS__INSPECTOR_DEFAULT_PORT, A_CONSTANTS__INSPECTOR_ENV_VARIABLES, A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY, A_ConceptInspector, A_ConceptInspectorClient, A_ConceptInspectorContainer, A_InspectorError, A_InspectorFeatures, A_InspectorMessageType, type A_TYPES__InspectorAddress, type A_TYPES__InspectorClientOptions, type A_TYPES__InspectorConceptSnapshot, type A_TYPES__InspectorContainerSnapshot, type A_TYPES__InspectorFeatureSnapshot, type A_TYPES__InspectorFeatureStepSnapshot, type A_TYPES__InspectorMessage, type A_TYPES__InspectorMessage_Auth, type A_TYPES__InspectorMessage_AuthFail, type A_TYPES__InspectorMessage_AuthOk, type A_TYPES__InspectorMessage_Command, type A_TYPES__InspectorMessage_Error, type A_TYPES__InspectorMessage_Result, type A_TYPES__InspectorPendingRequest, type A_TYPES__InspectorScopeSnapshot, InspectConceptCommand, InspectFeatureCommand, InspectScopeCommand, InspectorChannel, InspectorChannelProcessor, InspectorClientConfig, InspectorClientForwarder, InspectorCommandRepository, type InspectorConfigVars, InspectorPingCommand, InspectorSnapshotHelper };
