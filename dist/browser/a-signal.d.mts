import { A_TYPES__Entity_Serialized, A_TYPES__Entity_Constructor, A_Entity, A_Fragment, A_TYPES__Component_Constructor, A_Component, A_Error, A_Scope } from '@adaas/a-concept';
import { A as A_Logger, f as A_Config } from './A-Logger.component-Be-LMV3I.mjs';
import './a-execution.mjs';

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
type A_Signal_Init<T extends Record<string, any> = Record<string, any>> = {
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
type A_Signal_Serialized<T extends Record<string, any> = Record<string, any>> = {
    /**
     * The signal data
     */
    data: T;
} & A_TYPES__Entity_Serialized;

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
declare class A_Signal<_TSignalDataType extends Record<string, any> = Record<string, any>> extends A_Entity<A_Signal_Init<_TSignalDataType>, A_Signal_Serialized<_TSignalDataType>> {
    /**
     * Allows to define default data for the signal.
     *
     * If no data is provided during initialization, the default data will be used.
     *
     * @returns
     */
    static default(): Promise<A_Signal | undefined>;
    /**
     * The actual data carried by the signal.
     */
    data: _TSignalDataType;
    /**
      * Generates signal hash uses for comparison
      *
      * @param str
      */
    protected createHash(str?: string): string;
    protected createHash(str?: undefined): string;
    protected createHash(str?: Record<string, any>): string;
    protected createHash(str?: Array<any>): string;
    protected createHash(str?: number): string;
    protected createHash(str?: boolean): string;
    protected createHash(str?: null): string;
    protected createHash(map?: Map<any, any>): string;
    protected createHash(set?: Set<any>): string;
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
    fromJSON(serializedEntity: A_Signal_Serialized<_TSignalDataType>): void;
    fromNew(newEntity: A_Signal_Init<_TSignalDataType>): void;
    toJSON(): A_Signal_Serialized<_TSignalDataType>;
}

/**
 * A Signal Vector Entity is a collection of signals structured in a specific way.
 * It allows grouping multiple signals together for batch processing or transmission.
 *
 * Signal Vectors are useful in scenarios where multiple related signals need to be handled together,
 * as a state of the system or a snapshot of various parameters at a given time.
 *
 * @template TSignalsConstructors - Array of signal constructor types (e.g., [typeof MySignal, typeof CustomSignal])
 * @template TSignals - Array of signal instances derived from constructors
 */
declare class A_SignalVector<TSignals extends A_Signal[] = A_Signal[]> extends A_Entity<A_SignalVector_Init<TSignals>> {
    /**
     * The structure of the signal vector, defining the types of signals it contains.
     *
     * For example:
     * [UserSignInSignal, UserStatusSignal, UserActivitySignal]
     *
     * [!] if not provided, it will be derived from the signals values.
     */
    protected _structure?: A_Signal_TSignalsConstructors<TSignals>;
    /**
     * It's actual vector Values of Signals like :
     * [UserActionSignal, UserMousePositionSignal, ExternalDependencySignal]
     */
    protected _signals: TSignals;
    constructor(values: TSignals, structure?: {
        [K in keyof TSignals]: TSignals[K] extends A_Signal ? A_TYPES__Entity_Constructor<TSignals[K]> : never;
    });
    constructor(serialized: A_SignalVector_Serialized);
    fromNew(newEntity: A_SignalVector_Init<TSignals>): void;
    /**
     * The structure of the signal vector, defining the types of signals it contains.
     *
     * For example:
     * [UserSignInSignal, UserStatusSignal, UserActivitySignal]
     *
     */
    get structure(): A_Signal_TSignalsConstructors<TSignals>;
    get length(): number;
    /**
     * Enables iteration over the signals in the vector.
     *
     * @returns
     */
    [Symbol.iterator](): Iterator<TSignals[number]>;
    /**
     * Allows to match the current Signal Vector with another Signal Vector by comparing each signal in the structure.
     * This method returns true if all signals in the vector match the corresponding signals in the other vector.
     *
     * @param other
     * @returns
     */
    match(other: A_SignalVector<TSignals>): boolean;
    /**
     * This method should ensure that the current Signal Vector contains all signals from the provided Signal Vector.
     *
     * @param signal
     */
    contains(signal: A_SignalVector): boolean;
    /**
     * Checks if the vector contains a signal of the specified type.
     *
     * @param signal
     */
    has(signal: A_Signal): boolean;
    has(signalConstructor: A_TYPES__Entity_Constructor<A_Signal>): boolean;
    /**
     * Retrieves the signal of the specified type from the vector.
     *
     * @param signal
     */
    get<T extends A_Signal>(signal: T): T | undefined;
    get<T extends A_Signal>(signalConstructor: A_TYPES__Entity_Constructor<T>): T | undefined;
    /**
     * Converts to Array of values of signals in the vector
     * Maintains the order specified in the structure/generic type
     *
     * @param structure - Optional structure to override the default ordering
     * @returns Array of signal instances in the specified order
     */
    toVector<T extends Array<A_Signal> = TSignals>(structure?: A_Signal_TSignalsConstructors<T>): Promise<T>;
    /**
     * Converts to Array of data of signals in the vector
     * Maintains the order specified in the structure/generic type
     *
     * @param structure - Optional structure to override the default ordering
     * @returns Array of serialized signal data in the specified order
     */
    toDataVector<T extends A_Signal[] = TSignals>(structure?: A_Signal_TSignalsConstructors<T>): Promise<A_SignalTValueArray<T>>;
    /**
     * Converts to Object with signal constructor names as keys and their corresponding data values
     * Uses the structure ordering to ensure consistent key ordering
     *
     * @returns Object with signal constructor names as keys and signal data as values
     */
    toObject<T extends Array<A_Signal> = TSignals>(structure?: {
        [K in keyof T]: T[K] extends A_Signal ? A_TYPES__Entity_Constructor<T[K]> : never;
    }): Promise<{
        [key: string]: T[number] extends A_Signal<infer D> ? D | undefined : never;
    }>;
    /**
     * Serializes the Signal Vector to a JSON-compatible format.
     *
     *
     * @returns
     */
    toJSON(): A_SignalVector_Serialized;
}

/**
 * A_SignalState manages the latest state of all signals within a given scope.
 *
 * This class maintains a mapping between signal constructors and their most recently emitted values,
 * providing a centralized state store for signal management within an application context.
 *
 * @template TSignalData - Union type of all possible signal data types that can be stored (must extend Record<string, any>)
 *
 * The generic ensures type safety by maintaining correspondence between:
 * - Signal constructor types and their data types
 * - Signal instances and their emitted value types
 * - Vector structure and the data it contains
 */
declare class A_SignalState<TSignalData extends Record<string, any> = Record<string, any>> extends A_Fragment {
    /**
     * Internal map storing the relationship between signal constructors and their latest values
     * Key: Signal constructor function
     * Value: Latest emitted data from that signal type
     */
    protected _state: Map<A_TYPES__Component_Constructor<A_Signal>, A_Signal>;
    /**
     * Previous state map to track changes between signal emissions
     * Key: Signal constructor function
     * Value: Previous emitted data from that signal type
     */
    protected _prevState: Map<A_TYPES__Component_Constructor<A_Signal>, A_Signal>;
    /**
     * Optional structure defining the ordered list of signal constructors
     * Used for vector operations and initialization
     */
    protected _structure: Array<A_TYPES__Component_Constructor<A_Signal>>;
    /**
     * Gets the ordered structure of signal constructors
     * @returns Array of signal constructors in their defined order
     */
    get structure(): Array<A_TYPES__Component_Constructor<A_Signal>>;
    /**
     * Creates a new A_SignalState instance
     *
     * @param structure - Optional array defining the ordered structure of signal constructors
     *                   This structure is used for vector operations and determines the order
     *                   in which signals are processed and serialized
     */
    constructor(structure: A_TYPES__Component_Constructor<A_Signal>[]);
    /**
     * Sets the latest value for a specific signal type
     *
     * @param signal - The signal constructor to associate the value with
     * @param value - The data value emitted by the signal
     */
    set(signal: A_Signal, value: A_Signal): void;
    set(signal: A_Signal): void;
    set(signal: A_TYPES__Component_Constructor<A_Signal>, value: A_Signal): void;
    /**
     * Retrieves the latest value for a specific signal type
     *
     * @param signal - The signal constructor to get the value for
     * @returns The latest data value or undefined if no value has been set
     */
    get(signal: A_Signal): A_Signal | undefined;
    get(signal: A_TYPES__Component_Constructor<A_Signal>): A_Signal | undefined;
    /**
     * Retrieves the previous value for a specific signal type
     *
     * @param signal
     */
    getPrev(signal: A_Signal): A_Signal | undefined;
    getPrev(signal: A_TYPES__Component_Constructor<A_Signal>): A_Signal | undefined;
    /**
     * Checks if a signal type has been registered in the state
     *
     * @param signal - The signal constructor to check for
     * @returns True if the signal type exists in the state map
     */
    has(signal: A_Signal): boolean;
    has(signal: A_TYPES__Component_Constructor<A_Signal>): boolean;
    /**
     * Removes a signal type and its associated value from the state
     *
     * @param signal - The signal constructor to remove
     * @returns True if the signal was successfully deleted, false if it didn't exist
     */
    delete(signal: A_Signal): boolean;
    delete(signal: A_TYPES__Component_Constructor<A_Signal>): boolean;
    /**
     * Converts the current state to a vector (ordered array) format
     *
     * The order is determined by the structure array provided during construction.
     * Each position in the vector corresponds to a specific signal type's latest value.
     *
     * @returns Array of signal values in the order defined by the structure
     * @throws Error if structure is not defined or if any signal value is undefined
     */
    toVector(): A_SignalVector;
    /**
     * Converts the current state to an object with signal constructor names as keys
     *
     * This provides a more readable representation of the state where each signal
     * type is identified by its constructor name.
     *
     * @returns Object mapping signal constructor names to their latest values
     * @throws Error if any signal value is undefined
     */
    toObject(): Record<string, A_Signal>;
}

/**
 * This component should dictate a structure of the vector for all signals within a given scope.
 * so if there're multiple signals it should say what type at what position should be expected.
 *
 * e.g. [A_RouterWatcher, A_ScopeWatcher, A_LoggerWatcher]
 * This structure then should be used for any further processing of signals within the scope.
 */
declare class A_SignalConfig extends A_Fragment {
    protected _structure?: Array<A_TYPES__Entity_Constructor<A_Signal>>;
    protected _config: A_SignalConfig_Init;
    protected _ready?: Promise<void>;
    get structure(): Array<A_TYPES__Entity_Constructor<A_Signal>>;
    /**
     * Uses for synchronization to ensure the config is initialized.
     *
     * @returns True if the configuration has been initialized.
     */
    get ready(): Promise<void> | undefined;
    constructor(params: A_SignalConfig_Init);
    /**
     * Initializes the signal configuration if not already initialized.
     *
     * @returns
     */
    initialize(): Promise<void>;
    /**
     * Initializes the signal configuration by processing the provided structure or string representation.
     * This method sets up the internal structure of signal constructors based on the configuration.
     */
    protected _initialize(): Promise<void>;
}

declare enum A_SignalBusFeatures {
    onBeforeNext = "_A_SignalBusFeatures_onBeforeNext",
    onNext = "_A_SignalBusFeatures_onNext",
    onError = "_A_SignalBusFeatures_onError"
}

/**
 * This component should listen for all available signal watchers components in this and all parent scopes.
 * When a signal is emitted, it should forward the signal to all registered watchers.
 *
 * A_SignalBus should always return the same vector structure of the signals, and that's why it should store the state of the latest behavior.
 * For example if there are 3 watchers registered, the bus should always return a vector of 3 elements, based on the A_SignalConfig structure.
 *
 *
 * The component itself is stateless and all methods uses only parameters (context) is provided with.
 */
declare class A_SignalBus extends A_Component {
    next(...signals: A_Signal[]): Promise<void>;
    protected [A_SignalBusFeatures.onError](error: A_Error, logger?: A_Logger, ...args: any[]): Promise<void>;
    [A_SignalBusFeatures.onBeforeNext](scope: A_Scope, globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>, state?: A_SignalState, logger?: A_Logger, config?: A_SignalConfig): Promise<void>;
    /**
     * This methods extends A-Signal Emit feature to handle signal emission within the bus.
     *
     * It updates the signal state and emits the updated signal vector.
     *
     * @param signal
     * @param globalConfig
     * @param logger
     * @param state
     * @param config
     * @returns
     */
    [A_SignalBusFeatures.onNext](signals: A_Signal[], scope: A_Scope, state: A_SignalState, globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>, logger?: A_Logger, config?: A_SignalConfig): Promise<void>;
}

declare class A_SignalBusError extends A_Error {
    static readonly SignalProcessingError = "Signal processing error";
}

export { A_Signal, A_SignalBus, A_SignalBusError, A_SignalBusFeatures, A_SignalConfig, type A_SignalConfig_Init, A_SignalState, type A_SignalTValue, type A_SignalTValueArray, A_SignalVector, type A_SignalVector_Init, type A_SignalVector_Serialized, type A_Signal_Init, type A_Signal_Serialized, type A_Signal_TSignalsConstructors };
