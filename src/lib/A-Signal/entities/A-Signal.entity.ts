import { A_Entity, A_Scope } from "@adaas/a-concept";
import { A_Signal_Init, A_Signal_Serialized } from "../A-Signal.types";
import { A_SignalFeatures } from "../A-Signal.constants";
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

    data!: _TSignalDataType;


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



    fromJSON(serializedEntity: A_Signal_Serialized<_TSignalDataType>): void {
        super.fromJSON(serializedEntity);
        this.data = serializedEntity.data;
    }


    fromNew(newEntity: A_Signal_Init<_TSignalDataType>): void {
        this.aseid = this.generateASEID({ entity: newEntity.name });
        this.data = newEntity.data;
    }

    /**
     * Emits this signal within the provided scope.
     * 
     * Scope is mandatory since signal itself should not be registered in the scope, 
     * but should use particular scope context to use proper set of components
     * 
     * @param scope 
     */
    async next(scope: A_Scope) {
        await this.call(A_SignalFeatures.Next, scope);
    }


    toJSON(): A_Signal_Serialized<_TSignalDataType> {
        return {
            ...super.toJSON(),
            data: this.data
        };
    }

}