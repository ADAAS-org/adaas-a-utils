'use strict';

var aExecution = require('@adaas/a-utils/a-execution');
var aFrame = require('@adaas/a-frame');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_OperationContext = class A_OperationContext extends aExecution.A_ExecutionContext {
  constructor(operation, params) {
    super("operation-context");
    this.meta.set("name", operation);
    this.meta.set("params", params || {});
  }
  get name() {
    return this._meta.get("name") || this._name;
  }
  get result() {
    return this._meta.get("result");
  }
  get error() {
    return this._meta.get("error");
  }
  get params() {
    return this._meta.get("params") || {};
  }
  fail(error) {
    this._meta.set("error", error);
  }
  succeed(result) {
    this._meta.set("result", result);
  }
  toJSON() {
    return {
      name: this.name,
      params: this.params,
      result: this.result || {},
      error: this.error?.toJSON()
    };
  }
};
exports.A_OperationContext = __decorateClass([
  aFrame.A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-OperationContext",
    description: "Operation execution context that encapsulates the metadata and serialized data related to a specific operation. It provides structured access to operation parameters, results, and error handling, facilitating the management of operation lifecycles within the application."
  })
], exports.A_OperationContext);
//# sourceMappingURL=A-Operation.context.js.map
//# sourceMappingURL=A-Operation.context.js.map