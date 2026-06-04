import { A_Container } from '@adaas/a-concept';
import { InspectorClientConfig } from './transport/InspectorClientConfig.fragment.js';
import './A-Inspector.types.js';
import '../../A-Command.entity-ISgSk8wB.js';
import '../A-Command/A-Command.constants.js';
import '../A-StateMachine/A-StateMachine.component.js';
import '../A-StateMachine/A-StateMachine.constants.js';
import '../A-StateMachine/A-StateMachineTransition.context.js';
import '../A-Operation/A-Operation.context.js';
import '../A-Operation/A-Operation.types.js';
import '../A-Execution/A-Execution.context.js';
import '../A-StateMachine/A-StateMachine.types.js';
import '../A-Logger/A-Logger.component.js';
import '../A-Logger/A-Logger.types.js';
import '../A-Logger/A-Logger.constants.js';
import '../A-Logger/A-Logger.env.js';
import '../A-Config/A-Config.context.js';
import '../A-Config/A-Config.types.js';
import '../A-Config/A-Config.constants.js';
import './A-Inspector.constants.js';

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

export { A_ConceptInspectorClient };
