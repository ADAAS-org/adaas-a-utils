import { A_TYPES__ScheduleObjectConfig } from "../types/A_ScheduleObject.types";
export declare class A_ScheduleObject<T> {
    private timeout;
    private deferred;
    private config;
    constructor(ms: number, action: () => Promise<T>, config?: A_TYPES__ScheduleObjectConfig);
    get promise(): Promise<T>;
    clear(): void;
}
