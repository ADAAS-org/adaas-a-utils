import { A_Error } from '@adaas/a-concept';
import { A_Operation_Storage, A_Operation_Serialized } from './A-Operation.types.js';
import { A_ExecutionContext } from '../A-Execution/A-Execution.context.js';

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

export { A_OperationContext };
