import { A_Entity, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor } from "@adaas/a-concept";
import { A_SignalVector_Serialized, A_SignalVector_Init } from "../A-Signal.types";
import { A_Signal } from "./A-Signal.entity";


/**
 * A Signal Vector Entity is a collection of signals structured in a specific way.
 * It allows grouping multiple signals together for batch processing or transmission.
 * 
 * Signal Vectors are useful in scenarios where multiple related signals need to be handled together,
 * as a state of the system or a snapshot of various parameters at a given time.
 */
export class A_SignalVector extends A_Entity<A_SignalVector_Init, A_SignalVector_Serialized> {

    /**
     * The structure of the signal vector, defining the types of signals it contains.
     * 
     * For example:
     * [UserSignInSignal, UserStatusSignal, UserActivitySignal]
     */
    structure!: Array<A_TYPES__Entity_Constructor<A_Signal>>;
    /**
     * The values of the signals in the vector.
     * Each entry corresponds to the data of a signal in the structure.
     * 
     * For example:
     * [
     *   { userId: '123', timestamp: '2023-10-01T12:00:00Z' }, // UserSignInSignal data
     *   { userId: '123', status: 'online' },                 // UserStatusSignal data
     *   { userId: '123', activity: 'browsing' }              // UserActivitySignal data
     * ]
     * 
     * 
     * [!] For further processing it's recommended to convert any objects to plain text
     */
    values!: Array<Record<string, any>>;


    fromNew(newEntity: A_SignalVector_Init): void {
        super.fromNew(newEntity);
        this.structure = newEntity.structure;
        this.values = newEntity.values;
    }


    /**
     * Converts to Array of values of signals in the vector
     * 
     * @returns 
     */
    toVector(): Array<Record<string, any>> {
        return this.values;
    }

    /**
     * Converts to Object with signal names as keys and their corresponding values
     * 
     * @returns 
     */
    toObject(): Record<string, any> {
        const obj: Record<string, any> = {};
        this.structure.forEach((signalConstructor, index) => {
            const signalName = signalConstructor.name;
            obj[signalName] = this.values[index];
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
            values: this.values
        };
    }
}