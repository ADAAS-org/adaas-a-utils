import { A_Component } from '@adaas/a-concept';
import { A_ChannelRequest } from '../../A-Channel/A-ChannelRequest.context.mjs';
import { InspectorChannel } from './InspectorChannel.mjs';
import { InspectorClientConfig } from './InspectorClientConfig.fragment.mjs';
import '../../A-Operation/A-Operation.context.mjs';
import '../../A-Operation/A-Operation.types.mjs';
import '../../A-Execution/A-Execution.context.mjs';
import '../../A-Channel/A-Channel.constants.mjs';
import '../../A-Channel/A-Channel.component.mjs';
import '../A-Inspector.types.mjs';
import '../../../A-Command.entity-24rvXQLC.mjs';
import '../../A-Command/A-Command.constants.mjs';
import '../../A-StateMachine/A-StateMachine.component.mjs';
import '../../A-StateMachine/A-StateMachine.constants.mjs';
import '../../A-StateMachine/A-StateMachineTransition.context.mjs';
import '../../A-StateMachine/A-StateMachine.types.mjs';
import '../../A-Logger/A-Logger.component.mjs';
import '../../A-Logger/A-Logger.types.mjs';
import '../../A-Logger/A-Logger.constants.mjs';
import '../../A-Logger/A-Logger.env.mjs';
import '../../A-Config/A-Config.context.mjs';
import '../../A-Config/A-Config.types.mjs';
import '../../A-Config/A-Config.constants.mjs';
import '../A-Inspector.constants.mjs';

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
