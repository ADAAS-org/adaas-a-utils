import { A_ScheduleObject } from "../global/A_ScheduleObject.class";
import { A_TYPES__ScheduleObjectConfig } from "../types/A_ScheduleObject.types";
export declare class A_ScheduleHelper {
    static delay<T = void>(ms?: number, resolver?: Promise<T>): Promise<T>;
    static schedule<T = void>(ms: number | undefined, resolver: () => Promise<T>, config?: A_TYPES__ScheduleObjectConfig): A_ScheduleObject<T>;
}
