import { A_Fragment, A_TYPES__Component_Constructor } from '@adaas/a-concept';
import { A as A_Signal } from '../../../A-Signal.types-P5VKMKMs.js';
import { A_SignalVector } from '../entities/A-SignalVector.entity.js';

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

export { A_SignalState };
