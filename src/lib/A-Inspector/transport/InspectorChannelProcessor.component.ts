import {
    A_Caller,
    A_Component,
    A_Feature,
    A_Inject,
} from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import { A_ChannelFeatures } from "@adaas/a-utils/a-channel";
import { A_ChannelRequest } from "@adaas/a-utils/a-channel";

import {
    A_InspectorMessageType,
} from "../A-Inspector.constants";
import { A_InspectorError } from "../A-Inspector.error";
import type {
    A_TYPES__InspectorMessage,
    A_TYPES__InspectorMessage_Command,
    A_TYPES__InspectorMessage_Result,
    A_TYPES__InspectorMessage_Error,
} from "../A-Inspector.types";

import { InspectorChannel } from "./InspectorChannel";
import { InspectorClientConfig } from "./InspectorClientConfig.fragment";


/**
 * Lazy require/import of the Node `net` module so the browser bundle
 * never pulls it in.
 */
async function loadNet(): Promise<typeof import('net')> {
    try {
        // eslint-disable-next-line no-eval
        const req = (eval('typeof require !== "undefined" ? require : undefined')) as NodeRequire | undefined;
        if (req) return req('net') as typeof import('net');
    } catch {
        /* fall through */
    }
    return await (Function('return import("net")')() as Promise<any>);
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
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Lifecycle handlers for InspectorChannel — TCP socket, auth handshake, multiplexed command roundtrips.'
})
export class InspectorChannelProcessor extends A_Component {

    // ====================================================================
    // ============================  CONNECT  =============================
    // ====================================================================

    @A_Feature.Extend({
        name: A_ChannelFeatures.onConnect,
        scope: [InspectorChannel],
    })
    async onConnect(
        @A_Inject(InspectorChannel) channel: InspectorChannel,
        @A_Inject(InspectorClientConfig) config: InspectorClientConfig,
    ): Promise<void> {
        const net = await loadNet();
        const { host, port, secret, timeout } = config;

        channel.authPromise = new Promise<void>((resolve, reject) => {
            const socket = net.createConnection({ host, port }, () => {
                socket.write(JSON.stringify({
                    type: A_InspectorMessageType.Auth,
                    secret,
                }) + '\n');
            });

            channel.socket = socket;
            socket.setEncoding('utf8');

            const authTimer = setTimeout(() => {
                socket.destroy();
                reject(new A_InspectorError({
                    title: A_InspectorError.InspectorTransportError,
                    description: `inspector auth handshake timed out after ${timeout}ms`,
                }));
            }, timeout);

            socket.on('data', (chunk: string) => {
                channel.readBuffer += chunk;
                this.drainBuffer(channel, resolve, reject, authTimer);
            });

            socket.on('error', (err: any) => {
                clearTimeout(authTimer);
                const e = new A_InspectorError({
                    title: A_InspectorError.InspectorTransportError,
                    description: err?.message ?? String(err),
                });
                if (!channel.authed) reject(e);
                this.failAllPending(channel, e);
            });

            socket.on('close', () => {
                clearTimeout(authTimer);
                const e = new A_InspectorError({
                    title: A_InspectorError.InspectorTransportError,
                    description: 'inspector socket closed unexpectedly',
                });
                if (!channel.authed) reject(e);
                this.failAllPending(channel, e);
            });
        });

        await channel.authPromise;
    }


    // ====================================================================
    // ============================  REQUEST  =============================
    // ====================================================================

