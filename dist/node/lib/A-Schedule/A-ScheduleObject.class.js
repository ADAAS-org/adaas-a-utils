'use strict';

var ADeferred_class = require('./A-Deferred.class');
var aConcept = require('@adaas/a-concept');

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
    this.deferred = new ADeferred_class.A_Deferred();
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
        this.deferred.reject(new aConcept.A_Error("Timeout Cleared"));
    }
  }
}

exports.A_ScheduleObject = A_ScheduleObject;
//# sourceMappingURL=A-ScheduleObject.class.js.map
//# sourceMappingURL=A-ScheduleObject.class.js.map