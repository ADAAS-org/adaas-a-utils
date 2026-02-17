import '../../chunk-EQQGB2QZ.mjs';
import { A_Deferred } from './A-Deferred.class';
import { A_Error } from '@adaas/a-concept';

class A_ScheduleObject {
  /**
   * Creates a scheduled object that will execute the action after specified milliseconds
   * 
   * 
   * @param ms - milliseconds to wait before executing the action
   * @param action - the action to execute
   * @param config - configuration options for the schedule object
   */
  constructor(ms, action, config) {
    this.config = {
      /**
       * If the timeout is cleared, should the promise resolve or reject?
       * BY Default it rejects
       * 
       * !!!NOTE: If the property is set to true, the promise will resolve with undefined
       */
      resolveOnClear: false
    };
    if (config)
      this.config = { ...this.config, ...config };
    this.deferred = new A_Deferred();
    this.timeout = setTimeout(
      () => action().then((...args) => this.deferred.resolve(...args)).catch((...args) => this.deferred.reject(...args)),
      ms
    );
  }
  get promise() {
    return this.deferred.promise;
  }
  clear() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      if (this.config.resolveOnClear)
        this.deferred.resolve(void 0);
      else
        this.deferred.reject(new A_Error("Timeout Cleared"));
    }
  }
}

export { A_ScheduleObject };
//# sourceMappingURL=A-ScheduleObject.class.mjs.map
//# sourceMappingURL=A-ScheduleObject.class.mjs.map