import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';
import { A_Signal } from '../entities/A-Signal.entity';
import { A_SignalVector } from '../entities/A-SignalVector.entity';
import { A_Frame } from '@adaas/a-frame';

let A_SignalState = class extends A_Fragment {
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

export { A_SignalState };
//# sourceMappingURL=A-SignalState.context.mjs.map
//# sourceMappingURL=A-SignalState.context.mjs.map