'use strict';

var aConcept = require('@adaas/a-concept');
var aFrame = require('@adaas/a-frame');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_MemoryContext = class A_MemoryContext extends aConcept.A_Fragment {
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
exports.A_MemoryContext = __decorateClass([
  aFrame.A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-MemoryContext",
    description: "In-memory context fragment that provides a simple key-value store for temporary data storage during application runtime. It allows setting, getting, deleting, and checking the existence of key-value pairs, facilitating quick access to transient data without persistent storage. This context is useful for scenarios where data needs to be shared across different components or operations within the same execution context."
  })
], exports.A_MemoryContext);
//# sourceMappingURL=A-Memory.context.js.map
//# sourceMappingURL=A-Memory.context.js.map