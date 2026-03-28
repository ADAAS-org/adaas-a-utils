'use strict';

var aConcept = require('@adaas/a-concept');
var aFrame = require('@adaas/a-frame');
var helpers = require('@adaas/a-utils/helpers');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_Signal = class A_Signal extends aConcept.A_Entity {
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
  /**
   * Allows to define default data for the signal.
   * 
   * If no data is provided during initialization, the default data will be used.
   * 
   * @returns 
   */
  fromUndefined() {
    const name = this.constructor.entity;
    this.data = void 0;
    const identity = {
      name,
      data: this.data
    };
    const id = helpers.A_UtilsHelper.hash(identity);
    this.aseid = this.generateASEID({
      entity: name,
      id
    });
  }
  /**
   * Allows to initialize the signal from a new signal entity. This is useful for example when we want to create a new instance of the signal entity with the same data as another instance, but with a different ASEID.
   * 
   * @param newEntity 
   */
  fromNew(newEntity) {
    this.data = newEntity.data;
    const identity = newEntity.id || {
      name: newEntity.name,
      data: this.data
    };
    const id = helpers.A_UtilsHelper.hash(identity);
    this.aseid = this.generateASEID({
      entity: newEntity.name,
      id
    });
  }
  /**
   * Allows to initialize the signal from a serialized version of the signal. This is useful for example when we receive a signal from the server and we want to create an instance of the signal entity from the received data.
   * 
   * @param serializedEntity 
   */
  fromJSON(serializedEntity) {
    super.fromJSON(serializedEntity);
    this.data = serializedEntity.data;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      data: this.data
    };
  }
};
exports.A_Signal = __decorateClass([
  aFrame.A_Frame.Entity({
    namespace: "A-Utils",
    name: "A-Signal",
    description: "A Signal Entity represents an individual signal instance that carries data, used for managing state within an application context. Signals are designed to reflect the current state rather than individual events, making them suitable for scenarios where state monitoring and real-time updates are essential."
  })
], exports.A_Signal);
//# sourceMappingURL=A-Signal.entity.js.map
//# sourceMappingURL=A-Signal.entity.js.map