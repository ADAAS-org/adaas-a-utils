import { A_Component } from '@adaas/a-concept';
import { A_ScheduleObject } from './A-ScheduleObject.class.js';
import { A_UTILS_TYPES__ScheduleObjectCallback, A_UTILS_TYPES__ScheduleObjectConfig } from './A-Schedule.types.js';

declare class A_Schedule extends A_Component {
    /**
     * Allows to schedule a callback for particular time in the future
     *
     * @param timestamp - Unix timestamp in milliseconds
     * @param callback - The callback to execute
     * @returns A promise that resolves to the schedule object
     */
    schedule<T extends any = any>(
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
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
    schedule<T extends any = any>(
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
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
    /**
     * Allows to execute callback after particular delay in milliseconds
     * So the callback will be executed after the specified delay
     *
     * @param ms
     */
    delay<T extends any = any>(
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
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
}

export { A_Schedule };
