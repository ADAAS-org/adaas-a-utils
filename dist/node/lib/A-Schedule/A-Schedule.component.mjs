import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Component, A_TypeGuards } from '@adaas/a-concept';
import { A_ScheduleObject } from './A-ScheduleObject.class';
import { A_Frame } from '@adaas/a-frame';

let A_Schedule = class extends A_Component {
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

export { A_Schedule };
//# sourceMappingURL=A-Schedule.component.mjs.map
//# sourceMappingURL=A-Schedule.component.mjs.map