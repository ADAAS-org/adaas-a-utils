import { A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor, A_TYPES__Entity_Init, A_TYPES__Entity_Serialized } from "@adaas/a-concept"
import { A_Signal } from "./entities/A-Signal.entity"


export type A_SignalConfig_Init = {
    /**
     * An array defining the structure of the signal vector.
     * 
     * Each entry corresponds to a signal component constructor.
     */
    structure?: Array<A_TYPES__Entity_Constructor<A_Signal>>
    /**
     * A string representation of the structure for easier DI resolution.
     * Each signal's constructor name is used to form this string.
     * e.g. "['A_RouterWatcher', 'A_ScopeWatcher', 'A_LoggerWatcher']"
     * OR "A_RouterWatcher,A_ScopeWatcher,A_LoggerWatcher"
     */
    stringStructure?: string
}



export type A_SignalVector_Init<
    TSignalData extends Record<string, any> = Record<string, any>
> = {
    structure: Array<A_TYPES__Entity_Constructor<A_Signal>>,
    values: TSignalData[]
}


export type A_SignalVector_Serialized = A_TYPES__Entity_Serialized & {
    structure: string[],
    values: Array<Record<string, any>>
} & A_TYPES__Entity_Serialized



export type A_Signal_Init<T extends Record<string, any> = Record<string, any>> = {
    /**
     * The signal name
     */
    name?: string,
    /**
     * The signal data
     */
    data: T
}
