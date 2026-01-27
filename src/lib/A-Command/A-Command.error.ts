import { A_Error } from "@adaas/a-concept";


export class A_CommandError extends A_Error {


    static readonly CommandScopeBindingError = 'A-Command Scope Binding Error';

    static readonly ExecutionError = 'A-Command Execution Error';

    static readonly ResultProcessingError = 'A-Command Result Processing Error';


    /**
     * Error indicating that the command was interrupted during execution
     */
    static readonly CommandInterruptedError = 'A-Command Interrupted Error';
}