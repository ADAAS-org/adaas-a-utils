import { A_Component, A_Scope } from '@adaas/a-concept';
import { A_MemoryFeatures } from './A-Memory.constants.js';
import { A_MemoryContext } from './A-Memory.context.js';
import { A_MemoryOperationContext } from './A-Memory.types.js';
import '../A-Operation/A-Operation.context.js';
import '../A-Operation/A-Operation.types.js';
import '../A-Execution/A-Execution.context.js';

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

export { A_Memory };
