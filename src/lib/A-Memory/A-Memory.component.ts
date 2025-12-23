import { A_Component, A_Inject, A_Scope, A_Feature, A_Dependency, A_Context } from "@adaas/a-concept";
import { A_MemoryFeatures } from "./A-Memory.constants";
import { A_MemoryContext } from "./A-Memory.context";
import { A_MemoryError } from "./A-Memory.error";
import { A_OperationContext } from "../A-Operation/A-Operation.context";
import { A_MemoryOperationContext } from "./A-Memory.types";


export class A_Memory<
    _StorageType extends Record<string, any> = Record<string, any>,
    _SerializedType extends Record<string, any> = Record<string, any>
> extends A_Component {

    protected _ready?: Promise<void>


    get ready(): Promise<void> {
        if (!this._ready) {
            this._ready = this.init();
        }
        return this._ready;
    }

    // ======================================================================
    // ======================A-Memory Lifecycle Hooks========================
    // ======================================================================

    @A_Feature.Extend()
    /**
     * Handles errors during memory operations
     */
    async [A_MemoryFeatures.onError](...args: any[]): Promise<void> {
        // Handle error
    }

    @A_Feature.Extend()
    /**
     * Handles memory expiration
     */
    async [A_MemoryFeatures.onExpire](...args: any[]): Promise<void> {
        // Clear memory on expire
    }

    @A_Feature.Extend()
    /**
     * Initializes the memory context
     */
    async [A_MemoryFeatures.onInit](
        @A_Inject(A_MemoryContext) context: A_MemoryContext<_StorageType>,
        ...args: any[]
    ): Promise<void> {
        // Initialize memory
        if (!context) {
            context = new A_MemoryContext<_StorageType>();
            A_Context.scope(this).register(context);
        }
    }

    @A_Feature.Extend()
    async [A_MemoryFeatures.onDestroy](
        @A_Inject(A_MemoryContext) context: A_MemoryContext<_StorageType>,
        ...args: any[]): Promise<void> {
        // Cleanup memory
        context.clear();
    }

    @A_Feature.Extend()
    /**
     * Handles the 'get' operation for retrieving a value from memory
     */
    async [A_MemoryFeatures.onGet](
        @A_Dependency.Required()
        @A_Inject(A_OperationContext) operation: A_MemoryOperationContext,
        @A_Inject(A_MemoryContext) context: A_MemoryContext<_StorageType>,
        ...args: any[]
    ): Promise<void> {
        // Handle get operation
        operation.succeed(context.get(operation.params.key));
    }

    @A_Feature.Extend()
    /**
     * Handles the 'has' operation for checking existence of a key in memory
     */
    async [A_MemoryFeatures.onHas](
        @A_Dependency.Required()
        @A_Inject(A_OperationContext) operation: A_MemoryOperationContext<boolean>,
        @A_Inject(A_MemoryContext) context: A_MemoryContext<_StorageType>,
        ...args: any[]
    ): Promise<void> {
        // Handle has operation
        operation.succeed(context.has(operation.params.key));
    }

    @A_Feature.Extend()
    /**
     * Handles the 'set' operation for saving a value in memory
     */
    async [A_MemoryFeatures.onSet](
        @A_Dependency.Required()
        @A_Inject(A_OperationContext) operation: A_MemoryOperationContext,
        @A_Inject(A_MemoryContext) context: A_MemoryContext<_StorageType>,
        @A_Inject(A_Scope) scope: A_Scope,
        ...args: any[]
    ): Promise<void> {
        // Handle set operation
        context.set(operation.params.key, operation.params.value);
    }

    @A_Feature.Extend()
    /**
     * Handles the 'drop' operation for removing a value from memory
     */
    async [A_MemoryFeatures.onDrop](
        @A_Dependency.Required()
        @A_Inject(A_OperationContext) operation: A_MemoryOperationContext,
        @A_Inject(A_MemoryContext) context: A_MemoryContext<_StorageType>,
        ...args: any[]
    ): Promise<void> {
        // Handle drop operation
        context.delete(operation.params.key);
    }

    @A_Feature.Extend()
    /**
     * Handles the 'clear' operation for clearing all values from memory
     */
    async [A_MemoryFeatures.onClear](
        @A_Dependency.Required()
        @A_Inject(A_OperationContext) operation: A_MemoryOperationContext,
        @A_Inject(A_MemoryContext) context: A_MemoryContext<_StorageType>,
        ...args: any[]
    ): Promise<void> {
        // Handle clear operation
        context.clear();
    }



    // ======================================================================
    // =========================A-Memory Methods=============================
    // ======================================================================

    /**
     * Initializes the memory context
     */
    async init() {
        if (this._ready)
            return this._ready;

        const scope = new A_Scope({ name: 'A-Memory-Init-Scope' })
            .inherit(A_Context.scope(this));

        try {
            await this.call(A_MemoryFeatures.onInit, scope);

        } catch (error) {
            const initError = new A_MemoryError({
                title: A_MemoryError.MemoryInitializationError,
                description: 'An error occurred during memory initialization',
                originalError: error
            })

            scope.register(initError);

            await this.call(A_MemoryFeatures.onError, scope);

            scope.destroy();

            throw initError;
        }
    }

    /**
     * Destroys the memory context
     *
     * This method is responsible for cleaning up any resources
     * used by the memory context and resetting its state.
     */
    async destroy() {

        const scope = new A_Scope({ name: 'A-Memory-Destroy-Scope' })
            .inherit(A_Context.scope(this));

        try {
            this._ready = undefined;

            await this.call(A_MemoryFeatures.onDestroy, scope);

        } catch (error) {
            const destroyError = new A_MemoryError({
                title: A_MemoryError.MemoryDestructionError,
                description: 'An error occurred during memory destruction',
                originalError: error
            })

            scope.register(destroyError);


            await this.call(A_MemoryFeatures.onError, scope);

            scope.destroy();

            throw destroyError;
        }
    }

    /**
      * Retrieves a value from the context memory
      * 
      * @param key - memory key to retrieve
      * @returns - value associated with the key or undefined if not found
      */
    async get<K extends keyof _StorageType>(
        /**
         * Key to retrieve the value for
         */
        key: K
    ): Promise<_StorageType[K] | undefined> {

        const operation = new A_OperationContext('get', { key });

        const scope = new A_Scope({
            name: 'A-Memory-Get-Operation-Scope',
            fragments: [operation]
        })
            .inherit(A_Context.scope(this));

        try {

            await this.call(A_MemoryFeatures.onGet, scope);

            scope.destroy();

            return operation.result;

        } catch (error) {
            const getError = new A_MemoryError({
                title: A_MemoryError.MemoryGetError,
                description: `An error occurred while getting the value for key "${String(key)}"`,
                originalError: error
            });

            scope.register(getError);

            await this.call(A_MemoryFeatures.onError, scope);

            scope.destroy();

            throw getError;
        }
    }

    /**
     * Checks if a value exists in the context memory
     * 
     * @param key - memory key to check
     * @returns - true if key exists, false otherwise
     */
    async has(key: keyof _StorageType): Promise<boolean> {
        const operation = new A_OperationContext('has', { key });

        const scope = new A_Scope({
            name: 'A-Memory-Has-Operation-Scope',
            fragments: [operation]
        })
            .inherit(A_Context.scope(this));

        try {

            await this.call(A_MemoryFeatures.onHas, scope);

            scope.destroy();

            return operation.result;

        } catch (error) {
            const getError = new A_MemoryError({
                title: A_MemoryError.MemoryHasError,
                description: `An error occurred while checking existence for key "${String(key)}"`,
                originalError: error
            });

            scope.register(getError);

            await this.call(A_MemoryFeatures.onError, scope);

            scope.destroy();

            throw getError;
        }
    }

    /**
     * Saves a value in the context memory
     * 
     * @param key 
     * @param value 
     */
    async set<K extends keyof _StorageType>(
        /**
         * Key to save the value under
         */
        key: K,
        /**
         * Value to save
         */
        value: _StorageType[K]
    ): Promise<void> {
        const operation = new A_OperationContext('set', { key, value });

        const scope = new A_Scope({
            name: 'A-Memory-Set-Operation-Scope',
            fragments: [operation]
        })
            .inherit(A_Context.scope(this));

        try {

            await this.call(A_MemoryFeatures.onSet, scope);

        } catch (error) {
            const setError = new A_MemoryError({
                title: A_MemoryError.MemorySetError,
                description: `An error occurred while setting the value for key "${String(key)}"`,
                originalError: error
            });

            scope.register(setError);

            await this.call(A_MemoryFeatures.onError, scope);

            scope.destroy();

            throw setError;
        }
    }


    /**
     * Removes a value from the context memory by key
     * 
     * @param key 
     */
    async drop(key: keyof _StorageType): Promise<void> {

        const operation = new A_OperationContext('drop', { key });

        const scope = new A_Scope({
            name: 'A-Memory-Drop-Operation-Scope',
            fragments: [operation]
        })
            .inherit(A_Context.scope(this));

        try {

            await this.call(A_MemoryFeatures.onDrop, scope);

        } catch (error) {
            const dropError = new A_MemoryError({
                title: A_MemoryError.MemoryDropError,
                description: `An error occurred while dropping the value for key "${String(key)}"`,
                originalError: error
            });

            scope.register(dropError);

            await this.call(A_MemoryFeatures.onError, scope);

            scope.destroy();

            throw dropError;
        }
    }

    /**
     * Clears all stored values in the context memory
     */
    async clear(): Promise<void> {
        const operation = new A_OperationContext('clear');

        const scope = new A_Scope({
            name: 'A-Memory-Clear-Operation-Scope',
            fragments: [operation]
        })
            .inherit(A_Context.scope(this));

        try {

            await this.call(A_MemoryFeatures.onClear, scope);

        } catch (error) {
            const clearError = new A_MemoryError({
                title: A_MemoryError.MemoryClearError,
                description: `An error occurred while clearing the memory`,
                originalError: error
            });

            scope.register(clearError);

            await this.call(A_MemoryFeatures.onError, scope);

            scope.destroy();

            throw clearError;
        }
    }


    /**
     * Serializes the memory context to a JSON object
     *  
     * @returns - serialized memory object 
     */
    async toJSON(): Promise<_SerializedType> {
        const operation = new A_OperationContext('serialize');

        const scope = new A_Scope({
            name: 'A-Memory-Serialize-Operation-Scope',
            fragments: [operation]
        })
            .inherit(A_Context.scope(this));

        try {

            await this.call(A_MemoryFeatures.onSerialize, scope);

            return operation.result as _SerializedType;

        } catch (error) {
            const serializeError = new A_MemoryError({
                title: A_MemoryError.MemorySerializeError,
                description: `An error occurred while serializing the memory`,
                originalError: error
            });

            scope.register(serializeError);

            await this.call(A_MemoryFeatures.onError, scope);

            scope.destroy();

            throw serializeError;
        }

    }
}