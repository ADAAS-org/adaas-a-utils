import { A_ScheduleObject } from "../global/A_ScheduleObject.class";
import { A_TYPES__ScheduleObjectConfig } from "../types/A_ScheduleObject.types";

export class A_ScheduleHelper {

    static delay<T = void>(ms = 1000, resolver?: Promise<T>) {
        return new Promise<T>((resolve, reject) => setTimeout(() => {
            if (resolver) {
                resolver.then(resolve).catch(reject);
            }
            else {
                resolve(0 as T);
            }
        }, ms))
    }


    static schedule<T = void>(
        ms = 1000,
        resolver: () => Promise<T>,
        config?: A_TYPES__ScheduleObjectConfig
    ): A_ScheduleObject<T> {
        return new A_ScheduleObject<T>(ms, resolver, config);
    }
}