'use strict';

var aConcept = require('@adaas/a-concept');
var AMemory_constants = require('./A-Memory.constants');
var AMemory_context = require('./A-Memory.context');
var AMemory_error = require('./A-Memory.error');
var aOperation = require('@adaas/a-utils/a-operation');
var aFrame = require('@adaas/a-frame');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var _a, _b, _c, _d, _e, _f, _g, _h, _i;
exports.A_Memory = class A_Memory extends aConcept.A_Component {
  get ready() {
    if (!this._ready) {
      this._ready = this.init();
    }
    return this._ready;
  }
  /**
   * Handles errors during memory operations
   */
  async [_i = AMemory_constants.A_MemoryFeatures.onError](...args) {
  }
  /**
   * Handles memory expiration
   */
  async [_h = AMemory_constants.A_MemoryFeatures.onExpire](...args) {
  }
  /**
   * Initializes the memory context
   */
  async [_g = AMemory_constants.A_MemoryFeatures.onInit](context, ...args) {
    if (!context) {
      context = new AMemory_context.A_MemoryContext();
      aConcept.A_Context.scope(this).register(context);
    }
  }
  async [_f = AMemory_constants.A_MemoryFeatures.onDestroy](context, ...args) {
    context.clear();
  }
  async [_e = AMemory_constants.A_MemoryFeatures.onGet](operation, context, ...args) {
    operation.succeed(context.get(operation.params.key));
  }
  /**
   * Handles the 'has' operation for checking existence of a key in memory
   */
  async [_d = AMemory_constants.A_MemoryFeatures.onHas](operation, context, ...args) {
    operation.succeed(context.has(operation.params.key));
  }
  /**
   * Handles the 'set' operation for saving a value in memory
   */
  async [_c = AMemory_constants.A_MemoryFeatures.onSet](operation, context, scope, ...args) {
    context.set(operation.params.key, operation.params.value);
  }
  /**
   * Handles the 'drop' operation for removing a value from memory
   */
  async [_b = AMemory_constants.A_MemoryFeatures.onDrop](operation, context, ...args) {
    context.delete(operation.params.key);
  }
  /**
   * Handles the 'clear' operation for clearing all values from memory
   */
  async [_a = AMemory_constants.A_MemoryFeatures.onClear](operation, context, ...args) {
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
    const scope = new aConcept.A_Scope({ name: "A-Memory-Init-Scope" }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(AMemory_constants.A_MemoryFeatures.onInit, scope);
    } catch (error) {
      const initError = new AMemory_error.A_MemoryError({
        title: AMemory_error.A_MemoryError.MemoryInitializationError,
        description: "An error occurred during memory initialization",
        originalError: error
      });
      scope.register(initError);
      await this.call(AMemory_constants.A_MemoryFeatures.onError, scope);
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
    const scope = new aConcept.A_Scope({ name: "A-Memory-Destroy-Scope" }).inherit(aConcept.A_Context.scope(this));
    try {
      this._ready = void 0;
      await this.call(AMemory_constants.A_MemoryFeatures.onDestroy, scope);
    } catch (error) {
      const destroyError = new AMemory_error.A_MemoryError({
        title: AMemory_error.A_MemoryError.MemoryDestructionError,
        description: "An error occurred during memory destruction",
        originalError: error
      });
      scope.register(destroyError);
      await this.call(AMemory_constants.A_MemoryFeatures.onError, scope);
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
    const operation = new aOperation.A_OperationContext("get", { key });
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Get-Operation-Scope",
      fragments: [operation]
    }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(AMemory_constants.A_MemoryFeatures.onGet, scope);
      scope.destroy();
      return operation.result;
    } catch (error) {
      const getError = new AMemory_error.A_MemoryError({
        title: AMemory_error.A_MemoryError.MemoryGetError,
        description: `An error occurred while getting the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(getError);
      await this.call(AMemory_constants.A_MemoryFeatures.onError, scope);
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
    const operation = new aOperation.A_OperationContext("has", { key });
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Has-Operation-Scope",
      fragments: [operation]
    }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(AMemory_constants.A_MemoryFeatures.onHas, scope);
      scope.destroy();
      return operation.result;
    } catch (error) {
      const getError = new AMemory_error.A_MemoryError({
        title: AMemory_error.A_MemoryError.MemoryHasError,
        description: `An error occurred while checking existence for key "${String(key)}"`,
        originalError: error
      });
      scope.register(getError);
      await this.call(AMemory_constants.A_MemoryFeatures.onError, scope);
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
    const operation = new aOperation.A_OperationContext("set", { key, value });
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Set-Operation-Scope",
      fragments: [operation]
    }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(AMemory_constants.A_MemoryFeatures.onSet, scope);
    } catch (error) {
      const setError = new AMemory_error.A_MemoryError({
        title: AMemory_error.A_MemoryError.MemorySetError,
        description: `An error occurred while setting the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(setError);
      await this.call(AMemory_constants.A_MemoryFeatures.onError, scope);
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
    const operation = new aOperation.A_OperationContext("drop", { key });
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Drop-Operation-Scope",
      fragments: [operation]
    }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(AMemory_constants.A_MemoryFeatures.onDrop, scope);
    } catch (error) {
      const dropError = new AMemory_error.A_MemoryError({
        title: AMemory_error.A_MemoryError.MemoryDropError,
        description: `An error occurred while dropping the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(dropError);
      await this.call(AMemory_constants.A_MemoryFeatures.onError, scope);
      scope.destroy();
      throw dropError;
    }
  }
  /**
   * Clears all stored values in the context memory
   */
  async clear() {
    const operation = new aOperation.A_OperationContext("clear");
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Clear-Operation-Scope",
      fragments: [operation]
    }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(AMemory_constants.A_MemoryFeatures.onClear, scope);
    } catch (error) {
      const clearError = new AMemory_error.A_MemoryError({
        title: AMemory_error.A_MemoryError.MemoryClearError,
        description: `An error occurred while clearing the memory`,
        originalError: error
      });
      scope.register(clearError);
      await this.call(AMemory_constants.A_MemoryFeatures.onError, scope);
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
    const operation = new aOperation.A_OperationContext("serialize");
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Serialize-Operation-Scope",
      fragments: [operation]
    }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(AMemory_constants.A_MemoryFeatures.onSerialize, scope);
      return operation.result;
    } catch (error) {
      const serializeError = new AMemory_error.A_MemoryError({
        title: AMemory_error.A_MemoryError.MemorySerializeError,
        description: `An error occurred while serializing the memory`,
        originalError: error
      });
      scope.register(serializeError);
      await this.call(AMemory_constants.A_MemoryFeatures.onError, scope);
      scope.destroy();
      throw serializeError;
    }
  }
};
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Memory.prototype, _i, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Memory.prototype, _h, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(AMemory_context.A_MemoryContext))
], exports.A_Memory.prototype, _g, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(AMemory_context.A_MemoryContext))
], exports.A_Memory.prototype, _f, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(aOperation.A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(AMemory_context.A_MemoryContext))
], exports.A_Memory.prototype, _e, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(aOperation.A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(AMemory_context.A_MemoryContext))
], exports.A_Memory.prototype, _d, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(aOperation.A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(AMemory_context.A_MemoryContext)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Scope))
], exports.A_Memory.prototype, _c, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(aOperation.A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(AMemory_context.A_MemoryContext))
], exports.A_Memory.prototype, _b, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(aOperation.A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(AMemory_context.A_MemoryContext))
], exports.A_Memory.prototype, _a, 1);
exports.A_Memory = __decorateClass([
  aFrame.A_Frame.Component({
    namespace: "A-Utils",
    name: "A-Memory",
    description: "In-memory data storage component that provides a simple key-value store with asynchronous operations. It supports basic memory operations such as get, set, has, drop, and clear, along with lifecycle management and error handling features. This components features can be extended with other components to provide ability store data across multiple storage, or extract data from multiple external sources. Good example is to store some runtime data that needs to be shared across multiple containers or concepts."
  })
], exports.A_Memory);
//# sourceMappingURL=A-Memory.component.js.map
//# sourceMappingURL=A-Memory.component.js.map