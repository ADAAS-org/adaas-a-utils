export type A_UTILS_TYPES__ScheduleObjectConfig = {
    /**
     * If the timeout is cleared, should the promise resolve or reject?
     * BY Default it rejects
     *
     * !!!NOTE: If the property is set to true, the promise will resolve with undefined
     */
    resolveOnClear: boolean;
};
export type A_UTILS_TYPES__ScheduleObjectCallback<T> = () => Promise<T>;
