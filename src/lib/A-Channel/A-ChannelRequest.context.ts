import { A_Error, A_Fragment } from "@adaas/a-concept";
import { A_ChannelRequestStatuses } from "./A-Channel.constants";
import { A_ChannelRequestContext_Serialized } from "./A-Channel.types";


export class A_ChannelRequestContext<
    _ParamsType extends Record<string, any> = Record<string, any>,
    _ResultType extends Record<string, any> = Record<string, any>,
> extends A_Fragment {


    protected _params: _ParamsType;
    protected _result?: _ResultType;
    protected _errors: Set<Error> = new Set();

    protected _status: A_ChannelRequestStatuses = A_ChannelRequestStatuses.PENDING;


    constructor(
        params: Partial<_ParamsType> = {}
    ) {
        super();
        this._params = params as _ParamsType;
    }

    /**
     * Returns the status of the request
     */
    get status(): A_ChannelRequestStatuses {
        return this._status;
    }

    /**
     * Returns the parameters of the request
     */
    get failed(): boolean {
        return this._errors.size > 0;
    }
    /**
     * Returns the Params of the Request
     */
    get params() {
        return this._params;
    }
    /**
     * Returns the Result of the Request
     */
    get data() {
        return this._result;
    }

    get errors(): Set<Error> | undefined {
        return this._errors.size > 0 ? this._errors : undefined;
    }

    // ==========================================================
    // ==================== Mutations ===========================
    // ==========================================================
    /**
     * Adds an error to the context
     * 
     * @param error 
     */
    fail(error: A_Error) {
        this._status = A_ChannelRequestStatuses.FAILED;
        this._errors.add(error);
    }
    /**
     * Sets the result of the request
     * 
     * @param result 
     */
    succeed(result: _ResultType) {
        this._status = A_ChannelRequestStatuses.SUCCESS;
        this._result = result;
    }

    /**
     * Serializes the context to a JSON object
     * 
     * @returns 
     */
    toJSON(): A_ChannelRequestContext_Serialized<_ParamsType, _ResultType> {
        return {
            params: this._params,
            result: this._result,
            status: this._status,
            errors: this.errors ? Array.from(this._errors).map(err => err.toString()) : undefined,
        }
    }
}