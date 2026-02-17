import { A_Logger } from './chunk-TK5UEYMZ.mjs';
import { A_Config } from './chunk-ECSGFDRQ.mjs';
import './chunk-J6CLHXFQ.mjs';
import './chunk-TQ5UON22.mjs';
import { __decorateClass, __decorateParam } from './chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Error, A_Scope, A_Dependency, A_Entity, A_Fragment, A_Context, A_CommonHelper, A_Component } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

var A_Signal = class extends A_Entity {
  // ========================================================================
  // ========================== Static Methods ==============================
  // ========================================================================
  /**
   * Allows to define default data for the signal.
   * 
   * If no data is provided during initialization, the default data will be used.
   * 
   * @returns 
   */
  static async default() {
    return void 0;
  }
  createHash(str) {
    let hashSource;
    if (str instanceof Map) {
      hashSource = JSON.stringify(Array.from(str.entries()));
    } else if (str instanceof Set) {
      hashSource = JSON.stringify(Array.from(str.values()));
    } else {
      switch (typeof str) {
        case "string":
          hashSource = str;
          break;
        case "undefined":
          hashSource = "undefined";
          break;
        case "object":
          if ("toJSON" in str)
            hashSource = JSON.stringify(str.toJSON());
          else
            hashSource = JSON.stringify(str);
          break;
        case "number":
          hashSource = str.toString();
          break;
        case "boolean":
          hashSource = str ? "true" : "false";
          break;
        case "function":
          hashSource = str.toString();
          break;
        default:
          hashSource = String(str);
      }
    }
    let hash = 0, i, chr;
    for (i = 0; i < hashSource.length; i++) {
      chr = hashSource.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    const hashString = hash.toString();
    return hashString;
  }
  /**
   * This method compares the current signal with another signal instance by deduplication ID
   * this id can be configured during initialization with the "id" property.
   * 
   * example: 
   * * const signalA = new A_Signal({ id: ['user-status', 'user123'], data: { status: 'online' } });
   * * const signalB = new A_Signal({ id: ['user-status', 'user123'], data: { status: 'offline' } });
   * 
   * signalA.compare(signalB) // true because both signals have the same deduplication ID
   * 
   * @param other 
   * @returns 
   */
  compare(other) {
    if (this.aseid.id !== other.aseid.id) {
      return false;
    }
    return true;
  }
  fromJSON(serializedEntity) {
    super.fromJSON(serializedEntity);
    this.data = serializedEntity.data;
  }
  fromNew(newEntity) {
    this.data = newEntity.data;
    const identity = newEntity.id || {
      name: newEntity.name,
      data: this.data
    };
    const id = this.createHash(identity);
    this.aseid = this.generateASEID({
      entity: newEntity.name,
      id
    });
  }
  toJSON() {
    return {
      ...super.toJSON(),
      data: this.data
    };
  }
};
A_Signal = __decorateClass([
  A_Frame.Entity({
    namespace: "A-Utils",
    name: "A-Signal",
    description: "A Signal Entity represents an individual signal instance that carries data, used for managing state within an application context. Signals are designed to reflect the current state rather than individual events, making them suitable for scenarios where state monitoring and real-time updates are essential."
  })
], A_Signal);
var A_SignalVector = class extends A_Entity {
  constructor(param1, param2) {
    if ("aseid" in param1) {
      super(param1);
    } else {
      super({
        structure: param2 ? param2 : param1.map((s) => s.constructor),
        values: param1
      });
    }
  }
  fromNew(newEntity) {
    super.fromNew(newEntity);
    this._structure = newEntity.structure;
    this._signals = newEntity.values;
  }
  /**
   * The structure of the signal vector, defining the types of signals it contains.
   * 
   * For example:
   * [UserSignInSignal, UserStatusSignal, UserActivitySignal]
   * 
   */
  get structure() {
    return this._structure || this._signals.map((s) => s.constructor);
  }
  get length() {
    return this.structure.length;
  }
  /**
   * Enables iteration over the signals in the vector.
   * 
   * @returns 
   */
  [Symbol.iterator]() {
    let pointer = 0;
    const signals = this.structure.map((signalConstructor) => {
      const signalIndex = this._signals.findIndex((s) => s.constructor === signalConstructor);
      return signalIndex !== -1 ? this._signals[signalIndex] : void 0;
    });
    return {
      next() {
        if (pointer < signals.length) {
          return {
            done: false,
            value: signals[pointer++]
          };
        } else {
          return {
            done: true,
            value: void 0
          };
        }
      }
    };
  }
  /**
   * Allows to match the current Signal Vector with another Signal Vector by comparing each signal in the structure.
   * This method returns true if all signals in the vector match the corresponding signals in the other vector.
   * 
   * @param other 
   * @returns 
   */
  match(other) {
    if (this.length !== other.length) {
      return false;
    }
    for (let i = 0; i < this.length; i++) {
      const thisSignalConstructor = this.structure[i];
      const otherSignalConstructor = other.structure[i];
      if (thisSignalConstructor !== otherSignalConstructor) {
        return false;
      }
      const thisSignalIndex = this._signals.findIndex((s) => s.constructor === thisSignalConstructor);
      const otherSignalIndex = other._signals.findIndex((s) => s.constructor === otherSignalConstructor);
      const thisSignal = thisSignalIndex !== -1 ? this._signals[thisSignalIndex] : void 0;
      const otherSignal = otherSignalIndex !== -1 ? other._signals[otherSignalIndex] : void 0;
      if (thisSignal && otherSignal) {
        if (!thisSignal.compare(otherSignal)) {
          return false;
        }
      } else if (thisSignal || otherSignal) {
        return false;
      }
    }
    return true;
  }
  /**
   * This method should ensure that the current Signal Vector contains all signals from the provided Signal Vector.
   * 
   * @param signal 
   */
  contains(signal) {
    for (const signalConstructor of signal.structure) {
      const signalIndex = this._signals.findIndex((s) => s.constructor === signalConstructor);
      if (signalIndex === -1) {
        return false;
      }
    }
    return true;
  }
  has(param1) {
    let signalConstructor;
    if (param1 instanceof A_Entity) {
      signalConstructor = param1.constructor;
    } else {
      signalConstructor = param1;
    }
    return this.structure.includes(signalConstructor);
  }
  get(param1) {
    let signalConstructor;
    if (param1 instanceof A_Entity) {
      signalConstructor = param1.constructor;
    } else {
      signalConstructor = param1;
    }
    const index = this._signals.findIndex((s) => s.constructor === signalConstructor);
    if (index === -1) {
      return void 0;
    }
    return this._signals[index];
  }
  /**
   * Converts to Array of values of signals in the vector
   * Maintains the order specified in the structure/generic type
   * 
   * @param structure - Optional structure to override the default ordering
   * @returns Array of signal instances in the specified order
   */
  async toVector(structure) {
    const usedStructure = structure || this.structure;
    return usedStructure.map((signalConstructor) => {
      const signalIndex = this._signals.findIndex((s) => s.constructor === signalConstructor);
      return signalIndex !== -1 ? this._signals[signalIndex] : void 0;
    });
  }
  /**
   * Converts to Array of data of signals in the vector
   * Maintains the order specified in the structure/generic type
   * 
   * @param structure - Optional structure to override the default ordering
   * @returns Array of serialized signal data in the specified order
   */
  async toDataVector(structure) {
    const usedStructure = structure || this.structure;
    const results = [];
    for (const signalConstructor of usedStructure) {
      const signalIndex = this._signals.findIndex((s) => s.constructor === signalConstructor);
      let data;
      if (signalIndex === -1) {
        data = await signalConstructor.default();
      } else {
        const signal = this._signals[signalIndex];
        data = signal;
      }
      results.push(data?.toJSON().data);
    }
    return results;
  }
  /**
   * Converts to Object with signal constructor names as keys and their corresponding data values
   * Uses the structure ordering to ensure consistent key ordering
   * 
   * @returns Object with signal constructor names as keys and signal data as values
   */
  async toObject(structure) {
    const usedStructure = structure || this.structure;
    const obj = {};
    usedStructure.forEach((signalConstructor) => {
      const signalName = signalConstructor.name;
      const signalIndex = this._signals.findIndex((s) => s.constructor === signalConstructor);
      if (signalIndex !== -1) {
        const signal = this._signals[signalIndex];
        obj[signalName] = signal.toJSON().data;
      } else {
        obj[signalName] = void 0;
      }
    });
    return obj;
  }
  /**
   * Serializes the Signal Vector to a JSON-compatible format.
   * 
   * 
   * @returns 
   */
  toJSON() {
    return {
      ...super.toJSON(),
      structure: this.structure.map((s) => s.name),
      values: this._signals.map((s) => s.toJSON())
    };
  }
};
A_SignalVector = __decorateClass([
  A_Frame.Entity({
    namespace: "A-Utils",
    name: "A-SignalVector",
    description: "A Signal Vector Entity represents a collection of signals structured in a specific way, allowing for batch processing and transmission of related signals as a unified state representation."
  })
], A_SignalVector);
var A_SignalState = class extends A_Fragment {
  /**
   * Creates a new A_SignalState instance
   * 
   * @param structure - Optional array defining the ordered structure of signal constructors
   *                   This structure is used for vector operations and determines the order
   *                   in which signals are processed and serialized
   */
  constructor(structure) {
    super({ name: "A_SignalState" });
    /**
     * Internal map storing the relationship between signal constructors and their latest values
     * Key: Signal constructor function
     * Value: Latest emitted data from that signal type
     */
    this._state = /* @__PURE__ */ new Map();
    /**
     * Previous state map to track changes between signal emissions
     * Key: Signal constructor function
     * Value: Previous emitted data from that signal type
     */
    this._prevState = /* @__PURE__ */ new Map();
    this._structure = structure;
  }
  /**
   * Gets the ordered structure of signal constructors
   * @returns Array of signal constructors in their defined order
   */
  get structure() {
    return this._structure || [];
  }
  set(param1, param2) {
    const signal = param1 instanceof A_Signal ? param1.constructor : param1;
    const value = param1 instanceof A_Signal ? param1 : param2;
    this._prevState.set(signal, this._state.get(signal));
    this._state.set(signal, value);
  }
  get(param) {
    const signal = param instanceof A_Signal ? param.constructor : param;
    return this._state.get(signal);
  }
  getPrev(param) {
    const signal = param instanceof A_Signal ? param.constructor : param;
    return this._prevState.get(signal);
  }
  has(param) {
    const signal = param instanceof A_Signal ? param.constructor : param;
    return this.structure.includes(signal);
  }
  delete(param) {
    const signal = param instanceof A_Signal ? param.constructor : param;
    return this._state.delete(signal);
  }
  /**
   * Converts the current state to a vector (ordered array) format
   * 
   * The order is determined by the structure array provided during construction.
   * Each position in the vector corresponds to a specific signal type's latest value.
   * 
   * @returns Array of signal values in the order defined by the structure
   * @throws Error if structure is not defined or if any signal value is undefined
   */
  toVector() {
    const vector = [];
    this._state.forEach((value, key) => {
      vector.push(value);
    });
    return new A_SignalVector(vector, this.structure);
  }
  /**
   * Converts the current state to an object with signal constructor names as keys
   * 
   * This provides a more readable representation of the state where each signal
   * type is identified by its constructor name.
   * 
   * @returns Object mapping signal constructor names to their latest values
   * @throws Error if any signal value is undefined
   */
  toObject() {
    const obj = {};
    this.structure.forEach((signalConstructor) => {
      const value = this._state.get(signalConstructor);
      if (value === void 0) {
        throw new Error(`Signal ${signalConstructor.name} has no value in state`);
      }
      obj[signalConstructor.name] = value;
    });
    return obj;
  }
};
A_SignalState = __decorateClass([
  A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-SignalState",
    description: "Manages the latest state of all signals within a given scope, maintaining a mapping between signal constructors and their most recently emitted values."
  })
], A_SignalState);
var A_SignalConfig = class extends A_Fragment {
  get structure() {
    if (this._structure) {
      return this._structure;
    }
    const scope = A_Context.scope(this);
    const constructors = [...scope.allowedEntities].filter((e) => A_CommonHelper.isInheritedFrom(e, A_Signal)).sort((a, b) => a.constructor.name.localeCompare(b.name)).map((s) => scope.resolveConstructor(s.name));
    return constructors.filter((s) => s);
  }
  /**
   * Uses for synchronization to ensure the config is initialized.
   * 
   * @returns True if the configuration has been initialized.
   */
  get ready() {
    return this._ready;
  }
  constructor(params) {
    super({ name: "A_SignalConfig" });
    this._config = params;
  }
  /**
   * Initializes the signal configuration if not already initialized.
   * 
   * @returns 
   */
  async initialize() {
    if (!this._ready) {
      this._ready = this._initialize();
    }
    return this._ready;
  }
  /**
   * Initializes the signal configuration by processing the provided structure or string representation.
   * This method sets up the internal structure of signal constructors based on the configuration.
   */
  async _initialize() {
    if (this._config.structure) {
      this._structure = this._config.structure;
    } else if (this._config.stringStructure) {
      const stringStructure = this._config.stringStructure.split(",").map((s) => s.trim());
      this._structure = stringStructure.map((name) => A_Context.scope(this).resolveConstructor(name)).filter((s) => s);
    }
  }
};
A_SignalConfig = __decorateClass([
  A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-SignalConfig",
    description: "Signal configuration fragment that defines the structure and types of signals within a given scope. It allows specifying the expected signal constructors and their order, facilitating consistent signal management and processing across components that emit or listen to signals."
  })
], A_SignalConfig);

