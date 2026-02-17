import { A_Fragment, A_Meta, A_TYPES__Fragment_Serialized } from '@adaas/a-concept';

declare class A_ExecutionContext<_MetaType extends Record<string, any> = Record<string, any>, _SerializedType extends Record<string, any> = Record<string, any>> extends A_Fragment {
    protected _meta: A_Meta<_MetaType, _SerializedType>;
    constructor(name: string, defaults?: Partial<_MetaType>);
    [Symbol.iterator](): Iterator<[keyof _MetaType, _MetaType[keyof _MetaType]]>;
    get meta(): A_Meta<_MetaType>;
    get<K extends keyof _MetaType>(key: K): _MetaType[K] | undefined;
    set<K extends keyof _MetaType>(key: K, value: _MetaType[K]): this;
    has(key: keyof _MetaType): boolean;
    drop(key: keyof _MetaType): void;
    clear(): this;
    toRaw(): _SerializedType;
    toJSON(): A_TYPES__Fragment_Serialized;
}

export { A_ExecutionContext };
