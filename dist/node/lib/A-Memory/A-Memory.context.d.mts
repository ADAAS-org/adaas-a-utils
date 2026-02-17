import { A_TYPES__Fragment_Serialized, A_Fragment } from '@adaas/a-concept';

declare class A_MemoryContext<_MemoryType extends Record<string, any> = Record<string, any>, _SerializedType extends A_TYPES__Fragment_Serialized = A_TYPES__Fragment_Serialized> extends A_Fragment {
    protected _storage: Map<keyof _MemoryType, _MemoryType[keyof _MemoryType]>;
    set<K extends keyof _MemoryType>(param: K, value: _MemoryType[K]): void;
    get<K extends keyof _MemoryType>(param: K): _MemoryType[K] | undefined;
    delete<K extends keyof _MemoryType>(param: K): void;
    has<K extends keyof _MemoryType>(param: K): boolean;
    clear(): void;
}

export { A_MemoryContext };
