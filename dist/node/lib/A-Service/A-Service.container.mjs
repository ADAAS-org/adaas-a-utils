import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Container, A_Error, A_Concept, A_Feature, A_Inject } from '@adaas/a-concept';
import { A_ServiceFeatures } from './A-Service.constants';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Service_Error } from './A-Service.error';
import { A_Frame } from '@adaas/a-frame';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';

var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
let A_Service = class extends A_Container {
  /**
   * Load the service
   */
  async load() {
    try {
      await this.call(A_ServiceFeatures.onBeforeLoad);
      await this.call(A_ServiceFeatures.onLoad);
      await this.call(A_ServiceFeatures.onAfterLoad);
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
      await this.call(A_ServiceFeatures.onError);
    }
  }
  /**
   * Start the server
   */
  async start() {
    try {
      await this.call(A_ServiceFeatures.onBeforeStart);
      await this.call(A_ServiceFeatures.onStart);
      await this.call(A_ServiceFeatures.onAfterStart);
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
      await this.call(A_ServiceFeatures.onError);
    }
  }
  /**
   * Stop the server
   */
  async stop() {
    try {
      await this.call(A_ServiceFeatures.onBeforeStop);
      await this.call(A_ServiceFeatures.onStop);
      await this.call(A_ServiceFeatures.onAfterStop);
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
      await this.call(A_ServiceFeatures.onError);
    }
  }
  async [_j = A_ServiceFeatures.onBeforeLoad](polyfill, ...args) {
    if (!polyfill) {
      this.scope.register(A_Polyfill);
      polyfill = this.scope.resolve(A_Polyfill);
    }
  }
  async [_i = A_ServiceFeatures.onLoad](...args) {
  }
  async [_h = A_ServiceFeatures.onAfterLoad](...args) {
  }
  async [_g = A_ServiceFeatures.onBeforeStart](...args) {
  }
  async [_f = A_ServiceFeatures.onStart](...args) {
  }
  async [_e = A_ServiceFeatures.onAfterStart](...args) {
  }
  async [_d = A_ServiceFeatures.onBeforeStop](...args) {
  }
  async [_c = A_ServiceFeatures.onStop](...args) {
  }
  async [_b = A_ServiceFeatures.onAfterStop](...args) {
  }
  async [_a = A_ServiceFeatures.onError](error, logger, ...args) {
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

export { A_Service };
//# sourceMappingURL=A-Service.container.mjs.map
//# sourceMappingURL=A-Service.container.mjs.map