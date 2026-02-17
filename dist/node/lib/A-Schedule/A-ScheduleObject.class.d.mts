import { A_UTILS_TYPES__ScheduleObjectCallback, A_UTILS_TYPES__ScheduleObjectConfig } from './A-Schedule.types.mjs';

declare class A_ScheduleObject<T extends any = any> {
    private timeout;
    private deferred;
    private config;
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
    config?: A_UTILS_TYPES__ScheduleObjectConfig);
    get promise(): Promise<T>;
    clear(): void;
}

export { A_ScheduleObject };
