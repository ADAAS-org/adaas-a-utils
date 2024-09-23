"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ScheduleObject = void 0;
const A_Deferred_class_1 = require("./A_Deferred.class");
const A_Error_class_1 = require("./A_Error.class");
class A_ScheduleObject {
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
            this.config = Object.assign(Object.assign({}, this.config), config);
        this.deferred = new A_Deferred_class_1.A_Deferred();
        this.timeout = setTimeout(() => action()
            .then((...args) => this.deferred.resolve(...args))
            .catch((...args) => this.deferred.reject(...args)), ms);
    }
    get promise() {
        return this.deferred.promise;
    }
    clear() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            if (this.config.resolveOnClear)
                this.deferred.resolve(undefined);
            else
                this.deferred.reject(new A_Error_class_1.A_Error("Timeout Cleared"));
        }
    }
}
exports.A_ScheduleObject = A_ScheduleObject;
//# sourceMappingURL=A_ScheduleObject.class.js.map