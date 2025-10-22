"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Schedule = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_ScheduleObject_class_1 = require("./A-ScheduleObject.class");
class A_Schedule extends a_concept_1.A_Component {
    schedule(date, callback, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = a_concept_1.A_TypeGuards.isString(date)
                ? (new Date(date)).getTime()
                : date;
            return new A_ScheduleObject_class_1.A_ScheduleObject(timestamp - Date.now(), callback, config);
        });
    }
    /**
     * Allows to execute callback after particular delay in milliseconds
     * So the callback will be executed after the specified delay
     *
     * @param ms
     */
    delay(
    /**
     * Delay in milliseconds
     */
    ms, 
    /**
     * The callback to execute after the delay
     */
    callback, 
    /**
    * Configuration options for the schedule object
    */
    config) {
        return __awaiter(this, void 0, void 0, function* () {
            return new A_ScheduleObject_class_1.A_ScheduleObject(ms, callback, config);
        });
    }
}
exports.A_Schedule = A_Schedule;
//# sourceMappingURL=A-Schedule.component.js.map