import { A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor, A_TYPES__Entity_Init, A_TYPES__Entity_Serialized } from "@adaas/a-concept"
import { A_Signal } from "./entities/A-Signal.entity"


export type A_SignalConfig_Init<TSignals extends Array<A_Signal> = Array<A_Signal>> = {
    /**
     * An array defining the structure of the signal vector.
     * 
     * Each entry corresponds to a signal component constructor.
     */
    structure?: A_Signal_TSignalsConstructors<TSignals>
    /**
     * A string representation of the structure for easier DI resolution.
     * Each signal's constructor name is used to form this string.
     * e.g. "['A_RouterWatcher', 'A_ScopeWatcher', 'A_LoggerWatcher']"
     * OR "A_RouterWatcher,A_ScopeWatcher,A_LoggerWatcher"
     */
    stringStructure?: string


    propagateSignals?: boolean
}

// export type A_Signal_TSignalsConstructors<T extends Array<A_Signal> = Array<A_Signal>> = {
//     [K in keyof T]: T[K] extends A_Signal ? A_TYPES__Entity_Constructor<T[K]> : never
// }

export type A_Signal_TSignalsConstructors<T extends Array<A_Signal> = Array<A_Signal>> = T extends Array<infer U> ? U extends A_Signal ? A_TYPES__Entity_Constructor<U>[] : never : never


export type A_SignalTValue<T extends A_Signal> = T extends A_Signal<infer U> ? U : never;

export type A_SignalTValueArray<T extends Array<A_Signal>> = {
    [K in keyof T]: T[K] extends A_Signal<infer U> ? U : never
}


export type A_SignalVector_Init<
    _TSignals extends Array<A_Signal> = Array<A_Signal>,

> = {
    structure: A_Signal_TSignalsConstructors<_TSignals>,
    values: _TSignals
}


export type A_SignalVector_Serialized = A_TYPES__Entity_Serialized & {
    structure: string[],
    values: Array<Record<string, any>>
} & A_TYPES__Entity_Serialized



export type A_Signal_Init<T extends Record<string, any> = Record<string, any>> = {
    /**
     * Possible signal id
     * 
     * [!] used for identification only, all properties will be participating in the hash calculation for deduplication
     */
    id?: Array<any>,
    /**
     * The signal name
     */
    name?: string,
    /**
     * The signal data
     */
    data: T
}

export type A_Signal_Serialized<T extends Record<string, any> = Record<string, any>> = {
    /**
     * The signal data
     */
    data: T
} & A_TYPES__Entity_Serialized