import { A_Error, A_TypeGuards } from "@adaas/a-concept";
import { A_OperationContext } from "../A-Operation/A-Operation.context";


export class A_ChannelError extends A_Error {

    // ==========================================================
    // ==================== Error Types =========================
    // ==========================================================


    static readonly MethodNotImplemented = 'A-Channel Method Not Implemented';

    // ==========================================================
    // ==================== Properties ==========================
    // ==========================================================

    protected _context?: A_OperationContext


    /**
     * Channel Error allows to keep track of errors within a channel if something goes wrong
     * 
     * 
     * @param originalError 
     * @param context 
     */
    constructor(
        originalError: string | A_Error | Error | any,
        context?: A_OperationContext | string
    ) {
        if (A_TypeGuards.isString(context))
            super(originalError, context);
        else
            super(originalError);

        if (context instanceof A_OperationContext)
            this._context = context
    }

    /***
     * Returns Context of the error
     */
    get context(): A_OperationContext | undefined {
        return this._context
    }


}