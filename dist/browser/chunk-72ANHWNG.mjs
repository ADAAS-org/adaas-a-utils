import { A_ExecutionContext } from './chunk-TQ5UON22.mjs';
import { __decorateClass } from './chunk-EQQGB2QZ.mjs';
import { A_Frame } from '@adaas/a-frame';

var A_OperationContext = class extends A_ExecutionContext {
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
A_OperationContext = __decorateClass([
  A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-OperationContext",
    description: "Operation execution context that encapsulates the metadata and serialized data related to a specific operation. It provides structured access to operation parameters, results, and error handling, facilitating the management of operation lifecycles within the application."
  })
], A_OperationContext);

export { A_OperationContext };
//# sourceMappingURL=chunk-72ANHWNG.mjs.map
//# sourceMappingURL=chunk-72ANHWNG.mjs.map