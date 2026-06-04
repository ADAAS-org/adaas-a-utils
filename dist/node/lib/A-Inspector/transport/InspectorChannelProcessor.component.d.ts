import { A_Component } from '@adaas/a-concept';
import { A_ChannelRequest } from '../../A-Channel/A-ChannelRequest.context.js';
import { InspectorChannel } from './InspectorChannel.js';
import { InspectorClientConfig } from './InspectorClientConfig.fragment.js';
import '../../A-Operation/A-Operation.context.js';
import '../../A-Operation/A-Operation.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-Channel/A-Channel.constants.js';
import '../../A-Channel/A-Channel.component.js';
import '../A-Inspector.types.js';
import '../../../A-Command.entity-ISgSk8wB.js';
import '../../A-Command/A-Command.constants.js';
import '../../A-StateMachine/A-StateMachine.component.js';
import '../../A-StateMachine/A-StateMachine.constants.js';
import '../../A-StateMachine/A-StateMachineTransition.context.js';
import '../../A-StateMachine/A-StateMachine.types.js';
import '../../A-Logger/A-Logger.component.js';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.constants.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.context.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Config/A-Config.constants.js';
import '../A-Inspector.constants.js';

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

export { InspectorChannelProcessor };
