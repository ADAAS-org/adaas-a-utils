import { A_Deferred } from "./A-Deferred.class";
import { A_Error } from "@adaas/a-concept";
import { A_UTILS_TYPES__ScheduleObjectCallback, A_UTILS_TYPES__ScheduleObjectConfig } from "./A-Schedule.types";

export class A_ScheduleObject<T extends any = any> {

    private timeout!: NodeJS.Timeout;
    private deferred!: A_Deferred<T>;

    private config: A_UTILS_TYPES__ScheduleObjectConfig = {
        /**
         * If the timeout is cleared, should the promise resolve or reject?
         * BY Default it rejects
         * 
         * !!!NOTE: If the property is set to true, the promise will resolve with undefined
         */
        resolveOnClear: false
    };


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
        ms: number,
        /**
         * The action to execute after the specified milliseconds
         */
        action: A_UTILS_TYPES__ScheduleObjectCallback<T>,
        /**
         * Configuration options for the schedule object
         */
        config?: A_UTILS_TYPES__ScheduleObjectConfig
    ) {
        if (config)
            this.config = { ...this.config, ...config };

        this.deferred = new A_Deferred<T>();

        this.timeout = setTimeout(
            () => action()
                .then((...args) => this.deferred.resolve(...args))
                .catch((...args) => this.deferred.reject(...args)),
            ms
        );
    }

    get promise(): Promise<T> {
        return this.deferred.promise;
    }

    clear(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);

            if (this.config.resolveOnClear)
                this.deferred.resolve(undefined as T);
            else
                this.deferred.reject(new A_Error("Timeout Cleared"));
        }
    }
}

