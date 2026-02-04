import { A_Entity, A_Scope } from "@adaas/a-concept";
import { A_Signal_Init, A_Signal_Serialized } from "../A-Signal.types";
import { A_Frame } from "@adaas/a-frame";

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
@A_Frame.Entity({
    namespace: 'A-Utils',
    name: 'A-Signal',
    description: 'A Signal Entity represents an individual signal instance that carries data, used for managing state within an application context. Signals are designed to reflect the current state rather than individual events, making them suitable for scenarios where state monitoring and real-time updates are essential.'
})
export class A_Signal<
    _TSignalDataType extends Record<string, any> = Record<string, any>
> extends A_Entity<A_Signal_Init<_TSignalDataType>, A_Signal_Serialized<_TSignalDataType>> {


    // ========================================================================
    // ========================== Static Methods ==============================
    // ========================================================================
    /**
     * Allows to define default data for the signal.
     * 
     * If no data is provided during initialization, the default data will be used.
     * 
     * @returns 
     */
    static async default(): Promise<A_Signal | undefined> {
        return undefined;
    }

    // ========================================================================
    // ========================== Instance Properties ========================
    // ========================================================================

    /**
     * The actual data carried by the signal.
     */
    data!: _TSignalDataType;

    /**
      * Generates signal hash uses for comparison
      * 
      * @param str 
      */
    protected createHash(str?: string): string
    protected createHash(str?: undefined): string
    protected createHash(str?: Record<string, any>): string
    protected createHash(str?: Array<any>): string
    protected createHash(str?: number): string
    protected createHash(str?: boolean): string
    protected createHash(str?: null): string
    protected createHash(map?: Map<any, any>): string
    protected createHash(set?: Set<any>): string
    protected createHash(str?: any): string {
        let hashSource: string;

        if (str instanceof Map) {
            hashSource = JSON.stringify(Array.from(str.entries()));
        } else if (str instanceof Set) {
            hashSource = JSON.stringify(Array.from(str.values()));
        } else {
            switch (typeof str) {
                case 'string':
                    hashSource = str;
                    break;
                case 'undefined':
                    hashSource = 'undefined';
                    break;

                case 'object':
                    if ('toJSON' in str)
                        hashSource = JSON.stringify(str.toJSON());

                    else
                        hashSource = JSON.stringify(str);
                    break;
                case 'number':
                    hashSource = str.toString();
                    break;
                case 'boolean':
                    hashSource = str ? 'true' : 'false';
                    break;
                case 'function':
                    hashSource = str.toString();
                    break;
                default:
                    hashSource = String(str);
            }
        }

        let hash = 0, i, chr;
        for (i = 0; i < hashSource.length; i++) {
            chr = hashSource.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }

        const hashString = hash.toString();

        return hashString;
    }

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
    compare(other: A_Signal<_TSignalDataType>): boolean {
        if (this.aseid.id !== other.aseid.id) {
            return false;
        }

        return true;
    }
    


    fromJSON(serializedEntity: A_Signal_Serialized<_TSignalDataType>): void {
        super.fromJSON(serializedEntity);
        this.data = serializedEntity.data;
    }


    fromNew(newEntity: A_Signal_Init<_TSignalDataType>): void {
        this.data = newEntity.data;

        const identity = newEntity.id || {
            name: newEntity.name,
            data: this.data
        };

        const id = this.createHash(identity);

        this.aseid = this.generateASEID({
            entity: newEntity.name,
            id: id,
        });
    }


    toJSON(): A_Signal_Serialized<_TSignalDataType> {
        return {
            ...super.toJSON(),
            data: this.data
        };
    }

}