'use strict';

var aConcept = require('@adaas/a-concept');
var AScheduleObject_class = require('./A-ScheduleObject.class');
var aFrame = require('@adaas/a-frame');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_Schedule = class A_Schedule extends aConcept.A_Component {
  async schedule(date, callback, config) {
    const timestamp = aConcept.A_TypeGuards.isString(date) ? new Date(date).getTime() : date;
    return new AScheduleObject_class.A_ScheduleObject(
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
    return new AScheduleObject_class.A_ScheduleObject(
      ms,
      callback,
      config
    );
  }
};
exports.A_Schedule = __decorateClass([
  aFrame.A_Frame.Component({
    namespace: "A-Utils",
    name: "A-Schedule",
    description: "Scheduling component that allows scheduling of callbacks to be executed at specific times or after certain delays. It provides methods to schedule callbacks based on Unix timestamps or ISO date strings, as well as a method to execute callbacks after a specified delay in milliseconds. This component is useful for managing timed operations within an application."
  })
], exports.A_Schedule);
//# sourceMappingURL=A-Schedule.component.js.map
//# sourceMappingURL=A-Schedule.component.js.map