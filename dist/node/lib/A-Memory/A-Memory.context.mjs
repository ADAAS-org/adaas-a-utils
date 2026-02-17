import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

let A_MemoryContext = class extends A_Fragment {
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

export { A_MemoryContext };
//# sourceMappingURL=A-Memory.context.mjs.map
//# sourceMappingURL=A-Memory.context.mjs.map