import { A_Context, A_Fragment, A_TYPES__Component_Constructor } from "@adaas/a-concept";
import { A_Signal } from "../entities/A-Signal.entity";
import { A_SignalVector } from "../entities/A-SignalVector.entity";
import { A_Frame } from "@adaas/a-frame";

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
@A_Frame.Fragment({
    namespace: 'A-Utils',
    name: 'A-SignalState',
    description: 'Manages the latest state of all signals within a given scope, maintaining a mapping between signal constructors and their most recently emitted values.'
})
export class A_SignalState<
    TSignalData extends Record<string, any> = Record<string, any>
> extends A_Fragment {

    /**
     * Internal map storing the relationship between signal constructors and their latest values
     * Key: Signal constructor function
     * Value: Latest emitted data from that signal type
     */
    protected _state: Map<A_TYPES__Component_Constructor<A_Signal>, A_Signal> = new Map();

    /**
     * Previous state map to track changes between signal emissions
     * Key: Signal constructor function
     * Value: Previous emitted data from that signal type
     */
    protected _prevState: Map<A_TYPES__Component_Constructor<A_Signal>, A_Signal> = new Map();

    /**
     * Optional structure defining the ordered list of signal constructors
     * Used for vector operations and initialization
     */
    protected _structure: Array<A_TYPES__Component_Constructor<A_Signal>>;


    /**
     * Gets the ordered structure of signal constructors
     * @returns Array of signal constructors in their defined order
     */
    get structure(): Array<A_TYPES__Component_Constructor<A_Signal>> {
        return this._structure || [];
    }

    /**
     * Creates a new A_SignalState instance
     * 
     * @param structure - Optional array defining the ordered structure of signal constructors
     *                   This structure is used for vector operations and determines the order
     *                   in which signals are processed and serialized
     */
    constructor(
        structure: A_TYPES__Component_Constructor<A_Signal>[]
    ) {
        super({ name: "A_SignalState" });

        this._structure = structure;

        // Initialize the state map with undefined values for each signal in the structure
        // This ensures all expected signals have entries in the state map from the start
      
    }


    /**
     * Sets the latest value for a specific signal type
     * 
     * @param signal - The signal constructor to associate the value with
     * @param value - The data value emitted by the signal
     */
    set(
        signal: A_Signal,
        value: A_Signal
    ): void
    set(
        signal: A_Signal
    ): void
    set(
        signal: A_TYPES__Component_Constructor<A_Signal>,
        value: A_Signal
    ): void
    set(
        param1: A_TYPES__Component_Constructor<A_Signal> | A_Signal,
        param2?: A_Signal
    ): void {
        const signal = param1 instanceof A_Signal ? param1.constructor as A_TYPES__Component_Constructor<A_Signal> : param1;
        const value = param1 instanceof A_Signal ? param1 : param2!;

        this._prevState.set(signal, this._state.get(signal)!);
        this._state.set(signal, value);
    }

    /**
     * Retrieves the latest value for a specific signal type
     * 
     * @param signal - The signal constructor to get the value for
     * @returns The latest data value or undefined if no value has been set
     */
    get(
        signal: A_Signal
    ): A_Signal | undefined
    get(
        signal: A_TYPES__Component_Constructor<A_Signal>
    ): A_Signal | undefined
    get(
        param: A_TYPES__Component_Constructor<A_Signal> | A_Signal
    ): A_Signal | undefined {
        const signal = param instanceof A_Signal ? param.constructor as A_TYPES__Component_Constructor<A_Signal> : param;
        return this._state.get(signal);
    }

    /**
     * Retrieves the previous value for a specific signal type
     * 
     * @param signal 
     */
    getPrev(
        signal: A_Signal
    ): A_Signal | undefined
    getPrev(
        signal: A_TYPES__Component_Constructor<A_Signal>
    ): A_Signal | undefined
    getPrev(
        param: A_TYPES__Component_Constructor<A_Signal> | A_Signal
    ): A_Signal | undefined {
        const signal = param instanceof A_Signal ? param.constructor as A_TYPES__Component_Constructor<A_Signal> : param;
        return this._prevState.get(signal);
    }   

    /**
     * Checks if a signal type has been registered in the state
     * 
     * @param signal - The signal constructor to check for
     * @returns True if the signal type exists in the state map
     */
    has(
        signal: A_Signal
    ): boolean
    has(
        signal: A_TYPES__Component_Constructor<A_Signal>
    ): boolean
    has(
        param: A_TYPES__Component_Constructor<A_Signal> | A_Signal
    ): boolean {
        const signal = param instanceof A_Signal ? param.constructor as A_TYPES__Component_Constructor<A_Signal> : param;

        return this.structure.includes(signal);
    }

    /**
     * Removes a signal type and its associated value from the state
     * 
     * @param signal - The signal constructor to remove
     * @returns True if the signal was successfully deleted, false if it didn't exist
     */
    delete(
        signal: A_Signal
    ): boolean
    delete(
        signal: A_TYPES__Component_Constructor<A_Signal>
    ): boolean
    delete(
        param: A_TYPES__Component_Constructor<A_Signal> | A_Signal
    ): boolean {
        const signal = param instanceof A_Signal ? param.constructor as A_TYPES__Component_Constructor<A_Signal> : param;
        return this._state.delete(signal);
    }


    /**
     * Converts the current state to a vector (ordered array) format
     * 
     * The order is determined by the structure array provided during construction.
     * Each position in the vector corresponds to a specific signal type's latest value.
     * 
     * @returns Array of signal values in the order defined by the structure
     * @throws Error if structure is not defined or if any signal value is undefined
     */
    toVector(): A_SignalVector {
        const vector: Array<A_Signal> = [];

        this._state.forEach((value, key) => {
            vector.push(value);
        });

        return new A_SignalVector(vector, this.structure);
    }

    /**
     * Converts the current state to an object with signal constructor names as keys
     * 
     * This provides a more readable representation of the state where each signal
     * type is identified by its constructor name.
     * 
     * @returns Object mapping signal constructor names to their latest values
     * @throws Error if any signal value is undefined
     */
    toObject(): Record<string, A_Signal> {
        const obj: Record<string, A_Signal> = {};

        this.structure.forEach((signalConstructor) => {
            const value = this._state.get(signalConstructor);
            if (value === undefined) {
                throw new Error(`Signal ${signalConstructor.name} has no value in state`);
            }
            obj[signalConstructor.name] = value;
        });

        return obj;
    }

}