import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Component, A_FormatterHelper, A_Scope, A_Context, A_Feature } from '@adaas/a-concept';
import { A_StateMachineError } from './A-StateMachine.error';
import { A_StateMachineFeatures } from './A-StateMachine.constants';
import { A_StateMachineTransition } from './A-StateMachineTransition.context';
import { A_Frame } from '@adaas/a-frame';

var _a, _b, _c, _d;
let A_StateMachine = class extends A_Component {
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
            await this.call(A_StateMachineFeatures.onInitialize);
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
  async [_d = A_StateMachineFeatures.onInitialize](...args) {
  }
  async [_c = A_StateMachineFeatures.onBeforeTransition](...args) {
  }
  async [_b = A_StateMachineFeatures.onAfterTransition](...args) {
  }
  async [_a = A_StateMachineFeatures.onError](...args) {
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
      await this.call(A_StateMachineFeatures.onBeforeTransition, scope);
      await this.call(transitionName, scope);
      await this.call(A_StateMachineFeatures.onAfterTransition, scope);
      scope.destroy();
      return transition.result;
    } catch (error) {
      const wrappedError = new A_StateMachineError({
        title: A_StateMachineError.TransitionError,
        description: `An error occurred while transitioning to "${transitionName}"`,
        originalError: error
      });
      scope.register(wrappedError);
      await this.call(A_StateMachineFeatures.onError, scope);
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

export { A_StateMachine };
//# sourceMappingURL=A-StateMachine.component.mjs.map
//# sourceMappingURL=A-StateMachine.component.mjs.map