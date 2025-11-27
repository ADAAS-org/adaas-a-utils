import { A_Fragment, A_Meta, A_TYPES__Fragment_Serialized } from "@adaas/a-concept";



export class A_ExecutionContext<
    _MetaType extends Record<string, any> = Record<string, any>,
    _SerializedType extends Record<string, any> = Record<string, any>
> extends A_Fragment {


    protected _meta: A_Meta<_MetaType, _SerializedType>;

    constructor(
        name: string,
        defaults?: Partial<_MetaType>,
    ) {
        super({ name });
        this._meta = new A_Meta<_MetaType, _SerializedType>();

        for (const key in defaults) {
            this._meta.set(key as keyof _MetaType, defaults[key as keyof _MetaType] as _MetaType[keyof _MetaType]);
        }
    }


    [Symbol.iterator](): Iterator<[keyof _MetaType, _MetaType[keyof _MetaType]]> {
        return this._meta[Symbol.iterator]();
    }


    get meta(): A_Meta<_MetaType> {
        return this._meta;
    }


    get(key: keyof _MetaType): _MetaType[keyof _MetaType] | undefined {
        return this._meta.get(key);
    }

    set(key: keyof _MetaType, value: _MetaType[keyof _MetaType]): void {
        this._meta.set(key, value);
    }

    has(key: keyof _MetaType): boolean {
        return this._meta.has(key);
    }

    drop(key: keyof _MetaType): void {
        this._meta.delete(key);
    }

    clear(): void {
        this._meta.clear();
    }


    toRaw(): _SerializedType {
        return this._meta.toJSON();
    }

    toJSON(): A_TYPES__Fragment_Serialized {
        return {
            name: this.name,
            ...this.meta.toJSON(),
        }
    }
}