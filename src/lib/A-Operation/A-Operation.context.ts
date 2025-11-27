import { A_Error, A_Fragment } from "@adaas/a-concept";
import { A_Operation_Serialized, A_Operation_Storage } from "./A-Operation.types";
import { A_ExecutionContext } from "../A-Execution/A-Execution.context";

export class A_OperationContext<
    _AllowedOperations extends string = string,
    _ParamsType extends Record<string, any> = Record<string, any>,
    _ResultType = any,
    _StorageType extends A_Operation_Storage<_ResultType, _ParamsType> = A_Operation_Storage<_ResultType, _ParamsType>
> extends A_ExecutionContext<
    _StorageType,
    A_Operation_Serialized<_ResultType, _ParamsType>
> {

    constructor(
        operation: _AllowedOperations,
        params?: _ParamsType
    ) {
        super('operation-context');

        this.meta.set('name', operation);
        this.meta.set('params', params || {} as _ParamsType);
    }

    get name(): _AllowedOperations {
        return (this._meta.get('name') || this._name) as _AllowedOperations;
    }

    get result(): _ResultType | undefined {
        return this._meta.get('result');
    }

    get error(): A_Error | undefined {
        return this._meta.get('error');
    }

    get params(): _ParamsType {
        return this._meta.get('params') || {} as _ParamsType;
    }


    fail(error: A_Error): void {
        this._meta.set('error', error);
    }

    succeed(result: _ResultType): void {
        this._meta.set('result', result);
    }


    toJSON(): A_Operation_Serialized<_ResultType, _ParamsType> {
        return {
            name: this.name,
            params: this.params,
            result: this.result || {} as _ResultType,
            error: this.error?.toJSON(),
        }
    }
}