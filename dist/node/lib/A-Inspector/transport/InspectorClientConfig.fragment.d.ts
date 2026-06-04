import { A_Fragment } from '@adaas/a-concept';
import { A_TYPES__InspectorClientOptions } from '../A-Inspector.types.js';
import '../../../A-Command.entity-ISgSk8wB.js';
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
import '../A-Inspector.constants.js';

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
