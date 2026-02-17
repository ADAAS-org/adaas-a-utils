import { A_Component } from '@adaas/a-concept';
import { A_Operation_Storage, A_OperationContext } from './a-operation.mjs';

declare enum A_StateMachineFeatures {
    /**
     * Allows to extend error handling logic and behavior
     */
    onError = "_A_StateMachine_onError",
    /**
     * Allows to extend initialization logic and behavior
     */
    onInitialize = "_A_StateMachine_onInitialize",
    /**
     * Allows to extend transition validation logic and behavior
     */
    onBeforeTransition = "_A_StateMachine_onBeforeTransition",
    /**
     * Allows to extend post-transition logic and behavior
     */
    onAfterTransition = "_A_StateMachine_onAfterTransition"
}

/**
 * A_StateMachine is a powerful state machine implementation that allows you to define and manage
 * complex state transitions with validation, hooks, and error handling.
 *
 * @template T - A record type defining the state transitions and their associated data types.
 *               Each key represents a state name, and the value represents the data type for that state.
 *
 * @example
 * ```typescript
 * interface OrderStates {
 *   pending: { orderId: string };
 *   processing: { orderId: string; processedBy: string };
 *   completed: { orderId: string; completedAt: Date };
 *   cancelled: { orderId: string; reason: string };
 * }
 *
 * class OrderStateMachine extends A_StateMachine<OrderStates> {
 *   // Define custom transition logic
 *   async pending_processing(scope: A_Scope) {
 *     const operation = scope.resolve(A_StateMachineTransition)!;
 *     const { orderId } = operation.props;
 *     // Custom validation and business logic
 *   }
 * }
 * ```
 */
