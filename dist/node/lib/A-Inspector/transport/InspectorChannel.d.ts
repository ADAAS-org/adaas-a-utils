import { A_Channel } from '../../A-Channel/A-Channel.component.js';
import '@adaas/a-concept';
import '../../A-Operation/A-Operation.context.js';
import '../../A-Operation/A-Operation.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-Channel/A-ChannelRequest.context.js';
import '../../A-Channel/A-Channel.constants.js';

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

export { type A_TYPES__InspectorPendingRequest, InspectorChannel };
