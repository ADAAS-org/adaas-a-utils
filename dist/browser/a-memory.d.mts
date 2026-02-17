import { A_TYPES__Fragment_Serialized, A_Fragment, A_Error, A_Component, A_Scope } from '@adaas/a-concept';
import { A_OperationContext } from './a-operation.mjs';
import './a-execution.mjs';

declare enum A_MemoryFeatures {
    /**
     * Allows to extend initialization logic and behavior
     */
    onInit = "_A_Memory_onInit",
    /**
     * Allows to extend destruction logic and behavior
     */
    onDestroy = "_A_Memory_onDestroy",
    /**
     * Allows to extend expiration logic and behavior
     */
    onExpire = "_A_Memory_onExpire",
    /**
     * Allows to extend error handling logic and behavior
     */
    onError = "_A_Memory_onError",
    /**
     * Allows to extend serialization logic and behavior
     */
    onSerialize = "_A_Memory_onSerialize",
    /**
     * Allows to extend set operation logic and behavior
     */
    onSet = "_A_Memory_onSet",
    /**
     * Allows to extend get operation logic and behavior
     */
    onGet = "_A_Memory_onGet",
    /**
     * Allows to extend drop operation logic and behavior
     */
    onDrop = "_A_Memory_onDrop",
    /**
     * Allows to extend clear operation logic and behavior
     */
    onClear = "_A_Memory_onClear",
    /**
     * Allows to extend has operation logic and behavior
     */
    onHas = "_A_Memory_onHas"
}

declare class A_MemoryContext<_MemoryType extends Record<string, any> = Record<string, any>, _SerializedType extends A_TYPES__Fragment_Serialized = A_TYPES__Fragment_Serialized> extends A_Fragment {
    protected _storage: Map<keyof _MemoryType, _MemoryType[keyof _MemoryType]>;
    set<K extends keyof _MemoryType>(param: K, value: _MemoryType[K]): void;
    get<K extends keyof _MemoryType>(param: K): _MemoryType[K] | undefined;
    delete<K extends keyof _MemoryType>(param: K): void;
    has<K extends keyof _MemoryType>(param: K): boolean;
    clear(): void;
}

type A_MemoryContextMeta<T extends Record<string, any> = Record<string, any>> = Omit<T, 'error'> & {
    error?: A_Error;
};
type A_Memory_Storage = Record<string, any> & {
    error?: A_Error;
};
type A_MemoryOperations = 'get' | 'set' | 'drop' | 'clear' | 'has' | 'serialize';
type A_MemoryOperationContext<T extends any = any> = A_OperationContext<A_MemoryOperations, {
    key: string;
    value?: any;
}, T>;
type A_MemoryOperationContextMeta<T extends any = any, I extends any = any> = {
    result: T;
    operation: A_MemoryOperations;
    key: string;
    value?: I;
};

declare class A_Memory<_StorageType extends Record<string, any> = Record<string, any>, _SerializedType extends Record<string, any> = Record<string, any>> extends A_Component {
    protected _ready?: Promise<void>;
    get ready(): Promise<void>;
    [A_MemoryFeatures.onError](...args: any[]): Promise<void>;
    [A_MemoryFeatures.onExpire](...args: any[]): Promise<void>;
    [A_MemoryFeatures.onInit](context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onDestroy](context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    /**
     * Handles the 'get' operation for retrieving a value from memory
     */
    [A_MemoryFeatures.onGet](operation: A_MemoryOperationContext, context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onHas](operation: A_MemoryOperationContext<boolean>, context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onSet](operation: A_MemoryOperationContext, context: A_MemoryContext<_StorageType>, scope: A_Scope, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onDrop](operation: A_MemoryOperationContext, context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onClear](operation: A_MemoryOperationContext, context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    /**
     * Initializes the memory context
     */
    init(): Promise<void>;
    /**
     * Destroys the memory context
     *
     * This method is responsible for cleaning up any resources
     * used by the memory context and resetting its state.
     */
    destroy(): Promise<void>;
    /**
      * Retrieves a value from the context memory
      *
      * @param key - memory key to retrieve
      * @returns - value associated with the key or undefined if not found
      */
    get<K extends keyof _StorageType>(
    /**
     * Key to retrieve the value for
     */
    key: K): Promise<_StorageType[K] | undefined>;
    /**
     * Checks if a value exists in the context memory
     *
     * @param key - memory key to check
     * @returns - true if key exists, false otherwise
     */
    has(key: keyof _StorageType): Promise<boolean>;
    /**
     * Saves a value in the context memory
     *
     * @param key
     * @param value
     */
    set<K extends keyof _StorageType>(
    /**
     * Key to save the value under
     */
    key: K, 
    /**
     * Value to save
     */
    value: _StorageType[K]): Promise<void>;
    /**
     * Removes a value from the context memory by key
     *
     * @param key
     */
    drop(key: keyof _StorageType): Promise<void>;
    /**
     * Clears all stored values in the context memory
     */
    clear(): Promise<void>;
    /**
     * Serializes the memory context to a JSON object
     *
     * @returns - serialized memory object
     */
    toJSON(): Promise<_SerializedType>;
}

declare class A_MemoryError extends A_Error {
    static readonly MemoryInitializationError = "Memory initialization error";
    static readonly MemoryDestructionError = "Memory destruction error";
    static readonly MemoryGetError = "Memory GET operation failed";
    static readonly MemorySetError = "Memory SET operation failed";
    static readonly MemoryDropError = "Memory DROP operation failed";
    static readonly MemoryClearError = "Memory CLEAR operation failed";
    static readonly MemoryHasError = "Memory HAS operation failed";
    static readonly MemorySerializeError = "Memory toJSON operation failed";
}

export { A_Memory, A_MemoryContext, type A_MemoryContextMeta, A_MemoryError, A_MemoryFeatures, type A_MemoryOperationContext, type A_MemoryOperationContextMeta, type A_MemoryOperations, type A_Memory_Storage };
