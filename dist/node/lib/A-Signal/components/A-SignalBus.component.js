'use strict';

var aConcept = require('@adaas/a-concept');
var ASignalState_context = require('../context/A-SignalState.context');
var ASignalConfig_context = require('../context/A-SignalConfig.context');
var ASignal_entity = require('../entities/A-Signal.entity');
var aConfig = require('@adaas/a-utils/a-config');
var aLogger = require('@adaas/a-utils/a-logger');
var aFrame = require('@adaas/a-frame');
var ASignalBus_constants = require('./A-SignalBus.constants');
var ASignalBus_error = require('./A-SignalBus.error');

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
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var _a, _b, _c;
exports.A_SignalBus = class A_SignalBus extends aConcept.A_Component {
  async next(...signals) {
    const scope = new aConcept.A_Scope({
      name: `A_SignalBus-Next-Scope`,
      entities: signals
    }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call(ASignalBus_constants.A_SignalBusFeatures.onBeforeNext, scope);
      await this.call(ASignalBus_constants.A_SignalBusFeatures.onNext, scope);
      scope.destroy();
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof ASignalBus_error.A_SignalBusError:
          wrappedError = error;
          break;
        case (error instanceof aConcept.A_Error && error.originalError instanceof ASignalBus_error.A_SignalBusError):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new ASignalBus_error.A_SignalBusError({
            title: ASignalBus_error.A_SignalBusError.SignalProcessingError,
            description: `An error occurred while processing the signal.`,
            originalError: error
          });
          break;
      }
      scope.register(wrappedError);
      await this.call(ASignalBus_constants.A_SignalBusFeatures.onError);
      scope.destroy();
    }
  }
  async [_c = ASignalBus_constants.A_SignalBusFeatures.onError](error, logger, ...args) {
    logger?.error(error);
  }
  async [_b = ASignalBus_constants.A_SignalBusFeatures.onBeforeNext](scope, globalConfig, state, logger, config) {
    const componentContext = aConcept.A_Context.scope(this);
    if (!config) {
      config = new ASignalConfig_context.A_SignalConfig({
        stringStructure: globalConfig?.get("A_SIGNAL_VECTOR_STRUCTURE") || void 0
      });
      componentContext.register(config);
    }
    if (!config.ready)
      await config.initialize();
    if (!state) {
      state = new ASignalState_context.A_SignalState(config.structure);
      componentContext.register(state);
    }
  }
  async [_a = ASignalBus_constants.A_SignalBusFeatures.onNext](signals, scope, state, globalConfig, logger, config) {
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
  aFrame.A_Frame.Method({
    description: "Emit multiple signals through the signal bus."
  })
], exports.A_SignalBus.prototype, "next", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Error)),
  __decorateParam(1, aConcept.A_Inject(aLogger.A_Logger))
], exports.A_SignalBus.prototype, _c, 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    scope: [exports.A_SignalBus],
    before: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Scope)),
  __decorateParam(1, aConcept.A_Inject(aConfig.A_Config)),
  __decorateParam(2, aConcept.A_Inject(ASignalState_context.A_SignalState)),
  __decorateParam(3, aConcept.A_Inject(aLogger.A_Logger)),
  __decorateParam(4, aConcept.A_Inject(ASignalConfig_context.A_SignalConfig))
], exports.A_SignalBus.prototype, _b, 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    scope: [exports.A_SignalBus],
    before: /.*/
  }),
  __decorateParam(0, aConcept.A_Dependency.Flat()),
  __decorateParam(0, aConcept.A_Dependency.All()),
  __decorateParam(0, aConcept.A_Inject(ASignal_entity.A_Signal)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope)),
  __decorateParam(2, aConcept.A_Dependency.Required()),
  __decorateParam(2, aConcept.A_Inject(ASignalState_context.A_SignalState)),
  __decorateParam(3, aConcept.A_Inject(aConfig.A_Config)),
  __decorateParam(4, aConcept.A_Inject(aLogger.A_Logger)),
  __decorateParam(5, aConcept.A_Inject(ASignalConfig_context.A_SignalConfig))
], exports.A_SignalBus.prototype, _a, 1);
exports.A_SignalBus = __decorateClass([
  aFrame.A_Frame.Component({
    namespace: "A-Utils",
    name: "A-SignalBus",
    description: "Signal bus component that manages the emission and state of signals within a given scope. It listens for emitted signals, updates their state, and forwards them to registered watchers. The bus ensures a consistent signal vector structure based on the defined configuration, facilitating signal management across multiple components."
  })
], exports.A_SignalBus);
//# sourceMappingURL=A-SignalBus.component.js.map
//# sourceMappingURL=A-SignalBus.component.js.map