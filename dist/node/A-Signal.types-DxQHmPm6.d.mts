import { A_Entity, A_TYPES__Entity_Serialized, A_TYPES__Entity_Constructor } from '@adaas/a-concept';

/**
 * A Signal Entity is an individual signal instance that carries data.
 * Signals is a event types that uses for vectors of signals to be used for further processing.
 *
 * Comparing to standard events, signals should be used in case when the event impacts some "state"
 * and the state should be used instead of the event itself.
 *
 * For example, a signal can represent the current status of a user (online/offline/away),
 * while an event would represent a single action (user logged in/logged out).
 *
 * Signals are typically used in scenarios where the current state is more important than individual events,
 * such as monitoring systems, real-time dashboards, or stateful applications.
 */
declare class A_Signal<_TSignalDataType extends any = any, _TSignalSerializedDataType extends any = _TSignalDataType> extends A_Entity<A_Signal_Init<_TSignalDataType>, A_Signal_Serialized<_TSignalSerializedDataType>> {
    /**
     * The actual data carried by the signal.
     */
    data: _TSignalDataType;
    /**
     * This method compares the current signal with another signal instance by deduplication ID
     * this id can be configured during initialization with the "id" property.
     *
     * example:
     * * const signalA = new A_Signal({ id: ['user-status', 'user123'], data: { status: 'online' } });
     * * const signalB = new A_Signal({ id: ['user-status', 'user123'], data: { status: 'offline' } });
     *
     * signalA.compare(signalB) // true because both signals have the same deduplication ID
     *
     * @param other
     * @returns
     */
    compare(other: A_Signal<_TSignalDataType>): boolean;
    /**
     * Allows to define default data for the signal.
     *
     * If no data is provided during initialization, the default data will be used.
     *
     * @returns
     */
    fromUndefined(): void;
    /**
     * Allows to initialize the signal from a new signal entity. This is useful for example when we want to create a new instance of the signal entity with the same data as another instance, but with a different ASEID.
     *
     * @param newEntity
     */
    fromNew(newEntity: A_Signal_Init<_TSignalDataType>): void;
    /**
     * Allows to initialize the signal from a serialized version of the signal. This is useful for example when we receive a signal from the server and we want to create an instance of the signal entity from the received data.
     *
     * @param serializedEntity
     */
    fromJSON(serializedEntity: A_Signal_Serialized<_TSignalSerializedDataType>): void;
    toJSON(): A_Signal_Serialized<_TSignalSerializedDataType>;
}

type A_SignalConfig_Init<TSignals extends Array<A_Signal> = Array<A_Signal>> = {
    /**
     * An array defining the structure of the signal vector.
     *
     * Each entry corresponds to a signal component constructor.
     */
    structure?: A_Signal_TSignalsConstructors<TSignals>;
    /**
     * A string representation of the structure for easier DI resolution.
     * Each signal's constructor name is used to form this string.
     * e.g. "['A_RouterWatcher', 'A_ScopeWatcher', 'A_LoggerWatcher']"
     * OR "A_RouterWatcher,A_ScopeWatcher,A_LoggerWatcher"
     */
    stringStructure?: string;
    propagateSignals?: boolean;
};
type A_Signal_TSignalsConstructors<T extends Array<A_Signal> = Array<A_Signal>> = T extends Array<infer U> ? U extends A_Signal ? A_TYPES__Entity_Constructor<U>[] : never : never;
type A_SignalTValue<T extends A_Signal> = T extends A_Signal<infer U> ? U : never;
type A_SignalTValueArray<T extends Array<A_Signal>> = {
    [K in keyof T]: T[K] extends A_Signal<infer U> ? U : never;
};
type A_SignalVector_Init<_TSignals extends Array<A_Signal> = Array<A_Signal>> = {
    structure: A_Signal_TSignalsConstructors<_TSignals>;
    values: _TSignals;
};
type A_SignalVector_Serialized = A_TYPES__Entity_Serialized & {
    structure: string[];
    values: Array<Record<string, any>>;
} & A_TYPES__Entity_Serialized;
type A_Signal_Init<T extends any = any> = {
    /**
     * Possible signal id
     *
     * [!] used for identification only, all properties will be participating in the hash calculation for deduplication
     */
    id?: Array<any>;
    /**
     * The signal name
     */
    name?: string;
    /**
     * The signal data
     */
    data: T;
};
type A_Signal_Serialized<T extends any = any> = {
    /**
     * The signal data
     */
    data: T;
} & A_TYPES__Entity_Serialized;

export { A_Signal as A, type A_SignalConfig_Init as a, type A_SignalTValue as b, type A_SignalTValueArray as c, type A_SignalVector_Init as d, type A_SignalVector_Serialized as e, type A_Signal_Init as f, type A_Signal_Serialized as g, type A_Signal_TSignalsConstructors as h };
