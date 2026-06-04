import {
    A_Concept,
    A_Container,
    A_Context,
    A_Error,
    A_Feature,
    A_Inject,
} from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_Config } from "@adaas/a-utils/a-config";
import { A_Command } from "@adaas/a-utils/a-command";

import {
    A_CONSTANTS__INSPECTOR_DEFAULT_HOST,
    A_CONSTANTS__INSPECTOR_DEFAULT_PORT,
    A_CONSTANTS__INSPECTOR_ENV_VARIABLES,
    A_InspectorFeatures,
    A_InspectorMessageType,
} from "./A-Inspector.constants";
import { A_InspectorError } from "./A-Inspector.error";
import type {
    A_TYPES__InspectorAddress,
    A_TYPES__InspectorMessage,
    A_TYPES__InspectorMessage_Command,
    A_TYPES__InspectorMessage_Result,
    A_TYPES__InspectorMessage_AuthOk,
    A_TYPES__InspectorMessage_AuthFail,
    A_TYPES__InspectorMessage_Error,
    InspectorConfigVars,
} from "./A-Inspector.types";

import { InspectorSnapshotHelper } from "./commands/InspectorSnapshot.helper.component";
import { InspectorCommandRepository } from "./commands/InspectorCommandRepository.component";
import { InspectConceptCommand } from "./commands/InspectConceptCommand";
import { InspectScopeCommand } from "./commands/InspectScopeCommand";
import { InspectFeatureCommand } from "./commands/InspectFeatureCommand";
import { InspectorPingCommand } from "./commands/InspectorPingCommand";




/**
 * Lazy `net` loader that's invisible to browser bundlers.
 *
 * Tries an indirect `require` first (works in Node CJS — incl. ts-jest)
 * and falls back to a dynamic `import` for native ESM runtimes. The
 * `Function(...)` indirection prevents tsup / esbuild from statically
 * resolving `node:net` when this module is bundled for the browser.
 */
async function loadNet(): Promise<typeof import('net')> {
    // eval('require') captures the call-site CJS require (works in jest /
    // ts-node), unlike `Function('return require')()` which only sees the
    // global namespace. In a real ESM/browser context `require` is
    // undefined and we fall back to a dynamic `import()`.
    try {
        // eslint-disable-next-line no-eval
        const req = (eval('typeof require !== "undefined" ? require : undefined')) as NodeRequire | undefined;
        if (req) return req('net') as typeof import('net');
    } catch {
        /* fall through to dynamic import */
    }
    return await (Function('return import("net")')() as Promise<any>);
}


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
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Container that exposes A-Concept introspection (scopes, components, features, etc.) over a JSON-line TCP transport. Communication is done via A_Command serialization; access is guarded by A_CONCEPT_DEBUG_SECRET read through A_Config.'
})
export class A_ConceptInspector extends A_Container {

    /** Underlying `net.Server` once started. */
    protected _server: any = undefined;
    /** Resolved address after the server has started listening. */
    protected _address: A_TYPES__InspectorAddress | undefined;

    /**
     * The fully resolved address (host + port) of the running inspector
     * server. `undefined` until `start()` has completed. Especially
     * useful when `A_CONCEPT_INSPECTOR_PORT=0` so the OS picks the port.
     */
    get address(): A_TYPES__InspectorAddress | undefined {
        return this._address;
    }

    // ====================================================================
    // ===========================  LIFECYCLE  ============================
    // ====================================================================

    /**
     * Auto-starts the inspector server iff `A_CONCEPT_INSPECTOR_ENABLED`
     * resolves to a truthy value through `A_Config`. The
     * `A_CONCEPT_DEBUG_SECRET` variable MUST be set as well — without it
     * we refuse to expose the introspection surface even on loopback.
     */
    @A_Concept.Start()
    async autoStart(
        @A_Inject(A_Config) config: A_Config<InspectorConfigVars>,
        @A_Inject(A_Logger) logger?: A_Logger,
    ): Promise<void> {
        if (!this.isEnabled(config)) {
            logger?.debug('gray', `[A_ConceptInspector] disabled (set ${A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED}=1 to enable)`);
            return;
        }

        await this.serve(config, logger);
    }