    @A_Feature.Extend({
        name: A_ChannelFeatures.onRequest,
        scope: [InspectorChannel],
    })
    async onRequest(
        @A_Inject(InspectorChannel) channel: InspectorChannel,
        @A_Inject(InspectorClientConfig) config: InspectorClientConfig,
        @A_Inject(A_ChannelRequest) request: A_ChannelRequest<
            { code: string; payload: any },
            { payload: any }
        >,
    ): Promise<void> {
        if (!channel.socket || !channel.authed) {
            throw new A_InspectorError({
                title: A_InspectorError.InspectorTransportError,
                description: 'inspector channel is not connected',
            });
        }

        const { code, payload } = request.params;
        const id = `inspector-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const timeout = config.timeout;

        const resultPayload = await new Promise<any>((resolve, reject) => {
            const timer = setTimeout(() => {
                channel.pending.delete(id);
                reject(new A_InspectorError({
                    title: A_InspectorError.InspectorTransportError,
                    description: `inspector command '${code}' timed out after ${timeout}ms`,
                }));
            }, timeout);

            channel.pending.set(id, { id, resolve, reject, timer });

            const msg: A_TYPES__InspectorMessage_Command = {
                type: A_InspectorMessageType.Command,
                id,
                payload: { ...payload, code },
            };
            channel.socket.write(JSON.stringify(msg) + '\n');
        });

        request.succeed({ payload: resultPayload });
    }


    // ====================================================================
    // ==========================  DISCONNECT  ============================
    // ====================================================================

    @A_Feature.Extend({
        name: A_ChannelFeatures.onDisconnect,
        scope: [InspectorChannel],
    })
    async onDisconnect(
        @A_Inject(InspectorChannel) channel: InspectorChannel,
    ): Promise<void> {
        this.failAllPending(channel, new A_InspectorError({
            title: A_InspectorError.InspectorTransportError,
            description: 'inspector channel disconnected',
        }));
        try { channel.socket?.end(); } catch { /* ignore */ }
        try { channel.socket?.destroy(); } catch { /* ignore */ }
        channel.socket = undefined;
        channel.authed = false;
        channel.readBuffer = '';
        channel.authPromise = undefined;
    }


    // ====================================================================
    // ===========================  HELPERS  ==============================
    // ====================================================================

    protected drainBuffer(
        channel: InspectorChannel,
        resolveAuth: () => void,
        rejectAuth: (err: any) => void,
        authTimer: any,
    ): void {
        let nl = channel.readBuffer.indexOf('\n');
        while (nl !== -1) {
            const line = channel.readBuffer.slice(0, nl);
            channel.readBuffer = channel.readBuffer.slice(nl + 1);
            nl = channel.readBuffer.indexOf('\n');

            if (!line.trim()) continue;

            let msg: A_TYPES__InspectorMessage;
            try {
                msg = JSON.parse(line);
            } catch (err) {
                continue;
            }

            switch (msg.type) {
                case A_InspectorMessageType.AuthOk: {
                    channel.authed = true;
                    clearTimeout(authTimer);
                    resolveAuth();
                    break;
                }
                case A_InspectorMessageType.AuthFail: {
                    clearTimeout(authTimer);
                    rejectAuth(new A_InspectorError({
                        title: A_InspectorError.InspectorAuthError,
                        description: (msg as any).reason ?? 'auth rejected',
                    }));
                    break;
                }
                case A_InspectorMessageType.Result: {
                    const r = msg as A_TYPES__InspectorMessage_Result;
                    const slot = channel.pending.get(r.id);
                    if (!slot) break;
                    channel.pending.delete(r.id);
                    clearTimeout(slot.timer);
                    slot.resolve(r.payload);
                    break;
                }
                case A_InspectorMessageType.Error: {
                    const e = msg as A_TYPES__InspectorMessage_Error;
                    if (!e.id) break;
                    const slot = channel.pending.get(e.id);
                    if (!slot) break;
                    channel.pending.delete(e.id);
                    clearTimeout(slot.timer);
                    slot.reject(new A_InspectorError({
                        title: e.error?.title ?? A_InspectorError.InspectorTransportError,
                        description: e.error?.description,
                    }));
                    break;
                }
                default: {
                    /* ignore unexpected message types */
                }
            }
        }
    }

    protected failAllPending(channel: InspectorChannel, err: any): void {
        for (const slot of channel.pending.values()) {
            clearTimeout(slot.timer);
            try { slot.reject(err); } catch { /* ignore */ }
        }
        channel.pending.clear();
    }
}
