'use strict';

var aConcept = require('@adaas/a-concept');
var AService_constants = require('./A-Service.constants');
var aLogger = require('@adaas/a-utils/a-logger');
var AService_error = require('./A-Service.error');
var aFrame = require('@adaas/a-frame');
var aPolyfill = require('@adaas/a-utils/a-polyfill');

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
var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
exports.A_Service = class A_Service extends aConcept.A_Container {
  /**
   * Load the service
   */
  async load() {
    try {
      await this.call(AService_constants.A_ServiceFeatures.onBeforeLoad);
      await this.call(AService_constants.A_ServiceFeatures.onLoad);
      await this.call(AService_constants.A_ServiceFeatures.onAfterLoad);
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof AService_error.A_Service_Error:
          wrappedError = error;
          break;
        case (error instanceof aConcept.A_Error && error.originalError instanceof AService_error.A_Service_Error):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new AService_error.A_Service_Error({
            title: AService_error.A_Service_Error.ServiceLoadError,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      this.scope.register(wrappedError);
      await this.call(AService_constants.A_ServiceFeatures.onError);
    }
  }
  /**
   * Start the server
   */
  async start() {
    try {
      await this.call(AService_constants.A_ServiceFeatures.onBeforeStart);
      await this.call(AService_constants.A_ServiceFeatures.onStart);
      await this.call(AService_constants.A_ServiceFeatures.onAfterStart);
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof AService_error.A_Service_Error:
          wrappedError = error;
          break;
        case (error instanceof aConcept.A_Error && error.originalError instanceof AService_error.A_Service_Error):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new AService_error.A_Service_Error({
            title: AService_error.A_Service_Error.ServiceStartError,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      this.scope.register(wrappedError);
      await this.call(AService_constants.A_ServiceFeatures.onError);
    }
  }
  /**
   * Stop the server
   */
  async stop() {
    try {
      await this.call(AService_constants.A_ServiceFeatures.onBeforeStop);
      await this.call(AService_constants.A_ServiceFeatures.onStop);
      await this.call(AService_constants.A_ServiceFeatures.onAfterStop);
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof AService_error.A_Service_Error:
          wrappedError = error;
          break;
        case (error instanceof aConcept.A_Error && error.originalError instanceof AService_error.A_Service_Error):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new AService_error.A_Service_Error({
            title: AService_error.A_Service_Error.ServiceStopError,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      this.scope.register(wrappedError);
      await this.call(AService_constants.A_ServiceFeatures.onError);
    }
  }
  async [_j = AService_constants.A_ServiceFeatures.onBeforeLoad](polyfill, ...args) {
    if (!polyfill) {
      this.scope.register(aPolyfill.A_Polyfill);
      polyfill = this.scope.resolve(aPolyfill.A_Polyfill);
    }
  }
  async [_i = AService_constants.A_ServiceFeatures.onLoad](...args) {
  }
  async [_h = AService_constants.A_ServiceFeatures.onAfterLoad](...args) {
  }
  async [_g = AService_constants.A_ServiceFeatures.onBeforeStart](...args) {
  }
  async [_f = AService_constants.A_ServiceFeatures.onStart](...args) {
  }
  async [_e = AService_constants.A_ServiceFeatures.onAfterStart](...args) {
  }
  async [_d = AService_constants.A_ServiceFeatures.onBeforeStop](...args) {
  }
  async [_c = AService_constants.A_ServiceFeatures.onStop](...args) {
  }
  async [_b = AService_constants.A_ServiceFeatures.onAfterStop](...args) {
  }
  async [_a = AService_constants.A_ServiceFeatures.onError](error, logger, ...args) {
    logger?.error(error);
  }
};
__decorateClass([
  aConcept.A_Concept.Load()
], exports.A_Service.prototype, "load", 1);
__decorateClass([
  aConcept.A_Concept.Start()
], exports.A_Service.prototype, "start", 1);
__decorateClass([
  aConcept.A_Concept.Stop()
], exports.A_Service.prototype, "stop", 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(aPolyfill.A_Polyfill))
], exports.A_Service.prototype, _j, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Service.prototype, _i, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Service.prototype, _h, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Service.prototype, _g, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Service.prototype, _f, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Service.prototype, _e, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Service.prototype, _d, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Service.prototype, _c, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], exports.A_Service.prototype, _b, 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Error)),
  __decorateParam(1, aConcept.A_Inject(aLogger.A_Logger))
], exports.A_Service.prototype, _a, 1);
exports.A_Service = __decorateClass([
  aFrame.A_Frame.Container({
    namespace: "A-Utils",
    name: "A-Service",
    description: "Service container that manages the lifecycle of various types of services, such as HTTP servers and workers or UI loader. It dynamically loads necessary components based on the provided configuration and orchestrates the start and stop processes, ensuring proper error handling and extensibility through feature hooks."
  })
], exports.A_Service);
//# sourceMappingURL=A-Service.container.js.map
//# sourceMappingURL=A-Service.container.js.map