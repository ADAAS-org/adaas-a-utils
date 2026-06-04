import { A_Fragment } from '@adaas/a-concept';
import { A_TYPES__InspectorClientOptions } from '../A-Inspector.types.mjs';
import '../../../A-Command.entity-24rvXQLC.mjs';
import '../../A-Command/A-Command.constants.mjs';
import '../../A-StateMachine/A-StateMachine.component.mjs';
import '../../A-StateMachine/A-StateMachine.constants.mjs';
import '../../A-StateMachine/A-StateMachineTransition.context.mjs';
import '../../A-Operation/A-Operation.context.mjs';
import '../../A-Operation/A-Operation.types.mjs';
import '../../A-Execution/A-Execution.context.mjs';
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

export { InspectorClientConfig };
