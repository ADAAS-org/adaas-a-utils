import { A_Error, A_Fragment } from "@adaas/a-concept";


export class A_Memory<
    _MemoryType extends Record<string, any> = Record<string, any>,
    _SerializedType extends Record<string, any> = Record<string, any>
> extends A_Fragment {


    /**
     * Internal storage of all intermediate values
     */
    protected _memory: Map<keyof _MemoryType, _MemoryType[keyof _MemoryType]>;
    /**
     * Errors encountered during the execution
     */
    protected _errors: Set<A_Error>;



    /**
     * Memory object that allows to store intermediate values and errors
     * 
     * @param initialValues 
     */
    constructor(initialValues?: _MemoryType) {
        super();
        this._memory = new Map(Object.entries(initialValues || {}));
        this._errors = new Set();
    }


    get Errors(): Set<A_Error> | undefined {
        return this._errors.size > 0 ? this._errors : undefined;
    }


    /**
     * Verifies that all required keys are present in the proxy values
     * 
     * @param requiredKeys 
     * @returns 
     */
    async prerequisites(
        requiredKeys: Array<keyof _MemoryType>
    ): Promise<boolean> {
        return requiredKeys.every(key => this._memory.has(key));
    }

    /**
     * Adds an error to the context
     * 
     * @param error 
     */
    async error(error: A_Error): Promise<void> {
        this._errors.add(error);
    }

    /**
     * Retrieves a value from the context memory
     * 
     * @param key 
     * @returns 
     */
    get<K extends keyof _MemoryType>(
        /**
         * Key to retrieve the value for
         */
        key: K
    ): _MemoryType[K] | undefined {
        return this._memory.get(key);
    }

    /**
     * Saves a value in the context memory
     * 
     * @param key 
     * @param value 
     */
    async set<K extends keyof _MemoryType>(
        /**
         * Key to save the value under
         */
        key: K,
        /**
         * Value to save
         */
        value: _MemoryType[K]
    ): Promise<void> {
        this._memory.set(key, value);
    }


    /**
     * Removes a value from the context memory by key
     * 
     * @param key 
     */
    async drop(key: keyof _MemoryType): Promise<void> {
        this._memory.delete(key);
    }

    /**
     * Clears all stored values in the context memory
     */
    async clear(): Promise<void> {
        this._memory.clear();
    }


    /**
     * Converts all stored values to a plain object
     * 
     * [!] By default uses all saved in memory values 
     * 
     * @returns 
     */
    toJSON(): _SerializedType {
        const obj: Record<string, any> = {};

        this._memory.forEach((value, key) => {
            obj[key as string] =
                typeof value === 'object' && value !== null && 'toJSON' in value && typeof value.toJSON === 'function'
                    ? value.toJSON()
                    : value;
        });

        return obj as _SerializedType;
    }
}