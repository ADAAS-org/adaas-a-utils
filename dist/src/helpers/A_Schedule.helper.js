"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ScheduleHelper = void 0;
const A_ScheduleObject_class_1 = require("../global/A_ScheduleObject.class");
class A_ScheduleHelper {
    static delay(ms = 1000, resolver) {
        return new Promise((resolve, reject) => setTimeout(() => {
            if (resolver) {
                resolver.then(resolve).catch(reject);
            }
            else {
                resolve(0);
            }
        }, ms));
    }
    static schedule(ms = 1000, resolver, config) {
        return new A_ScheduleObject_class_1.A_ScheduleObject(ms, resolver, config);
    }
}
exports.A_ScheduleHelper = A_ScheduleHelper;
//# sourceMappingURL=A_Schedule.helper.js.map