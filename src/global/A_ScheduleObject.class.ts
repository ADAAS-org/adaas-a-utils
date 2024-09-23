import { A_TYPES__ScheduleObjectConfig } from "../types/A_ScheduleObject.types";
import { A_Deferred } from "./A_Deferred.class";
import { A_Error } from "./A_Error.class";

export class A_ScheduleObject<T> {

    private timeout!: NodeJS.Timeout;
    private deferred!: A_Deferred<T>;

    private config: A_TYPES__ScheduleObjectConfig = {
        /**
         * If the timeout is cleared, should the promise resolve or reject?
         * BY Default it rejects
         * 
         * !!!NOTE: If the property is set to true, the promise will resolve with undefined
         */
        resolveOnClear: false
    };

    constructor(
        ms: number,
        action: () => Promise<T>,
        config?: A_TYPES__ScheduleObjectConfig
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

