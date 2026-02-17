export { A as A_StateMachine, a as A_StateMachineFeatures, b as A_StateMachineTransition, c as A_StateMachineTransitionParams, d as A_StateMachineTransitionStorage } from './A-StateMachineTransition.context-BINjcsgq.mjs';
import { A_Error } from '@adaas/a-concept';
import './a-operation.mjs';
import './a-execution.mjs';

declare class A_StateMachineError extends A_Error {
    static readonly InitializationError = "A-StateMachine Initialization Error";
    static readonly TransitionError = "A-StateMachine Transition Error";
}

export { A_StateMachineError };
