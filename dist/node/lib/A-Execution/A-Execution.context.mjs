import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Fragment, A_Meta } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

let A_ExecutionContext = class extends A_Fragment {
  constructor(name, defaults) {
    super({ name });
    this._meta = new A_Meta();
    for (const key in defaults) {
      this._meta.set(key, defaults[key]);
    }
  }
  [Symbol.iterator]() {
    return this._meta[Symbol.iterator]();
  }
  get meta() {
    return this._meta;
  }
  get(key) {
    return this._meta.get(key);
  }
  set(key, value) {
    this._meta.set(key, value);
    return this;
  }
  has(key) {
    return this._meta.has(key);
  }
  drop(key) {
    this._meta.delete(key);
  }
  clear() {
    this._meta.clear();
    return this;
  }
  toRaw() {
    return this._meta.toJSON();
  }
  toJSON() {
    return {
      name: this.name,
      ...this.meta.toJSON()
    };
  }
};
A_ExecutionContext = __decorateClass([
  A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-ExecutionContext",
    description: "Execution context fragment that provides a structured way to manage metadata and serialized data for execution environments. It allows storing and retrieving key-value pairs, facilitating context-aware operations within the application. It useful in cases when it's necessary to share some runtime data across multiple steps of thee features, or components."
  })
], A_ExecutionContext);

export { A_ExecutionContext };
//# sourceMappingURL=A-Execution.context.mjs.map
//# sourceMappingURL=A-Execution.context.mjs.map