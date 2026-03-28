import { A_Entity } from "@adaas/a-concept";
import { A_Signal_Init, A_Signal_Serialized } from "../A-Signal.types";
import { A_Frame } from "@adaas/a-frame";
import { A_UtilsHelper } from "@adaas/a-utils/helpers";

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
    _TSignalDataType extends any = any,
    _TSignalSerializedDataType extends any = _TSignalDataType,
> extends A_Entity<A_Signal_Init<_TSignalDataType>, A_Signal_Serialized<_TSignalSerializedDataType>> {


    // ========================================================================
    // ========================== Static Methods ==============================
    // ========================================================================

    // ========================================================================
    // ========================== Instance Properties ========================
    // ========================================================================

    /**
     * The actual data carried by the signal.
     */
    data!: _TSignalDataType;

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

    /**
     * Allows to define default data for the signal.
     * 
     * If no data is provided during initialization, the default data will be used.
     * 
     * @returns 
     */
    fromUndefined(): void {
        const name = (this.constructor as typeof A_Entity).entity;

        this.data = undefined as unknown as _TSignalDataType;

        const identity = {
            name: name,
            data: this.data
        };

        const id = A_UtilsHelper.hash(identity);

        this.aseid = this.generateASEID({
            entity: name,
            id: id,
        });
    }

    /**
     * Allows to initialize the signal from a new signal entity. This is useful for example when we want to create a new instance of the signal entity with the same data as another instance, but with a different ASEID.
     * 
     * @param newEntity 
     */
    fromNew(newEntity: A_Signal_Init<_TSignalDataType>): void {
        this.data = newEntity.data;

        const identity = newEntity.id || {
            name: newEntity.name,
            data: this.data
        };

        const id = A_UtilsHelper.hash(identity);

        this.aseid = this.generateASEID({
            entity: newEntity.name,
            id: id,
        });
    }

    /**
     * Allows to initialize the signal from a serialized version of the signal. This is useful for example when we receive a signal from the server and we want to create an instance of the signal entity from the received data.
     * 
     * @param serializedEntity 
     */
    fromJSON(serializedEntity: A_Signal_Serialized<_TSignalSerializedDataType>): void {
        super.fromJSON(serializedEntity);
        this.data = serializedEntity.data as unknown as _TSignalDataType;
    }

    toJSON(): A_Signal_Serialized<_TSignalSerializedDataType> {
        return {
            ...super.toJSON(),
            data: this.data as unknown as _TSignalSerializedDataType
        };
    }

}