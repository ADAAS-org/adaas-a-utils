import { __decorateClass } from './chunk-EQQGB2QZ.mjs';
import { A_Component, A_TypeGuards, A_Error } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

// src/lib/A-Schedule/A-Deferred.class.ts
var A_Deferred = class {
  /**
   * Creates a deferred promise
   * @returns A promise that can be resolved or rejected later
   */
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }
  resolve(value) {
    this.resolveFn(value);
  }
  reject(reason) {
    this.rejectFn(reason);
  }
};
var A_ScheduleObject = class {
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
};
var A_Schedule = class extends A_Component {
  async schedule(date, callback, config) {
    const timestamp = A_TypeGuards.isString(date) ? new Date(date).getTime() : date;
    return new A_ScheduleObject(
      timestamp - Date.now(),
      callback,
      config
    );
  }
  /**
   * Allows to execute callback after particular delay in milliseconds
   * So the callback will be executed after the specified delay
   * 
   * @param ms 
   */
  async delay(ms, callback, config) {
    return new A_ScheduleObject(
      ms,
      callback,
      config
    );
  }
};
A_Schedule = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "A-Schedule",
    description: "Scheduling component that allows scheduling of callbacks to be executed at specific times or after certain delays. It provides methods to schedule callbacks based on Unix timestamps or ISO date strings, as well as a method to execute callbacks after a specified delay in milliseconds. This component is useful for managing timed operations within an application."
  })
], A_Schedule);

export { A_Deferred, A_Schedule, A_ScheduleObject };
//# sourceMappingURL=a-schedule.mjs.map
//# sourceMappingURL=a-schedule.mjs.map