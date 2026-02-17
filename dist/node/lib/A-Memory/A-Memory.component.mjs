import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Component, A_Context, A_Scope, A_Feature, A_Inject, A_Dependency } from '@adaas/a-concept';
import { A_MemoryFeatures } from './A-Memory.constants';
import { A_MemoryContext } from './A-Memory.context';
import { A_MemoryError } from './A-Memory.error';
import { A_OperationContext } from '@adaas/a-utils/a-operation';
import { A_Frame } from '@adaas/a-frame';

var _a, _b, _c, _d, _e, _f, _g, _h, _i;
let A_Memory = class extends A_Component {
  get ready() {
    if (!this._ready) {
      this._ready = this.init();
    }
    return this._ready;
  }
  /**
   * Handles errors during memory operations
   */
  async [_i = A_MemoryFeatures.onError](...args) {
  }
  /**
   * Handles memory expiration
   */
  async [_h = A_MemoryFeatures.onExpire](...args) {
  }
  /**
   * Initializes the memory context
   */
  async [_g = A_MemoryFeatures.onInit](context, ...args) {
    if (!context) {
      context = new A_MemoryContext();
      A_Context.scope(this).register(context);
    }
  }
  async [_f = A_MemoryFeatures.onDestroy](context, ...args) {
    context.clear();
  }
  async [_e = A_MemoryFeatures.onGet](operation, context, ...args) {
    operation.succeed(context.get(operation.params.key));
  }
  /**
   * Handles the 'has' operation for checking existence of a key in memory
   */
  async [_d = A_MemoryFeatures.onHas](operation, context, ...args) {
    operation.succeed(context.has(operation.params.key));
  }
  /**
   * Handles the 'set' operation for saving a value in memory
   */
  async [_c = A_MemoryFeatures.onSet](operation, context, scope, ...args) {
    context.set(operation.params.key, operation.params.value);
  }
  /**
   * Handles the 'drop' operation for removing a value from memory
   */
  async [_b = A_MemoryFeatures.onDrop](operation, context, ...args) {
    context.delete(operation.params.key);
  }
  /**
   * Handles the 'clear' operation for clearing all values from memory
   */
  async [_a = A_MemoryFeatures.onClear](operation, context, ...args) {
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
    const scope = new A_Scope({ name: "A-Memory-Init-Scope" }).inherit(A_Context.scope(this));
    try {
      await this.call(A_MemoryFeatures.onInit, scope);
    } catch (error) {
      const initError = new A_MemoryError({
        title: A_MemoryError.MemoryInitializationError,
        description: "An error occurred during memory initialization",
        originalError: error
      });
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
    const scope = new A_Scope({ name: "A-Memory-Destroy-Scope" }).inherit(A_Context.scope(this));
    try {
      this._ready = void 0;
      await this.call(A_MemoryFeatures.onDestroy, scope);
    } catch (error) {
      const destroyError = new A_MemoryError({
        title: A_MemoryError.MemoryDestructionError,
        description: "An error occurred during memory destruction",
        originalError: error
      });
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
  async get(key) {
    const operation = new A_OperationContext("get", { key });
    const scope = new A_Scope({
      name: "A-Memory-Get-Operation-Scope",
      fragments: [operation]
    }).inherit(A_Context.scope(this));
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
  async has(key) {
    const operation = new A_OperationContext("has", { key });
    const scope = new A_Scope({
      name: "A-Memory-Has-Operation-Scope",
      fragments: [operation]
    }).inherit(A_Context.scope(this));
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
  async set(key, value) {
    const operation = new A_OperationContext("set", { key, value });
    const scope = new A_Scope({
      name: "A-Memory-Set-Operation-Scope",
      fragments: [operation]
    }).inherit(A_Context.scope(this));
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
  async drop(key) {
    const operation = new A_OperationContext("drop", { key });
    const scope = new A_Scope({
      name: "A-Memory-Drop-Operation-Scope",
      fragments: [operation]
    }).inherit(A_Context.scope(this));
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
  async clear() {
    const operation = new A_OperationContext("clear");
    const scope = new A_Scope({
      name: "A-Memory-Clear-Operation-Scope",
      fragments: [operation]
    }).inherit(A_Context.scope(this));
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
  async toJSON() {
    const operation = new A_OperationContext("serialize");
    const scope = new A_Scope({
      name: "A-Memory-Serialize-Operation-Scope",
      fragments: [operation]
    }).inherit(A_Context.scope(this));
    try {
      await this.call(A_MemoryFeatures.onSerialize, scope);
      return operation.result;
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
};
__decorateClass([
  A_Feature.Extend()
], A_Memory.prototype, _i, 1);
__decorateClass([
  A_Feature.Extend()
], A_Memory.prototype, _h, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_MemoryContext))
], A_Memory.prototype, _g, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_MemoryContext))
], A_Memory.prototype, _f, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_OperationContext)),
  __decorateParam(1, A_Inject(A_MemoryContext))
], A_Memory.prototype, _e, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_OperationContext)),
  __decorateParam(1, A_Inject(A_MemoryContext))
], A_Memory.prototype, _d, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_OperationContext)),
  __decorateParam(1, A_Inject(A_MemoryContext)),
  __decorateParam(2, A_Inject(A_Scope))
], A_Memory.prototype, _c, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_OperationContext)),
  __decorateParam(1, A_Inject(A_MemoryContext))
], A_Memory.prototype, _b, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_OperationContext)),
  __decorateParam(1, A_Inject(A_MemoryContext))
], A_Memory.prototype, _a, 1);
A_Memory = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "A-Memory",
    description: "In-memory data storage component that provides a simple key-value store with asynchronous operations. It supports basic memory operations such as get, set, has, drop, and clear, along with lifecycle management and error handling features. This components features can be extended with other components to provide ability store data across multiple storage, or extract data from multiple external sources. Good example is to store some runtime data that needs to be shared across multiple containers or concepts."
  })
], A_Memory);

export { A_Memory };
//# sourceMappingURL=A-Memory.component.mjs.map
//# sourceMappingURL=A-Memory.component.mjs.map