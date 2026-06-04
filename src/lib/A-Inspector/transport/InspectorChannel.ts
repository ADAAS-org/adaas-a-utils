import { A_Channel } from "@adaas/a-utils/a-channel";
import { A_Frame } from "@adaas/a-frame/core";


/**
 * Pending request slot kept while a command roundtrip is in-flight on
 * the multiplexed inspector socket.
 */
export type A_TYPES__InspectorPendingRequest = {
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
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Client-side A_Channel for talking to a remote A_ConceptInspector server.'
})
export class InspectorChannel extends A_Channel {

    /** Live socket — set by `InspectorChannelProcessor.onConnect`. */
    public socket?: any;

    /** True once the auth handshake has been accepted by the server. */
    public authed: boolean = false;

    /** Newline-delimited JSON read buffer. */
    public readBuffer: string = '';

    /**
     * In-flight commands awaiting a Result/Error message correlated by id.
     */
    public readonly pending: Map<string, A_TYPES__InspectorPendingRequest> = new Map();

    /**
     * Resolved by the processor when the server replies with `AuthOk`
     * (or rejected when it replies with `AuthFail`). Created by the
     * processor's `onConnect` hook.
     */
    public authPromise?: Promise<void>;
}
