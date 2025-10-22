import { A_Component, A_TypeGuards } from "@adaas/a-concept";
import { A_ScheduleObject } from "./A-ScheduleObject.class";
import { A_UTILS_TYPES__ScheduleObjectCallback, A_UTILS_TYPES__ScheduleObjectConfig } from "./A-Schedule.types";



export class A_Schedule extends A_Component {

    /**
     * Allows to schedule a callback for particular time in the future
     * 
     * @param timestamp - Unix timestamp in milliseconds
     * @param callback - The callback to execute
     * @returns A promise that resolves to the schedule object
     */
    async schedule<T extends any = any>(
        /**
         * Unix timestamp in milliseconds
         */
        timestamp: number,
        /**
         * The callback to execute
         */
        callback: A_UTILS_TYPES__ScheduleObjectCallback<T>,
        /**
         * Configuration options for the schedule object
         */
        config?: A_UTILS_TYPES__ScheduleObjectConfig
    ): Promise<A_ScheduleObject<T>>
    async schedule<T extends any = any>(
        /**
         * ISO date string representing the date and time to schedule the callback for
         */
        date: string,
        /**
         * The callback to execute
         */
        callback: A_UTILS_TYPES__ScheduleObjectCallback<T>,
        /**
        * Configuration options for the schedule object
        */
        config?: A_UTILS_TYPES__ScheduleObjectConfig
    ): Promise<A_ScheduleObject<T>>
    async schedule<T extends any = any>(
        date: string | number,
        callback: A_UTILS_TYPES__ScheduleObjectCallback<T>,
        config?: A_UTILS_TYPES__ScheduleObjectConfig
    ): Promise<A_ScheduleObject<T>> {

        const timestamp = A_TypeGuards.isString(date)
            ? (new Date(date)).getTime()
            : date;

        return new A_ScheduleObject<T>(
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
    async delay<T extends any = any>(
        /**
         * Delay in milliseconds
         */
        ms: number,
        /**
         * The callback to execute after the delay
         */
        callback: A_UTILS_TYPES__ScheduleObjectCallback<T>,
        /**
        * Configuration options for the schedule object
        */
        config?: A_UTILS_TYPES__ScheduleObjectConfig
    ): Promise<A_ScheduleObject<T>> {
        return new A_ScheduleObject<T>(
            ms,
            callback,
            config
        );
    }
}