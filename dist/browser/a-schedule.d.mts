import { A_Component } from '@adaas/a-concept';

type A_UTILS_TYPES__ScheduleObjectConfig = {
    /**
     * If the timeout is cleared, should the promise resolve or reject?
     * BY Default it rejects
     *
     * !!!NOTE: If the property is set to true, the promise will resolve with undefined
     */
    resolveOnClear: boolean;
};
type A_UTILS_TYPES__ScheduleObjectCallback<T> = () => Promise<T>;

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

declare class A_Deferred<T> {
    promise: Promise<T>;
    private resolveFn;
    private rejectFn;
    /**
     * Creates a deferred promise
     * @returns A promise that can be resolved or rejected later
     */
    constructor();
    resolve(value: T | PromiseLike<T>): void;
    reject(reason?: any): void;
}

export { A_Deferred, A_Schedule, A_ScheduleObject, type A_UTILS_TYPES__ScheduleObjectCallback, type A_UTILS_TYPES__ScheduleObjectConfig };
