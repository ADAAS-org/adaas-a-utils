import { A_Error, A_Fragment, A_TYPES__Fragment_Serialized } from "@adaas/a-concept";
import { error } from "console";




export class A_MemoryContext<
    _MemoryType extends Record<string, any> = Record<string, any>,
    _SerializedType extends A_TYPES__Fragment_Serialized = A_TYPES__Fragment_Serialized
> extends A_Fragment<_MemoryType, _MemoryType & _SerializedType> {


    set<K extends keyof _MemoryType>(param: 'error', value: A_Error): void
    set<K extends keyof _MemoryType>(param: K, value: _MemoryType[K]): void
    set<K extends keyof _MemoryType>(param: K | 'error', value: _MemoryType[K]): void {
        super.set(param , value);
    }


    get<K extends keyof A_Error>(param: 'error'): A_Error | undefined
    get<K extends keyof _MemoryType>(param: K): _MemoryType[K] | undefined
    get<K extends keyof _MemoryType>(param: K | 'error'): _MemoryType[K] | undefined {
        return super.get(param);
    }

}