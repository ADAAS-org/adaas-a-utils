"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ScheduleObject = void 0;
const A_Deferred_class_1 = require("./A-Deferred.class");
const a_concept_1 = require("@adaas/a-concept");
class A_ScheduleObject {
    /**
     * Creates a scheduled object that will execute the action after specified milliseconds
     *
     *
     * @param ms - milliseconds to wait before executing the action
     * @param action - the action to execute
     * @param config - configuration options for the schedule object
     */
    constructor(
    /**
     * Milliseconds to wait before executing the action
     */
    ms, 
    /**
     * The action to execute after the specified milliseconds
     */
    action, 
    /**
     * Configuration options for the schedule object
     */
    config) {
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
                this.deferred.reject(new a_concept_1.A_Error("Timeout Cleared"));
        }
    }
}
exports.A_ScheduleObject = A_ScheduleObject;
//# sourceMappingURL=A-ScheduleObject.class.js.map