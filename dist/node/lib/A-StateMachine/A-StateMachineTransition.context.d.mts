import { A_OperationContext } from '../A-Operation/A-Operation.context.mjs';
import { A_StateMachineTransitionParams, A_StateMachineTransitionStorage } from './A-StateMachine.types.mjs';
import '@adaas/a-concept';
import '../A-Operation/A-Operation.types.mjs';
import '../A-Execution/A-Execution.context.mjs';

declare class A_StateMachineTransition<_ParamsType = any, _ResultType = any> extends A_OperationContext<'a-state-machine-transition', A_StateMachineTransitionParams<_ParamsType>, _ResultType, A_StateMachineTransitionStorage<_ResultType, _ParamsType>> {
    constructor(params: A_StateMachineTransitionParams<_ParamsType>);
    /**
     * The state to transition from
     */
    get from(): string;
    /**
     * The state to transition to
     */
    get to(): string;
}

export { A_StateMachineTransition };
