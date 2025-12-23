import { A_Entity, A_Scope } from "@adaas/a-concept";
import { A_Signal_Init } from "../A-Signal.types";
import { A_SignalFeatures } from "../A-Signal.constants";

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
export class A_Signal extends A_Entity<A_Signal_Init> {

    data!: Record<string, any>;




    fromNew(newEntity: A_Signal_Init): void {
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
    async emit(scope: A_Scope) {
        await this.call(A_SignalFeatures.Emit, scope);
    }

}