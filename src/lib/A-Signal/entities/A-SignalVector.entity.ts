import { A_Entity, A_Scope, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor } from "@adaas/a-concept";
import { A_SignalVector_Serialized, A_SignalVector_Init, A_Signal_TSignalsConstructors, A_SignalTValue, A_SignalTValueArray } from "../A-Signal.types";
import { A_Signal } from "./A-Signal.entity";
import { A_Frame } from "@adaas/a-frame";


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
@A_Frame.Entity({
    namespace: 'A-Utils',
    name: 'A-SignalVector',
    description: 'A Signal Vector Entity represents a collection of signals structured in a specific way, allowing for batch processing and transmission of related signals as a unified state representation.'
})
export class A_SignalVector<
    TSignals extends A_Signal[] = A_Signal[],
> extends A_Entity<A_SignalVector_Init<TSignals>> {

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
    protected _signals!: TSignals

    constructor(values: TSignals, structure?: { [K in keyof TSignals]: TSignals[K] extends A_Signal ? A_TYPES__Entity_Constructor<TSignals[K]> : never })
    constructor(serialized: A_SignalVector_Serialized)
    constructor(param1: TSignals | A_SignalVector_Serialized, param2?: A_Signal_TSignalsConstructors<TSignals>) {

        if ('aseid' in param1) {
            // Handle serialized case
            super(param1 as A_SignalVector_Serialized);
        } else {
            // Handle init case  
            super({
                structure: param2 ? param2 : (param1 as TSignals).map(s => s.constructor as A_TYPES__Entity_Constructor<TSignals[number]>) as A_Signal_TSignalsConstructors<TSignals>,
                values: param1 as TSignals
            } as A_SignalVector_Init<TSignals>);
        }
    }


    fromNew(newEntity: A_SignalVector_Init<TSignals>): void {
        super.fromNew(newEntity);
        this._structure = newEntity.structure;
        this._signals = newEntity.values;
    }

    /**
     * The structure of the signal vector, defining the types of signals it contains.
     * 
     * For example:
     * [UserSignInSignal, UserStatusSignal, UserActivitySignal]
     * 
     */
    get structure(): A_Signal_TSignalsConstructors<TSignals> {
        return this._structure || this._signals.map(s => s.constructor as A_TYPES__Entity_Constructor<TSignals[number]>) as A_Signal_TSignalsConstructors<TSignals>;
    }


    get length(): number {
        return this.structure.length;
    }


    /**
     * Enables iteration over the signals in the vector.
     * 
     * @returns 
     */
    [Symbol.iterator](): Iterator<TSignals[number]> {
        let pointer = 0;
        const signals = this.structure.map((signalConstructor) => {
            const signalIndex = this._signals.findIndex(s => s.constructor === signalConstructor);
            return signalIndex !== -1 ? this._signals[signalIndex] : undefined;
        }) as TSignals[number][];

        return {
            next(): IteratorResult<TSignals[number]> {
                if (pointer < signals.length) {
                    return {
                        done: false,
                        value: signals[pointer++]
                    };
                } else {
                    return {
                        done: true,
                        value: undefined as any
                    };
                }
            }
        };
    }


    /**
     * Allows to match the current Signal Vector with another Signal Vector by comparing each signal in the structure.
     * This method returns true if all signals in the vector match the corresponding signals in the other vector.
     * 
     * @param other 
     * @returns 
     */
    match(other: A_SignalVector<TSignals>): boolean {
        if (this.length !== other.length) {
            return false;
        }

        for (let i = 0; i < this.length; i++) {
            const thisSignalConstructor = this.structure[i];
            const otherSignalConstructor = other.structure[i];

            if (thisSignalConstructor !== otherSignalConstructor) {
                return false;
            }

            const thisSignalIndex = this._signals.findIndex(s => s.constructor === thisSignalConstructor);
            const otherSignalIndex = other._signals.findIndex(s => s.constructor === otherSignalConstructor);

            const thisSignal = thisSignalIndex !== -1 ? this._signals[thisSignalIndex] : undefined;
            const otherSignal = otherSignalIndex !== -1 ? other._signals[otherSignalIndex] : undefined;

            if (thisSignal && otherSignal) {
                if (!thisSignal.compare(otherSignal)) {
                    return false;
                }
            } else if (thisSignal || otherSignal) {
                return false;
            }
        }

        return true;
    }

    
    /**
     * This method should ensure that the current Signal Vector contains all signals from the provided Signal Vector.
     * 
     * @param signal 
     */
    contains(signal: A_SignalVector): boolean{
        for (const signalConstructor of signal.structure) {
            const signalIndex = this._signals.findIndex(s => s.constructor === signalConstructor);
            if (signalIndex === -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if the vector contains a signal of the specified type.
     * 
     * @param signal 
     */
    has(signal: A_Signal): boolean
    has(signalConstructor: A_TYPES__Entity_Constructor<A_Signal>): boolean
    has(param1: A_Signal | A_TYPES__Entity_Constructor<A_Signal>): boolean {
        let signalConstructor: A_TYPES__Entity_Constructor<A_Signal>;
        if (param1 instanceof A_Entity) {
            signalConstructor = param1.constructor as A_TYPES__Entity_Constructor<A_Signal>;
        } else {
            signalConstructor = param1;
        }
        return this.structure.includes(signalConstructor as any);
    }

    /**
     * Retrieves the signal of the specified type from the vector.
     * 
     * @param signal 
     */
    get<T extends A_Signal>(signal: T): T | undefined
    get<T extends A_Signal>(signalConstructor: A_TYPES__Entity_Constructor<T>): T | undefined
    get<T extends A_Signal>(param1: T | A_TYPES__Entity_Constructor<T>): T | undefined {
        let signalConstructor: A_TYPES__Entity_Constructor<A_Signal>;

        if (param1 instanceof A_Entity) {
            signalConstructor = param1.constructor as A_TYPES__Entity_Constructor<A_Signal>;
        } else {
            signalConstructor = param1 as A_TYPES__Entity_Constructor<A_Signal>;
        }

        const index = this._signals.findIndex(s => s.constructor === signalConstructor);
        if (index === -1) {
            return undefined;
        }
        return this._signals[index] as T;
    }


    /**
     * Converts to Array of values of signals in the vector
     * Maintains the order specified in the structure/generic type
     * 
     * @param structure - Optional structure to override the default ordering
     * @returns Array of signal instances in the specified order
     */
    async toVector<
        T extends Array<A_Signal> = TSignals,
    >(
        structure?: A_Signal_TSignalsConstructors<T>
    ): Promise<T> {
        const usedStructure = structure || this.structure;

        return usedStructure.map((signalConstructor) => {
            const signalIndex = this._signals.findIndex(s => s.constructor === signalConstructor);
            return signalIndex !== -1 ? this._signals[signalIndex] : undefined;
        }) as T;
    }


    /**
     * Converts to Array of data of signals in the vector
     * Maintains the order specified in the structure/generic type
     * 
     * @param structure - Optional structure to override the default ordering
     * @returns Array of serialized signal data in the specified order
     */
    async toDataVector<
        T extends A_Signal[] = TSignals,
    >(
        structure?: A_Signal_TSignalsConstructors<T>
    ): Promise<A_SignalTValueArray<T>> {

        const usedStructure = structure || this.structure;

        const results: Array<any> = [];

        for (const signalConstructor of usedStructure) {
            const signalIndex = this._signals.findIndex(s => s.constructor === signalConstructor);
            let data: any;
            if (signalIndex === -1) {

                data = await (signalConstructor as typeof A_Signal).default()

            } else {
                const signal = this._signals[signalIndex];
                data = signal;
            }


            results.push(data?.toJSON().data);
        }

        return results as A_SignalTValueArray<T>;
    }

    /**
     * Converts to Object with signal constructor names as keys and their corresponding data values
     * Uses the structure ordering to ensure consistent key ordering
     * 
     * @returns Object with signal constructor names as keys and signal data as values
     */
    async toObject<
        T extends Array<A_Signal> = TSignals,
    >(
        structure?: { [K in keyof T]: T[K] extends A_Signal ? A_TYPES__Entity_Constructor<T[K]> : never }
    ): Promise<{ [key: string]: T[number] extends A_Signal<infer D> ? D | undefined : never }> {

        const usedStructure = structure || this.structure;

        const obj: { [key: string]: T[number] extends A_Signal<infer D> ? D | undefined : never } = {};
        usedStructure.forEach((signalConstructor) => {
            const signalName = signalConstructor.name;
            const signalIndex = this._signals.findIndex(s => s.constructor === signalConstructor);

            if (signalIndex !== -1) {
                const signal = this._signals[signalIndex];
                obj[signalName] = signal.toJSON().data as any;
            } else {
                obj[signalName] = undefined as any;
            }
        });

        return obj;
    }


    /**
     * Serializes the Signal Vector to a JSON-compatible format.
     * 
     * 
     * @returns 
     */
    toJSON(): A_SignalVector_Serialized {
        return {
            ...super.toJSON(),
            structure: this.structure.map(s => s.name),
            values: this._signals.map(s => s.toJSON())
        };
    }
}
