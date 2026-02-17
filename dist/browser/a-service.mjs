import { A_Logger } from './chunk-TK5UEYMZ.mjs';
import './chunk-ECSGFDRQ.mjs';
import { A_Polyfill } from './chunk-J6CLHXFQ.mjs';
import './chunk-TQ5UON22.mjs';
import { __decorateClass, __decorateParam } from './chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Feature, A_Inject, A_Error, A_Container } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

// src/lib/A-Service/A-Service.constants.ts
var A_ServiceFeatures = /* @__PURE__ */ ((A_ServiceFeatures2) => {
  A_ServiceFeatures2["onBeforeLoad"] = "_A_Service_onBeforeLoad";
  A_ServiceFeatures2["onLoad"] = "_A_Service_onLoad";
  A_ServiceFeatures2["onAfterLoad"] = "_A_Service_onAfterLoad";
  A_ServiceFeatures2["onBeforeStart"] = "_A_Service_onBeforeStart";
  A_ServiceFeatures2["onStart"] = "_A_Service_onStart";
  A_ServiceFeatures2["onAfterStart"] = "_A_Service_onAfterStart";
  A_ServiceFeatures2["onBeforeStop"] = "_A_Service_onBeforeStop";
  A_ServiceFeatures2["onStop"] = "_A_Service_onStop";
  A_ServiceFeatures2["onAfterStop"] = "_A_Service_onAfterStop";
  A_ServiceFeatures2["onError"] = "_A_Service_onError";
  return A_ServiceFeatures2;
})(A_ServiceFeatures || {});
var A_Service_Error = class extends A_Error {
};
A_Service_Error.ServiceLoadError = "Service load error";
A_Service_Error.ServiceStartError = "Service start error";
A_Service_Error.ServiceStopError = "Service stop error";
var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
var A_Service = class extends A_Container {
  /**
   * Load the service
   */
  async load() {
    try {
      await this.call("_A_Service_onBeforeLoad" /* onBeforeLoad */);
      await this.call("_A_Service_onLoad" /* onLoad */);
      await this.call("_A_Service_onAfterLoad" /* onAfterLoad */);
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof A_Service_Error:
          wrappedError = error;
          break;
        case (error instanceof A_Error && error.originalError instanceof A_Service_Error):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new A_Service_Error({
            title: A_Service_Error.ServiceLoadError,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      this.scope.register(wrappedError);
      await this.call("_A_Service_onError" /* onError */);
    }
  }
  /**
   * Start the server
   */
  async start() {
    try {
      await this.call("_A_Service_onBeforeStart" /* onBeforeStart */);
      await this.call("_A_Service_onStart" /* onStart */);
      await this.call("_A_Service_onAfterStart" /* onAfterStart */);
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof A_Service_Error:
          wrappedError = error;
          break;
        case (error instanceof A_Error && error.originalError instanceof A_Service_Error):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new A_Service_Error({
            title: A_Service_Error.ServiceStartError,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      this.scope.register(wrappedError);
      await this.call("_A_Service_onError" /* onError */);
    }
  }
  /**
   * Stop the server
   */
  async stop() {
    try {
      await this.call("_A_Service_onBeforeStop" /* onBeforeStop */);
      await this.call("_A_Service_onStop" /* onStop */);
      await this.call("_A_Service_onAfterStop" /* onAfterStop */);
    } catch (error) {
      let wrappedError;
      switch (true) {
        case error instanceof A_Service_Error:
          wrappedError = error;
          break;
        case (error instanceof A_Error && error.originalError instanceof A_Service_Error):
          wrappedError = error.originalError;
          break;
        default:
          wrappedError = new A_Service_Error({
            title: A_Service_Error.ServiceStopError,
            description: "An error occurred while processing the request.",
            originalError: error
          });
          break;
      }
      this.scope.register(wrappedError);
      await this.call("_A_Service_onError" /* onError */);
    }
  }
  async [_j = "_A_Service_onBeforeLoad" /* onBeforeLoad */](polyfill, ...args) {
    if (!polyfill) {
      this.scope.register(A_Polyfill);
      polyfill = this.scope.resolve(A_Polyfill);
    }
  }
  async [_i = "_A_Service_onLoad" /* onLoad */](...args) {
  }
  async [_h = "_A_Service_onAfterLoad" /* onAfterLoad */](...args) {
  }
  async [_g = "_A_Service_onBeforeStart" /* onBeforeStart */](...args) {
  }
  async [_f = "_A_Service_onStart" /* onStart */](...args) {
  }
  async [_e = "_A_Service_onAfterStart" /* onAfterStart */](...args) {
  }
  async [_d = "_A_Service_onBeforeStop" /* onBeforeStop */](...args) {
  }
  async [_c = "_A_Service_onStop" /* onStop */](...args) {
  }
  async [_b = "_A_Service_onAfterStop" /* onAfterStop */](...args) {
  }
  async [_a = "_A_Service_onError" /* onError */](error, logger, ...args) {
    logger?.error(error);
  }
};
__decorateClass([
  A_Concept.Load()
], A_Service.prototype, "load", 1);
__decorateClass([
  A_Concept.Start()
], A_Service.prototype, "start", 1);
__decorateClass([
  A_Concept.Stop()
], A_Service.prototype, "stop", 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_Polyfill))
], A_Service.prototype, _j, 1);
__decorateClass([
  A_Feature.Extend()
], A_Service.prototype, _i, 1);
__decorateClass([
  A_Feature.Extend()
], A_Service.prototype, _h, 1);
__decorateClass([
  A_Feature.Extend()
], A_Service.prototype, _g, 1);
__decorateClass([
  A_Feature.Extend()
], A_Service.prototype, _f, 1);
__decorateClass([
  A_Feature.Extend()
], A_Service.prototype, _e, 1);
__decorateClass([
  A_Feature.Extend()
], A_Service.prototype, _d, 1);
__decorateClass([
  A_Feature.Extend()
], A_Service.prototype, _c, 1);
__decorateClass([
  A_Feature.Extend()
], A_Service.prototype, _b, 1);
__decorateClass([
  A_Feature.Extend({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Error)),
  __decorateParam(1, A_Inject(A_Logger))
], A_Service.prototype, _a, 1);
A_Service = __decorateClass([
  A_Frame.Container({
    namespace: "A-Utils",
    name: "A-Service",
    description: "Service container that manages the lifecycle of various types of services, such as HTTP servers and workers or UI loader. It dynamically loads necessary components based on the provided configuration and orchestrates the start and stop processes, ensuring proper error handling and extensibility through feature hooks."
  })
], A_Service);

export { A_Service, A_ServiceFeatures };
//# sourceMappingURL=a-service.mjs.map
//# sourceMappingURL=a-service.mjs.map