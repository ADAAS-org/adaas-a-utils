import { __decorateClass, __decorateParam } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Component, A_Scope, A_Context, A_Error, A_Feature, A_Inject, A_Dependency } from '@adaas/a-concept';
import { A_SignalState } from '../context/A-SignalState.context';
import { A_SignalConfig } from '../context/A-SignalConfig.context';
import { A_Signal } from '../entities/A-Signal.entity';
import { A_Config } from '@adaas/a-utils/a-config';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Frame } from '@adaas/a-frame';
import { A_SignalBusFeatures } from './A-SignalBus.constants';
import { A_SignalBusError } from './A-SignalBus.error';

var _a, _b, _c;
let A_SignalBus = class extends A_Component {
  async next(...signals) {
    const scope = new A_Scope({
      name: `A_SignalBus-Next-Scope`,
      entities: signals
    }).inherit(A_Context.scope(this));
    try {
      await this.call(A_SignalBusFeatures.onBeforeNext, scope);
      await this.call(A_SignalBusFeatures.onNext, scope);
      scope.destroy();
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof A_SignalBusError:
          wrappedError = error;
          break;
        case (error instanceof A_Error && error.originalError instanceof A_SignalBusError):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new A_SignalBusError({
            title: A_SignalBusError.SignalProcessingError,
            description: `An error occurred while processing the signal.`,
            originalError: error
          });
          break;
      }
      scope.register(wrappedError);
      await this.call(A_SignalBusFeatures.onError);
      scope.destroy();
    }
  }
  async [_c = A_SignalBusFeatures.onError](error, logger, ...args) {
    logger?.error(error);
  }
  async [_b = A_SignalBusFeatures.onBeforeNext](scope, globalConfig, state, logger, config) {
    const componentContext = A_Context.scope(this);
    if (!config) {
      config = new A_SignalConfig({
        stringStructure: globalConfig?.get("A_SIGNAL_VECTOR_STRUCTURE") || void 0
      });
      componentContext.register(config);
    }
    if (!config.ready)
      await config.initialize();
    if (!state) {
      state = new A_SignalState(config.structure);
      componentContext.register(state);
    }
  }
  async [_a = A_SignalBusFeatures.onNext](signals, scope, state, globalConfig, logger, config) {
    for (const signal of signals) {
      if (!state.has(signal))
        return;
      logger?.debug(`A_SignalBus: Updating state for signal '${signal.constructor.name}' with data:`, signal.data);
      state.set(signal);
    }
    const vector = state.toVector();
    scope.register(vector);
  }
};
__decorateClass([
  A_Frame.Method({
    description: "Emit multiple signals through the signal bus."
  })
], A_SignalBus.prototype, "next", 1);
__decorateClass([
  A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Error)),
  __decorateParam(1, A_Inject(A_Logger))
], A_SignalBus.prototype, _c, 1);
__decorateClass([
  A_Feature.Extend({
    scope: [A_SignalBus],
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Scope)),
  __decorateParam(1, A_Inject(A_Config)),
  __decorateParam(2, A_Inject(A_SignalState)),
  __decorateParam(3, A_Inject(A_Logger)),
  __decorateParam(4, A_Inject(A_SignalConfig))
], A_SignalBus.prototype, _b, 1);
__decorateClass([
  A_Feature.Extend({
    scope: [A_SignalBus],
    before: /.*/
  }),
  __decorateParam(0, A_Dependency.Flat()),
  __decorateParam(0, A_Dependency.All()),
  __decorateParam(0, A_Inject(A_Signal)),
  __decorateParam(1, A_Inject(A_Scope)),
  __decorateParam(2, A_Dependency.Required()),
  __decorateParam(2, A_Inject(A_SignalState)),
  __decorateParam(3, A_Inject(A_Config)),
  __decorateParam(4, A_Inject(A_Logger)),
  __decorateParam(5, A_Inject(A_SignalConfig))
], A_SignalBus.prototype, _a, 1);
A_SignalBus = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "A-SignalBus",
    description: "Signal bus component that manages the emission and state of signals within a given scope. It listens for emitted signals, updates their state, and forwards them to registered watchers. The bus ensures a consistent signal vector structure based on the defined configuration, facilitating signal management across multiple components."
  })
], A_SignalBus);

export { A_SignalBus };
//# sourceMappingURL=A-SignalBus.component.mjs.map
//# sourceMappingURL=A-SignalBus.component.mjs.map