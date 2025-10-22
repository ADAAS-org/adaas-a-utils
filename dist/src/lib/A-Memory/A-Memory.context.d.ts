import { A_Error, A_Fragment } from "@adaas/a-concept";
export declare class A_Memory<_MemoryType extends Record<string, any> = Record<string, any>, _SerializedType extends Record<string, any> = Record<string, any>> extends A_Fragment {
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
    constructor(initialValues?: _MemoryType);
    get Errors(): Set<A_Error> | undefined;
    /**
     * Verifies that all required keys are present in the proxy values
     *
     * @param requiredKeys
     * @returns
     */
    verifyPrerequisites(requiredKeys: Array<keyof _MemoryType>): Promise<boolean>;
    /**
     * Adds an error to the context
     *
     * @param error
     */
    error(error: A_Error): Promise<void>;
    /**
     * Saves a value in the context memory
     *
     * @param key
     * @param value
     */
    set<K extends keyof _MemoryType>(
    /**
     * Key to save the value under
     */
    key: K, 
    /**
     * Value to save
     */
    value: _MemoryType[K]): Promise<void>;
    /**
     * Removes a value from the context memory by key
     *
     * @param key
     */
    drop(key: keyof _MemoryType): Promise<void>;
    /**
     * Clears all stored values in the context memory
     */
    clear(): Promise<void>;
    /**
     * Converts all stored values to a plain object
     *
     * [!] By default uses all saved in memory values
     *
     * @returns
     */
    toJSON(): _SerializedType;
}
