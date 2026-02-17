'use strict';

var aFrame = require('@adaas/a-frame');
var aOperation = require('@adaas/a-utils/a-operation');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_StateMachineTransition = class A_StateMachineTransition extends aOperation.A_OperationContext {
  constructor(params) {
    super(
      "a-state-machine-transition",
      params
    );
    this._meta.set("from", params.from);
    this._meta.set("to", params.to);
  }
  /**
   * The state to transition from
   */
  get from() {
    return this._meta.get("from");
  }
  /**
   * The state to transition to
   */
  get to() {
    return this._meta.get("to");
  }
};
exports.A_StateMachineTransition = __decorateClass([
  aFrame.A_Frame.Fragment({
    name: "A-StateMachineTransition",
    description: "Context for managing state machine transitions."
  })
], exports.A_StateMachineTransition);
//# sourceMappingURL=A-StateMachineTransition.context.js.map
//# sourceMappingURL=A-StateMachineTransition.context.js.map