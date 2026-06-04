export { A as A_Command, a as A_CommandEvent, b as A_CommandEvents, c as A_CommandFeatures, d as A_CommandTransitions, e as A_Command_ExecutionContext, f as A_Command_Status, g as A_TYPES__Command_Constructor, h as A_TYPES__Command_Init, i as A_TYPES__Command_Listener, j as A_TYPES__Command_Serialized } from './A-Command.entity-sQRtxHll.mjs';
import { A_Error } from '@adaas/a-concept';
import './A-StateMachineTransition.context-BINjcsgq.mjs';
import './a-operation.mjs';
import './a-execution.mjs';
import './A-Logger.component-C7Tak6HK.mjs';

declare class A_CommandError extends A_Error {
    static readonly CommandScopeBindingError = "A-Command Scope Binding Error";
    static readonly ExecutionError = "A-Command Execution Error";
    static readonly ResultProcessingError = "A-Command Result Processing Error";
    /**
     * Error indicating that the command was interrupted during execution
     */
    static readonly CommandInterruptedError = "A-Command Interrupted Error";
}

export { A_CommandError };
