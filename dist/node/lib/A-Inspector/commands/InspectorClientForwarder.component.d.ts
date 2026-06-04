import { A_Component } from '@adaas/a-concept';
import { A as A_Command } from '../../../A-Command.entity-ISgSk8wB.js';
import { InspectorChannel } from '../transport/InspectorChannel.js';
import '../../A-Command/A-Command.constants.js';
import '../../A-StateMachine/A-StateMachine.component.js';
import '../../A-StateMachine/A-StateMachine.constants.js';
import '../../A-StateMachine/A-StateMachineTransition.context.js';
import '../../A-Operation/A-Operation.context.js';
import '../../A-Operation/A-Operation.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-StateMachine/A-StateMachine.types.js';
import '../../A-Logger/A-Logger.component.js';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.constants.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.context.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Config/A-Config.constants.js';
import '../../A-Channel/A-Channel.component.js';
import '../../A-Channel/A-ChannelRequest.context.js';
import '../../A-Channel/A-Channel.constants.js';

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

export { InspectorClientForwarder };
