import { A_Error, A_TYPES__Error_Serialized } from "@adaas/a-concept"


export type A_Operation_Storage<
    _Result_type extends any = any,
    _ParamsType extends Record<string, any> = Record<string, any>,
> = {
    /**
     * The name of the operation
     */
    name: string,
    /**
     * The parameters for the operation
     */
    params: _ParamsType,
    /**
     * The result of the operation
     */
    result: _Result_type,
    /**
     * Any error that occurred during the operation
     */
    error?: A_Error
}


export type A_Operation_Serialized<
    _Result_type extends any = any,
    _ParamsType extends Record<string, any> = Record<string, any>,
> = {
    /**
     * The name of the operation
     */
    name: string,
    /**
     * The parameters for the operation
     */
    params: _ParamsType,
    /**
     * The result of the operation
     */
    result: _Result_type,
    /**
     * Any error that occurred during the operation
     */
    error?: A_TYPES__Error_Serialized,
}