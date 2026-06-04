export { A as A_Channel, a as A_ChannelFeatures, b as A_ChannelRequest, c as A_ChannelRequestStatuses } from './A-Channel.component-CmLnTLks.mjs';
import { A_Error } from '@adaas/a-concept';
import { A_OperationContext } from './a-operation.mjs';
import './a-execution.mjs';

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