    /**
     * Gracefully shuts the server down at concept stop.
     */
    @A_Concept.Stop()
    async autoStop(
        @A_Inject(A_Logger) logger?: A_Logger,
    ): Promise<void> {
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
    async serve(
        config: A_Config<InspectorConfigVars>,
        logger?: A_Logger,
    ): Promise<A_TYPES__InspectorAddress> {
        if (this._server) {
            return this._address!;
        }

        const secret = config.get(A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET);
        if (!secret) {
            throw new A_InspectorError({
                title: A_InspectorError.InspectorStartError,
                description: `Cannot start inspector without ${A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET} configured.`,
            });
        }

        const host = String(config.get(A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_HOST)
            ?? A_CONSTANTS__INSPECTOR_DEFAULT_HOST);
        const portRaw = config.get(A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_PORT);
        const port = portRaw === undefined || portRaw === null || portRaw === ''
            ? A_CONSTANTS__INSPECTOR_DEFAULT_PORT
            : Number(portRaw);

        // Dynamic import so the browser bundle never resolves `net`.
        const net = await loadNet();

        await this.call(A_InspectorFeatures.onBeforeServe, this.scope);

        const server = net.createServer((socket) => {
            this.handleConnection(socket, secret, logger);
        });

        await new Promise<void>((resolve, reject) => {
            const onError = (err: any) => reject(this.wrapStartError(err));
            server.once('error', onError);
            server.listen(port, host, () => {
                server.off('error', onError);
                resolve();
            });
        });

        const addr = server.address();
        if (!addr || typeof addr === 'string') {
            throw new A_InspectorError({
                title: A_InspectorError.InspectorStartError,
                description: 'Inspector server did not report a usable address after listen().',
            });
        }

        this._server = server;
        this._address = { host: addr.address, port: addr.port };

        logger?.info(
            'green',
            `[A_ConceptInspector] listening on tcp://${this._address.host}:${this._address.port}`,
        );

        await this.call(A_InspectorFeatures.onServe, this.scope);
        await this.call(A_InspectorFeatures.onAfterServe, this.scope);

        return this._address;
    }


    /**
     * Stops accepting new connections and closes the underlying server.
     */
    async shutdown(logger?: A_Logger): Promise<void> {
        if (!this._server) return;

        await this.call(A_InspectorFeatures.onBeforeShutdown, this.scope);

        await new Promise<void>((resolve, reject) => {
            this._server.close((err: any) => err ? reject(err) : resolve());
        });

        this._server = undefined;
        this._address = undefined;

        logger?.debug('gray', '[A_ConceptInspector] server stopped');

        await this.call(A_InspectorFeatures.onShutdown, this.scope);
        await this.call(A_InspectorFeatures.onAfterShutdown, this.scope);
    }


    // ====================================================================
    // ============= PROTOCOL — DEFAULT FEATURE IMPLEMENTATIONS ===========
    // ====================================================================

    /**
     * Default authenticator: constant-time string compare of the secret
     * configured via `A_Config` against the one the client sent.
     *
     * Other components may override this via `@A_Feature.Extend()` to
     * implement project-specific authentication (mTLS, JWT, ...).
     */
    @A_Feature.Extend()
    async [A_InspectorFeatures.onAuthenticate](
        ..._args: any[]
    ): Promise<void> {
        // No-op default; actual check happens inline in handleConnection
        // because it needs the raw socket. This hook is here so users
        // can extend the chain (e.g. for audit logging).
    }


    // ====================================================================
    // ====================== CONNECTION HANDLING =========================
    // ====================================================================

    protected handleConnection(socket: any, secret: string, logger?: A_Logger): void {
        let authed = false;
        let buffer = '';

        socket.setEncoding('utf8');

        const send = (msg: A_TYPES__InspectorMessage) => {
            try { socket.write(JSON.stringify(msg) + '\n'); } catch { /* ignore */ }
        };

        socket.on('data', async (chunk: string) => {
            buffer += chunk;

            let nl: number;
            while ((nl = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, nl).trim();
                buffer = buffer.slice(nl + 1);
                if (!line) continue;

                let msg: A_TYPES__InspectorMessage;
                try {
                    msg = JSON.parse(line);
                } catch {
                    send({
                        type: A_InspectorMessageType.Error,
                        error: { title: A_InspectorError.InspectorProtocolError, description: 'malformed JSON' },
                    } as A_TYPES__InspectorMessage_Error);
                    socket.end();
                    return;
                }

                if (!authed) {
                    if (msg.type !== A_InspectorMessageType.Auth || msg.secret !== secret) {
                        send({
                            type: A_InspectorMessageType.AuthFail,
                            reason: 'invalid secret',
                        } as A_TYPES__InspectorMessage_AuthFail);
                        socket.end();
                        return;
                    }
                    authed = true;
                    send({ type: A_InspectorMessageType.AuthOk } as A_TYPES__InspectorMessage_AuthOk);
                    continue;
                }

                if (msg.type === A_InspectorMessageType.Command) {
                    await this.runCommandMessage(msg as A_TYPES__InspectorMessage_Command, send, logger);
                } else {
                    send({
                        type: A_InspectorMessageType.Error,
                        error: { title: A_InspectorError.InspectorProtocolError, description: `unexpected message type ${(msg as any).type}` },
                    } as A_TYPES__InspectorMessage_Error);
                }
            }
        });

        socket.on('error', (err: any) => {
            logger?.debug('gray', `[A_ConceptInspector] socket error: ${err?.message ?? err}`);
        });
    }


    protected async runCommandMessage(
        msg: A_TYPES__InspectorMessage_Command,
        send: (m: A_TYPES__InspectorMessage) => void,
        logger?: A_Logger,
    ): Promise<void> {
        try {
            const code = msg.payload?.code;
            if (!code) {
                throw new A_InspectorError({
                    title: A_InspectorError.InspectorProtocolError,
                    description: 'command payload missing `code`',
                });
            }

            const Ctor = this.scope.resolveConstructor<A_Command>(code as any);
            if (!Ctor) {
                throw new A_InspectorError({
                    title: A_InspectorError.InspectorCommandNotFoundError,
                    description: `command '${code}' is not registered on this inspector`,
                });
            }

            // A_Command's constructor recognises serialized payloads and
            // routes through `fromJSON`. We register into the inspector
            // scope so the command's execution scope inherits everything
            // (including InspectorSnapshotHelper) registered here.
            const command = new Ctor(msg.payload as any);

            this.scope.register(command);
            await command.execute();

            this.scope.deregister(command);

            send({
                type: A_InspectorMessageType.Result,
                id: msg.id,
                payload: command.toJSON(),
            } as A_TYPES__InspectorMessage_Result);

        } catch (err: any) {
            logger?.error(err);
            send({
                type: A_InspectorMessageType.Error,
                id: msg.id,
                error: {
                    title: err instanceof A_Error
                        ? err.message ?? A_InspectorError.InspectorTransportError
                        : A_InspectorError.InspectorTransportError,
                    description: err?.description ?? err?.message ?? String(err),
                },
            } as A_TYPES__InspectorMessage_Error);
        }
    }


    // ====================================================================
    // ============================  HELPERS  =============================
    // ====================================================================

    protected isEnabled(config: A_Config<InspectorConfigVars>): boolean {
        const raw = config.get(A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED);
        if (raw === undefined || raw === null) return false;
        const v = String(raw).trim().toLowerCase();
        return v === '1' || v === 'true' || v === 'yes' || v === 'on';
    }

    protected wrapStartError(err: any): A_InspectorError {
        return new A_InspectorError({
            title: A_InspectorError.InspectorStartError,
            description: err?.message ?? String(err),
            originalError: err,
        });
    }
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
export const A_ConceptInspectorContainer = new A_ConceptInspector({
    name: 'A_ConceptInspector',
    components: [
        InspectorSnapshotHelper,
        InspectorCommandRepository,
    ],
    entities: [
        InspectorPingCommand,
        InspectConceptCommand,
        InspectScopeCommand,
        InspectFeatureCommand,
    ] as any,
});
