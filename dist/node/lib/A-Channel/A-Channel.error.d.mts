import { A_Error } from '@adaas/a-concept';
import { A_OperationContext } from '../A-Operation/A-Operation.context.mjs';
import '../A-Operation/A-Operation.types.mjs';
import '../A-Execution/A-Execution.context.mjs';

declare class A_ChannelError extends A_Error {
    static readonly MethodNotImplemented = "A-Channel Method Not Implemented";
    protected _context?: A_OperationContext;
    /**
     * Channel Error allows to keep track of errors within a channel if something goes wrong
     *
     *
     * @param originalError
     * @param context
     */
    constructor(originalError: string | A_Error | Error | any, context?: A_OperationContext | string);
    /***
     * Returns Context of the error
     */
    get context(): A_OperationContext | undefined;
}

export { A_ChannelError };
