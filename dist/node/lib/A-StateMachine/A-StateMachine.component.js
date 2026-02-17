'use strict';

var aConcept = require('@adaas/a-concept');
var AStateMachine_error = require('./A-StateMachine.error');
var AStateMachine_constants = require('./A-StateMachine.constants');
var AStateMachineTransition_context = require('./A-StateMachineTransition.context');
var aFrame = require('@adaas/a-frame');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var _a, _b, _c, _d;
exports.A_StateMachine = class A_StateMachine extends aConcept.A_Component {
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
            await this.call(AStateMachine_constants.A_StateMachineFeatures.onInitialize);
            resolve();
          } catch (error) {
            const wrappedError = new AStateMachine_error.A_StateMachineError({
              title: AStateMachine_error.A_StateMachineError.InitializationError,
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
  async [_d = AStateMachine_constants.A_StateMachineFeatures.onInitialize](...args) {
  }
  async [_c = AStateMachine_constants.A_StateMachineFeatures.onBeforeTransition](...args) {
  }
  async [_b = AStateMachine_constants.A_StateMachineFeatures.onAfterTransition](...args) {
  }
  async [_a = AStateMachine_constants.A_StateMachineFeatures.onError](...args) {
  }
  async transition(from, to, props) {
    await this.ready;
    const transitionName = `${aConcept.A_FormatterHelper.toCamelCase(String(from))}_${aConcept.A_FormatterHelper.toCamelCase(String(to))}`;
    const transition = new AStateMachineTransition_context.A_StateMachineTransition({
      from: String(from),
      to: String(to),
      props
    });
    const scope = new aConcept.A_Scope({
      name: `A-StateMachine-Transition-Scope-${transitionName}`,
      fragments: [transition]
    }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(AStateMachine_constants.A_StateMachineFeatures.onBeforeTransition, scope);
      await this.call(transitionName, scope);
      await this.call(AStateMachine_constants.A_StateMachineFeatures.onAfterTransition, scope);
      scope.destroy();
      return transition.result;
    } catch (error) {
      const wrappedError = new AStateMachine_error.A_StateMachineError({
        title: AStateMachine_error.A_StateMachineError.TransitionError,
        description: `An error occurred while transitioning to "${transitionName}"`,
        originalError: error
      });
      scope.register(wrappedError);
      await this.call(AStateMachine_constants.A_StateMachineFeatures.onError, scope);
      scope.destroy();
      throw wrappedError;
    }
  }
};
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_StateMachine.prototype, _d, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_StateMachine.prototype, _c, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_StateMachine.prototype, _b, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_StateMachine.prototype, _a, 1);
__decorateClass([
  aFrame.A_Frame.Method({
    name: "transition",
    description: "Executes a state transition from one state to another."
  })
], exports.A_StateMachine.prototype, "transition", 1);
exports.A_StateMachine = __decorateClass([
  aFrame.A_Frame.Namespace("A-Utils"),
  aFrame.A_Frame.Component({
    name: "A-StateMachine",
    description: "A powerful state machine component for managing complex state transitions."
  })
], exports.A_StateMachine);
//# sourceMappingURL=A-StateMachine.component.js.map
//# sourceMappingURL=A-StateMachine.component.js.map