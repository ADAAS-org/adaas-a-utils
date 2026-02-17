import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Entity } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

let A_Signal = class extends A_Entity {
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

export { A_Signal };
//# sourceMappingURL=A-Signal.entity.mjs.map
//# sourceMappingURL=A-Signal.entity.mjs.map