import { A_Error, A_TYPES__Error_Serialized } from '@adaas/a-concept';
import { A_ExecutionContext } from './a-execution.mjs';

type A_Operation_Storage<_Result_type extends any = any, _ParamsType extends Record<string, any> = Record<string, any>> = {
    /**
     * The name of the operation
     */
    name: string;
    /**
     * The parameters for the operation
     */
    params: _ParamsType;
    /**
     * The result of the operation
     */
    result: _Result_type;
    /**
     * Any error that occurred during the operation
     */
    error?: A_Error;
};
type A_Operation_Serialized<_Result_type extends any = any, _ParamsType extends Record<string, any> = Record<string, any>> = {
    /**
     * The name of the operation
     */
    name: string;
    /**
     * The parameters for the operation
     */
    params: _ParamsType;
    /**
     * The result of the operation
     */
    result: _Result_type;
    /**
     * Any error that occurred during the operation
     */
    error?: A_TYPES__Error_Serialized;
};

declare class A_OperationContext<_AllowedOperations extends string = string, _ParamsType extends Record<string, any> = Record<string, any>, _ResultType = any, _StorageType extends A_Operation_Storage<_ResultType, _ParamsType> = A_Operation_Storage<_ResultType, _ParamsType>> extends A_ExecutionContext<_StorageType, A_Operation_Serialized<_ResultType, _ParamsType>> {
    constructor(operation: _AllowedOperations, params?: _ParamsType);
    get name(): _AllowedOperations;
    get result(): _ResultType | undefined;
    get error(): A_Error | undefined;
    get params(): _ParamsType;
    fail(error: A_Error): void;
    succeed(result: _ResultType): void;
    toJSON(): A_Operation_Serialized<_ResultType, _ParamsType>;
}

export { A_OperationContext, type A_Operation_Serialized, type A_Operation_Storage };