declare class A_StateMachine<T extends Record<string, any> = Record<string, any>> extends A_Component {
    /**
     * Internal promise that tracks the initialization state of the state machine.
     * Used to ensure the state machine is properly initialized before allowing transitions.
     */
    protected _initialized?: Promise<void>;
    /**
     * Gets a promise that resolves when the state machine is fully initialized and ready for transitions.
     * This ensures that all initialization hooks have been executed before allowing state transitions.
     *
     * @returns Promise<void> that resolves when initialization is complete
     *
     * @example
     * ```typescript
     * const stateMachine = new MyStateMachine();
     * await stateMachine.ready; // Wait for initialization
     * await stateMachine.transition('idle', 'running');
     * ```
     */
    get ready(): Promise<void>;
    /**
     * Initialization hook that runs when the state machine is first created.
     * This method can be extended to add custom initialization logic.
     *
     * @param args - Variable arguments passed during initialization
     * @returns Promise<void>
     *
     * @example
     * ```typescript
     * class MyStateMachine extends A_StateMachine {
     *   @A_Feature.Extend()
     *   async [A_StateMachineFeatures.onInitialize]() {
     *     // Custom initialization logic
     *     console.log('State machine initialized');
     *   }
     * }
     * ```
     */
    [A_StateMachineFeatures.onInitialize](...args: any[]): Promise<void>;
    /**
     * Hook that runs before any state transition occurs.
     * Use this to add validation, logging, or preparation logic that should run for all transitions.
     *
     * @param args - Variable arguments, typically includes the transition scope
     * @returns Promise<void>
     *
     * @example
     * ```typescript
     * class MyStateMachine extends A_StateMachine {
     *   @A_Feature.Extend()
     *   async [A_StateMachineFeatures.onBeforeTransition](scope: A_Scope) {
     *     const operation = scope.resolve(A_StateMachineTransition)!;
     *     console.log(`Transitioning from ${operation.props.from} to ${operation.props.to}`);
     *   }
     * }
     * ```
     */
    [A_StateMachineFeatures.onBeforeTransition](...args: any[]): Promise<void>;
    /**
     * Hook that runs after a successful state transition.
     * Use this to add cleanup, logging, or post-transition logic that should run for all transitions.
     *
     * @param args - Variable arguments, typically includes the transition scope
     * @returns Promise<void>
     *
     * @example
     * ```typescript
     * class MyStateMachine extends A_StateMachine {
     *   @A_Feature.Extend()
     *   async [A_StateMachineFeatures.onAfterTransition](scope: A_Scope) {
     *     const operation = scope.resolve(A_StateMachineTransition)!;
     *     console.log(`Successfully transitioned to ${operation.props.to}`);
     *   }
     * }
     * ```
     */
    [A_StateMachineFeatures.onAfterTransition](...args: any[]): Promise<void>;
    /**
     * Error handling hook that runs when a transition fails.
     * Use this to add custom error handling, logging, or recovery logic.
     *
     * @param args - Variable arguments, typically includes the error scope
     * @returns Promise<void>
     *
     * @example
     * ```typescript
     * class MyStateMachine extends A_StateMachine {
     *   @A_Feature.Extend()
     *   async [A_StateMachineFeatures.onError](scope: A_Scope) {
     *     const error = scope.resolve(A_StateMachineError);
     *     console.error('Transition failed:', error?.message);
     *   }
     * }
     * ```
     */
    [A_StateMachineFeatures.onError](...args: any[]): Promise<void>;
    /**
     * Executes a state transition from one state to another.
     * This is the core method of the state machine that handles the complete transition lifecycle.
     *
     * @param from - The state to transition from (must be a key of T)
     * @param to - The state to transition to (must be a key of T)
     * @param props - Optional properties to pass to the transition context (should match T[keyof T])
     * @returns Promise<void> that resolves when the transition is complete
     *
     * @throws {A_StateMachineError} When the transition fails for any reason
     *
     * @example
     * ```typescript
     * interface OrderStates {
     *   pending: { orderId: string };
     *   processing: { orderId: string; processedBy: string };
     * }
     *
     * const orderMachine = new A_StateMachine<OrderStates>();
     *
     * // Transition with props
     * await orderMachine.transition('pending', 'processing', {
     *   orderId: '12345',
     *   processedBy: 'user-456'
     * });
     * ```
     *
     * The transition process follows this lifecycle:
     * 1. Wait for state machine initialization (ready)
     * 2. Create transition name in camelCase format (e.g., "pending_processing")
     * 3. Create operation context with transition data
     * 4. Create isolated scope for the transition
     * 5. Call onBeforeTransition hook
     * 6. Execute the specific transition method (if defined)
     * 7. Call onAfterTransition hook
     * 8. Clean up scope and return result
     *
     * If any step fails, the onError hook is called and a wrapped error is thrown.
     */
    transition(
    /**
     * The state to transition from
     */
    from: keyof T, 
    /**
     * The state to transition to
     */
    to: keyof T, 
    /**
     * Optional properties to pass to the transition context
     */
    props?: T[keyof T]): Promise<void>;
}

type A_StateMachineTransitionParams<T = any> = {
    from: string;
    to: string;
    props?: T;
};
type A_StateMachineTransitionStorage<_ResultType extends any = any, _ParamsType extends any = any> = {
    from: string;
    to: string;
} & A_Operation_Storage<_ResultType, A_StateMachineTransitionParams<_ParamsType>>;

declare class A_StateMachineTransition<_ParamsType = any, _ResultType = any> extends A_OperationContext<'a-state-machine-transition', A_StateMachineTransitionParams<_ParamsType>, _ResultType, A_StateMachineTransitionStorage<_ResultType, _ParamsType>> {
    constructor(params: A_StateMachineTransitionParams<_ParamsType>);
    /**
     * The state to transition from
     */
    get from(): string;
    /**
     * The state to transition to
     */
    get to(): string;
}

export { A_StateMachine as A, A_StateMachineFeatures as a, A_StateMachineTransition as b, type A_StateMachineTransitionParams as c, type A_StateMachineTransitionStorage as d };
