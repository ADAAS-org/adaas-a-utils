import { A_OperationContext } from './chunk-72ANHWNG.mjs';
import { __decorateClass } from './chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Error, A_Component, A_FormatterHelper, A_Scope, A_Context } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

var A_StateMachineError = class extends A_Error {
};
A_StateMachineError.InitializationError = "A-StateMachine Initialization Error";
A_StateMachineError.TransitionError = "A-StateMachine Transition Error";

// src/lib/A-StateMachine/A-StateMachine.constants.ts
var A_StateMachineFeatures = /* @__PURE__ */ ((A_StateMachineFeatures2) => {
  A_StateMachineFeatures2["onError"] = "_A_StateMachine_onError";
  A_StateMachineFeatures2["onInitialize"] = "_A_StateMachine_onInitialize";
  A_StateMachineFeatures2["onBeforeTransition"] = "_A_StateMachine_onBeforeTransition";
  A_StateMachineFeatures2["onAfterTransition"] = "_A_StateMachine_onAfterTransition";
  return A_StateMachineFeatures2;
})(A_StateMachineFeatures || {});
var A_StateMachineTransition = class extends A_OperationContext {
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
var _a, _b, _c, _d;
var A_StateMachine = class extends A_Component {
  /**
   * Gets a promise that resolves when the state machine is fully initialized and ready for transitions.
   * This ensures that all initialization hooks have been executed before allowing state transitions.
   * 
   * @returns Promise<void> that resolves when initialization is complete
   * 
   * @example
   * ```typescript
   * const stateMachine = new MyStateMachine();
   * await stateMachine.ready; // Wait for initialization
   * await stateMachine.transition('idle', 'running');
   * ```
   */
  get ready() {
    if (!this._initialized) {
      this._initialized = new Promise(
        async (resolve, reject) => {
          try {
            await this.call("_A_StateMachine_onInitialize" /* onInitialize */);
            resolve();
          } catch (error) {
            const wrappedError = new A_StateMachineError({
              title: A_StateMachineError.InitializationError,
              description: `An error occurred during state machine initialization.`,
              originalError: error
            });
            reject(wrappedError);
          }
        }
      );
    }
    return this._initialized;
  }
  async [_d = "_A_StateMachine_onInitialize" /* onInitialize */](...args) {
  }
  async [_c = "_A_StateMachine_onBeforeTransition" /* onBeforeTransition */](...args) {
  }
  async [_b = "_A_StateMachine_onAfterTransition" /* onAfterTransition */](...args) {
  }
  async [_a = "_A_StateMachine_onError" /* onError */](...args) {
  }
  async transition(from, to, props) {
    await this.ready;
    const transitionName = `${A_FormatterHelper.toCamelCase(String(from))}_${A_FormatterHelper.toCamelCase(String(to))}`;
    const transition = new A_StateMachineTransition({
      from: String(from),
      to: String(to),
      props
    });
    const scope = new A_Scope({
      name: `A-StateMachine-Transition-Scope-${transitionName}`,
      fragments: [transition]
    }).inherit(A_Context.scope(this));
    try {
      await this.call("_A_StateMachine_onBeforeTransition" /* onBeforeTransition */, scope);
      await this.call(transitionName, scope);
      await this.call("_A_StateMachine_onAfterTransition" /* onAfterTransition */, scope);
      scope.destroy();
      return transition.result;
    } catch (error) {
      const wrappedError = new A_StateMachineError({
        title: A_StateMachineError.TransitionError,
        description: `An error occurred while transitioning to "${transitionName}"`,
        originalError: error
      });
      scope.register(wrappedError);
      await this.call("_A_StateMachine_onError" /* onError */, scope);
      scope.destroy();
      throw wrappedError;
    }
  }
};
__decorateClass([
  A_Feature.Extend()
], A_StateMachine.prototype, _d, 1);
__decorateClass([
  A_Feature.Extend()
], A_StateMachine.prototype, _c, 1);
__decorateClass([
  A_Feature.Extend()
], A_StateMachine.prototype, _b, 1);
__decorateClass([
  A_Feature.Extend()
], A_StateMachine.prototype, _a, 1);
__decorateClass([
  A_Frame.Method({
    name: "transition",
    description: "Executes a state transition from one state to another."
  })
], A_StateMachine.prototype, "transition", 1);
A_StateMachine = __decorateClass([
  A_Frame.Namespace("A-Utils"),
  A_Frame.Component({
    name: "A-StateMachine",
    description: "A powerful state machine component for managing complex state transitions."
  })
], A_StateMachine);

export { A_StateMachine, A_StateMachineError, A_StateMachineFeatures, A_StateMachineTransition };
//# sourceMappingURL=chunk-NLPSQYIQ.mjs.map
//# sourceMappingURL=chunk-NLPSQYIQ.mjs.map