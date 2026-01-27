import { A_Entity, A_Scope, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor } from "@adaas/a-concept";
import { A_SignalVector_Serialized, A_SignalVector_Init } from "../A-Signal.types";
import { A_Signal } from "./A-Signal.entity";
import { A_SignalVectorFeatures } from "../A-Signal.constants";
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
    TSignals extends Array<A_Signal> = Array<A_Signal>,
    TSignalsConstructors extends Array<A_TYPES__Entity_Constructor<A_Signal>> = TSignals extends Array<infer U> ? U extends A_Signal ? A_TYPES__Entity_Constructor<U>[] : never : never
> extends A_Entity<A_SignalVector_Init<TSignals[number][], TSignalsConstructors>, A_SignalVector_Serialized> {

    /**
     * The structure of the signal vector, defining the types of signals it contains.
     * 
     * For example:
     * [UserSignInSignal, UserStatusSignal, UserActivitySignal]
     * 
     * [!] if not provided, it will be derived from the signals values.
     */
    protected _structure?: TSignalsConstructors;
    /**
     * It's actual vector Values of Signals like :
     * [UserActionSignal, UserMousePositionSignal, ExternalDependencySignal]
     */
    protected _signals!: TSignals[number][]


    fromNew(newEntity: A_SignalVector_Init<TSignals[number][], TSignalsConstructors>): void {
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
    get structure(): TSignalsConstructors {
        return this._structure || this._signals.map(s => s.constructor as A_TYPES__Entity_Constructor<A_Signal>) as TSignalsConstructors;
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
     * Emits the signal vector to the specified scope.
     * 
     * @param scope
     */
    async next(scope: A_Scope): Promise<void> {
        return await this.call(A_SignalVectorFeatures.Next, scope);
    }

    
    /**
     * Checks if the vector contains a signal of the specified type.
     * 
     * @param signal 
     */
    has(signal: A_Signal): boolean
    has(signalConstructor: A_TYPES__Component_Constructor<A_Signal>): boolean
    has(param1: A_Signal | A_TYPES__Component_Constructor<A_Signal>): boolean {
        let signalConstructor: A_TYPES__Component_Constructor<A_Signal>;
        if (param1 instanceof A_Entity) {
            signalConstructor = param1.constructor as A_TYPES__Component_Constructor<A_Signal>;
        } else {
            signalConstructor = param1;
        }
        return this.structure.includes(signalConstructor);
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
        structure?: { [K in keyof T]: T[K] extends A_Signal ? A_TYPES__Entity_Constructor<T[K]> : never }
    ): Promise<{ [K in keyof T]: T[K] }> {
        const usedStructure = structure || this.structure;

        return usedStructure.map((signalConstructor) => {
            const signalIndex = this._signals.findIndex(s => s.constructor === signalConstructor);
            return signalIndex !== -1 ? this._signals[signalIndex] : undefined;
        }) as { [K in keyof T]: T[K] };
    }


    /**
     * Converts to Array of data of signals in the vector
     * Maintains the order specified in the structure/generic type
     * 
     * @param structure - Optional structure to override the default ordering
     * @returns Array of serialized signal data in the specified order
     */
    async toDataVector<
        T extends Array<A_Signal> = TSignals,
    >(
        structure?: { [K in keyof T]: T[K] extends A_Signal ? A_TYPES__Entity_Constructor<T[K]> : never }
    ): Promise<{ [K in keyof T]: T[K] extends A_Signal<infer D> ? D | undefined : never }> {

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

        return results as { [K in keyof T]: T[K] extends A_Signal<infer D> ? D | undefined : never };
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
