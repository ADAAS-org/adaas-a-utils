import { A_Error } from "@adaas/a-concept";


export class A_StateMachineError extends A_Error {

    static readonly InitializationError = 'A-StateMachine Initialization Error';

    static readonly TransitionError = 'A-StateMachine Transition Error';
    
}