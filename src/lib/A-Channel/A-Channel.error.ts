import { A_Error, A_TypeGuards } from "@adaas/a-concept";
import { A_ChannelRequest } from "./A-ChannelRequest.context";


export class A_ChannelError extends A_Error {

    // ==========================================================
    // ==================== Error Types =========================
    // ==========================================================


    static readonly MethodNotImplemented = 'A-Channel Method Not Implemented';

    // ==========================================================
    // ==================== Properties ==========================
    // ==========================================================

    protected _context?: A_ChannelRequest


    /**
     * Channel Error allows to keep track of errors within a channel if something goes wrong
     * 
     * 
     * @param originalError 
     * @param context 
     */
    constructor(
        originalError: string | A_Error | Error | any,
        context?: A_ChannelRequest | string
    ) {
        if (A_TypeGuards.isString(context))
            super(originalError, context);
        else
            super(originalError);

        if (context instanceof A_ChannelRequest)
            this._context = context
    }

    /***
     * Returns Context of the error
     */
    get context(): A_ChannelRequest | undefined {
        return this._context
    }


}