import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Frame } from '@adaas/a-frame';
import { A_OperationContext } from '@adaas/a-utils/a-operation';

let A_StateMachineTransition = class extends A_OperationContext {
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
A_StateMachineTransition = __decorateClass([
  A_Frame.Fragment({
    name: "A-StateMachineTransition",
    description: "Context for managing state machine transitions."
  })
], A_StateMachineTransition);

export { A_StateMachineTransition };
//# sourceMappingURL=A-StateMachineTransition.context.mjs.map
//# sourceMappingURL=A-StateMachineTransition.context.mjs.map