// src/lib/A-Signal/components/A-SignalBus.constants.ts
var A_SignalBusFeatures = /* @__PURE__ */ ((A_SignalBusFeatures2) => {
  A_SignalBusFeatures2["onBeforeNext"] = "_A_SignalBusFeatures_onBeforeNext";
  A_SignalBusFeatures2["onNext"] = "_A_SignalBusFeatures_onNext";
  A_SignalBusFeatures2["onError"] = "_A_SignalBusFeatures_onError";
  return A_SignalBusFeatures2;
})(A_SignalBusFeatures || {});
var A_SignalBusError = class extends A_Error {
};
A_SignalBusError.SignalProcessingError = "Signal processing error";

// src/lib/A-Signal/components/A-SignalBus.component.ts
var _a, _b, _c;
var A_SignalBus = class extends A_Component {
  async next(...signals) {
    const scope = new A_Scope({
      name: `A_SignalBus-Next-Scope`,
      entities: signals
    }).inherit(A_Context.scope(this));
    try {
      await this.call("_A_SignalBusFeatures_onBeforeNext" /* onBeforeNext */, scope);
      await this.call("_A_SignalBusFeatures_onNext" /* onNext */, scope);
      scope.destroy();
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof A_SignalBusError:
          wrappedError = error;
          break;
        case (error instanceof A_Error && error.originalError instanceof A_SignalBusError):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new A_SignalBusError({
            title: A_SignalBusError.SignalProcessingError,
            description: `An error occurred while processing the signal.`,
            originalError: error
          });
          break;
      }
      scope.register(wrappedError);
      await this.call("_A_SignalBusFeatures_onError" /* onError */);
      scope.destroy();
    }
  }
  async [_c = "_A_SignalBusFeatures_onError" /* onError */](error, logger, ...args) {
    logger?.error(error);
  }
  async [_b = "_A_SignalBusFeatures_onBeforeNext" /* onBeforeNext */](scope, globalConfig, state, logger, config) {
    const componentContext = A_Context.scope(this);
    if (!config) {
      config = new A_SignalConfig({
        stringStructure: globalConfig?.get("A_SIGNAL_VECTOR_STRUCTURE") || void 0
      });
      componentContext.register(config);
    }
    if (!config.ready)
      await config.initialize();
    if (!state) {
      state = new A_SignalState(config.structure);
      componentContext.register(state);
    }
  }
  async [_a = "_A_SignalBusFeatures_onNext" /* onNext */](signals, scope, state, globalConfig, logger, config) {
    for (const signal of signals) {
      if (!state.has(signal))
        return;
      logger?.debug(`A_SignalBus: Updating state for signal '${signal.constructor.name}' with data:`, signal.data);
      state.set(signal);
    }
    const vector = state.toVector();
    scope.register(vector);
  }
};
__decorateClass([
  A_Frame.Method({
    description: "Emit multiple signals through the signal bus."
  })
], A_SignalBus.prototype, "next", 1);
__decorateClass([
  A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Error)),
  __decorateParam(1, A_Inject(A_Logger))
], A_SignalBus.prototype, _c, 1);
__decorateClass([
  A_Feature.Extend({
    scope: [A_SignalBus],
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Scope)),
  __decorateParam(1, A_Inject(A_Config)),
  __decorateParam(2, A_Inject(A_SignalState)),
  __decorateParam(3, A_Inject(A_Logger)),
  __decorateParam(4, A_Inject(A_SignalConfig))
], A_SignalBus.prototype, _b, 1);
__decorateClass([
  A_Feature.Extend({
    scope: [A_SignalBus],
    before: /.*/
  }),
  __decorateParam(0, A_Dependency.Flat()),
  __decorateParam(0, A_Dependency.All()),
  __decorateParam(0, A_Inject(A_Signal)),
  __decorateParam(1, A_Inject(A_Scope)),
  __decorateParam(2, A_Dependency.Required()),
  __decorateParam(2, A_Inject(A_SignalState)),
  __decorateParam(3, A_Inject(A_Config)),
  __decorateParam(4, A_Inject(A_Logger)),
  __decorateParam(5, A_Inject(A_SignalConfig))
], A_SignalBus.prototype, _a, 1);
A_SignalBus = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "A-SignalBus",
    description: "Signal bus component that manages the emission and state of signals within a given scope. It listens for emitted signals, updates their state, and forwards them to registered watchers. The bus ensures a consistent signal vector structure based on the defined configuration, facilitating signal management across multiple components."
  })
], A_SignalBus);

export { A_Signal, A_SignalBus, A_SignalBusError, A_SignalBusFeatures, A_SignalConfig, A_SignalState, A_SignalVector };
//# sourceMappingURL=a-signal.mjs.map
//# sourceMappingURL=a-signal.mjs.map