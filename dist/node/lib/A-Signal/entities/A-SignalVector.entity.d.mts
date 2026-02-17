import { A_Entity, A_TYPES__Entity_Constructor } from '@adaas/a-concept';
import { A as A_Signal, d as A_SignalVector_Init, h as A_Signal_TSignalsConstructors, e as A_SignalVector_Serialized, c as A_SignalTValueArray } from '../../../A-Signal.types-P5VKMKMs.mjs';

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

export { A_SignalVector };
