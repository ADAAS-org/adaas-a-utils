import { A_OperationContext } from './chunk-72ANHWNG.mjs';
import './chunk-TQ5UON22.mjs';
import { __decorateClass, __decorateParam } from './chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Dependency, A_Scope, A_Fragment, A_Error, A_Component, A_Context } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

// src/lib/A-Memory/A-Memory.constants.ts
var A_MemoryFeatures = /* @__PURE__ */ ((A_MemoryFeatures2) => {
  A_MemoryFeatures2["onInit"] = "_A_Memory_onInit";
  A_MemoryFeatures2["onDestroy"] = "_A_Memory_onDestroy";
  A_MemoryFeatures2["onExpire"] = "_A_Memory_onExpire";
  A_MemoryFeatures2["onError"] = "_A_Memory_onError";
  A_MemoryFeatures2["onSerialize"] = "_A_Memory_onSerialize";
  A_MemoryFeatures2["onSet"] = "_A_Memory_onSet";
  A_MemoryFeatures2["onGet"] = "_A_Memory_onGet";
  A_MemoryFeatures2["onDrop"] = "_A_Memory_onDrop";
  A_MemoryFeatures2["onClear"] = "_A_Memory_onClear";
  A_MemoryFeatures2["onHas"] = "_A_Memory_onHas";
  return A_MemoryFeatures2;
})(A_MemoryFeatures || {});
var A_MemoryContext = class extends A_Fragment {
  constructor() {
    super(...arguments);
    this._storage = /* @__PURE__ */ new Map();
  }
  set(param, value) {
    this._storage.set(param, value);
  }
  get(param) {
    return this._storage.get(param);
  }
  delete(param) {
    this._storage.delete(param);
  }
  has(param) {
    return this._storage.has(param);
  }
  clear() {
    this._storage.clear();
  }
};
A_MemoryContext = __decorateClass([
  A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-MemoryContext",
    description: "In-memory context fragment that provides a simple key-value store for temporary data storage during application runtime. It allows setting, getting, deleting, and checking the existence of key-value pairs, facilitating quick access to transient data without persistent storage. This context is useful for scenarios where data needs to be shared across different components or operations within the same execution context."
  })
], A_MemoryContext);
var A_MemoryError = class extends A_Error {
};
A_MemoryError.MemoryInitializationError = "Memory initialization error";
A_MemoryError.MemoryDestructionError = "Memory destruction error";
A_MemoryError.MemoryGetError = "Memory GET operation failed";
A_MemoryError.MemorySetError = "Memory SET operation failed";
A_MemoryError.MemoryDropError = "Memory DROP operation failed";
A_MemoryError.MemoryClearError = "Memory CLEAR operation failed";
A_MemoryError.MemoryHasError = "Memory HAS operation failed";
A_MemoryError.MemorySerializeError = "Memory toJSON operation failed";
var _a, _b, _c, _d, _e, _f, _g, _h, _i;
var A_Memory = class extends A_Component {
  get ready() {
    if (!this._ready) {
      this._ready = this.init();
    }
    return this._ready;
  }
  /**
   * Handles errors during memory operations
   */
  async [_i = "_A_Memory_onError" /* onError */](...args) {
  }
  /**
   * Handles memory expiration
   */
  async [_h = "_A_Memory_onExpire" /* onExpire */](...args) {
  }
  /**
   * Initializes the memory context
   */
  async [_g = "_A_Memory_onInit" /* onInit */](context, ...args) {
    if (!context) {
      context = new A_MemoryContext();
      A_Context.scope(this).register(context);
    }
  }
  async [_f = "_A_Memory_onDestroy" /* onDestroy */](context, ...args) {
    context.clear();
  }
  async [_e = "_A_Memory_onGet" /* onGet */](operation, context, ...args) {
    operation.succeed(context.get(operation.params.key));
  }
  /**
   * Handles the 'has' operation for checking existence of a key in memory
   */
  async [_d = "_A_Memory_onHas" /* onHas */](operation, context, ...args) {
    operation.succeed(context.has(operation.params.key));
  }
  /**
   * Handles the 'set' operation for saving a value in memory
   */
  async [_c = "_A_Memory_onSet" /* onSet */](operation, context, scope, ...args) {
    context.set(operation.params.key, operation.params.value);
  }
  /**
   * Handles the 'drop' operation for removing a value from memory
   */
  async [_b = "_A_Memory_onDrop" /* onDrop */](operation, context, ...args) {
    context.delete(operation.params.key);
  }
  /**
   * Handles the 'clear' operation for clearing all values from memory
   */
  async [_a = "_A_Memory_onClear" /* onClear */](operation, context, ...args) {
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
      await this.call("_A_Memory_onInit" /* onInit */, scope);
    } catch (error) {
      const initError = new A_MemoryError({
        title: A_MemoryError.MemoryInitializationError,
        description: "An error occurred during memory initialization",
        originalError: error
      });
      scope.register(initError);
      await this.call("_A_Memory_onError" /* onError */, scope);
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
      await this.call("_A_Memory_onDestroy" /* onDestroy */, scope);
    } catch (error) {
      const destroyError = new A_MemoryError({
        title: A_MemoryError.MemoryDestructionError,
        description: "An error occurred during memory destruction",
        originalError: error
      });
      scope.register(destroyError);
      await this.call("_A_Memory_onError" /* onError */, scope);
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
      await this.call("_A_Memory_onGet" /* onGet */, scope);
      scope.destroy();
      return operation.result;
    } catch (error) {
      const getError = new A_MemoryError({
        title: A_MemoryError.MemoryGetError,
        description: `An error occurred while getting the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(getError);
      await this.call("_A_Memory_onError" /* onError */, scope);
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
      await this.call("_A_Memory_onHas" /* onHas */, scope);
      scope.destroy();
      return operation.result;
    } catch (error) {
      const getError = new A_MemoryError({
        title: A_MemoryError.MemoryHasError,
        description: `An error occurred while checking existence for key "${String(key)}"`,
        originalError: error
      });
      scope.register(getError);
      await this.call("_A_Memory_onError" /* onError */, scope);
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
      await this.call("_A_Memory_onSet" /* onSet */, scope);
    } catch (error) {
      const setError = new A_MemoryError({
        title: A_MemoryError.MemorySetError,
        description: `An error occurred while setting the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(setError);
      await this.call("_A_Memory_onError" /* onError */, scope);
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
      await this.call("_A_Memory_onDrop" /* onDrop */, scope);
    } catch (error) {
      const dropError = new A_MemoryError({
        title: A_MemoryError.MemoryDropError,
        description: `An error occurred while dropping the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(dropError);
      await this.call("_A_Memory_onError" /* onError */, scope);
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
      await this.call("_A_Memory_onClear" /* onClear */, scope);
    } catch (error) {
      const clearError = new A_MemoryError({
        title: A_MemoryError.MemoryClearError,
        description: `An error occurred while clearing the memory`,
        originalError: error
      });
      scope.register(clearError);
      await this.call("_A_Memory_onError" /* onError */, scope);
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
      await this.call("_A_Memory_onSerialize" /* onSerialize */, scope);
      return operation.result;
    } catch (error) {
      const serializeError = new A_MemoryError({
        title: A_MemoryError.MemorySerializeError,
        description: `An error occurred while serializing the memory`,
        originalError: error
      });
      scope.register(serializeError);
      await this.call("_A_Memory_onError" /* onError */, scope);
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

export { A_Memory, A_MemoryContext, A_MemoryError, A_MemoryFeatures };
//# sourceMappingURL=a-memory.mjs.map
//# sourceMappingURL=a-memory.mjs.map