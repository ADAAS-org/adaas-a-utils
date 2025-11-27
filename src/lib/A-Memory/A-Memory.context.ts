import { A_Error, A_Fragment, A_TYPES__Fragment_Serialized } from "@adaas/a-concept";
import { error } from "console";




export class A_MemoryContext<
    _MemoryType extends Record<string, any> = Record<string, any>,
    _SerializedType extends A_TYPES__Fragment_Serialized = A_TYPES__Fragment_Serialized
> extends A_Fragment {
    protected _storage: Map<keyof _MemoryType, _MemoryType[keyof _MemoryType]> = new Map();

    set<K extends keyof _MemoryType>(param: K, value: _MemoryType[K]): void {
        this._storage.set(param, value);
    }


    get<K extends keyof _MemoryType>(param: K): _MemoryType[K] | undefined {
        return this._storage.get(param);
    }


    delete<K extends keyof _MemoryType>(param: K): void {
        this._storage.delete(param);
    }


    has<K extends keyof _MemoryType>(param: K): boolean {
        return this._storage.has(param);
    }

    clear(): void {
        this._storage.clear();
    }
}