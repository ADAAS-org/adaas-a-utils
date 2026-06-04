import { A_Container } from '@adaas/a-concept';
import { A_Logger } from '../A-Logger/A-Logger.component.mjs';
import { A_Config } from '../A-Config/A-Config.context.mjs';
import { A_InspectorFeatures } from './A-Inspector.constants.mjs';
import { A_InspectorError } from './A-Inspector.error.mjs';
import { A_TYPES__InspectorAddress, InspectorConfigVars, A_TYPES__InspectorMessage_Command, A_TYPES__InspectorMessage } from './A-Inspector.types.mjs';
import '../A-Logger/A-Logger.types.mjs';
import '../A-Logger/A-Logger.constants.mjs';
import '../A-Logger/A-Logger.env.mjs';
import '../A-Config/A-Config.types.mjs';
import '../A-Execution/A-Execution.context.mjs';
import '../A-Config/A-Config.constants.mjs';
import '../../A-Command.entity-24rvXQLC.mjs';
import '../A-Command/A-Command.constants.mjs';
import '../A-StateMachine/A-StateMachine.component.mjs';
import '../A-StateMachine/A-StateMachine.constants.mjs';
import '../A-StateMachine/A-StateMachineTransition.context.mjs';
import '../A-Operation/A-Operation.context.mjs';
import '../A-Operation/A-Operation.types.mjs';
import '../A-StateMachine/A-StateMachine.types.mjs';

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

export { A_ConceptInspector, A_ConceptInspectorContainer };
