import { A_Component, A_Context, A_Feature, A_FormatterHelper, A_Scope } from "@adaas/a-concept";
import { A_StateMachineError } from "./A-StateMachine.error";
import { A_StateMachineFeatures } from "./A-StateMachine.constants";
import { A_StateMachineTransition } from "./A-StateMachineTransition.context";
import { A_Frame } from "@adaas/a-frame";

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

@A_Frame.Namespace('A-Utils')
@A_Frame.Component({
    name: 'A-StateMachine',
    description: 'A powerful state machine component for managing complex state transitions.'
})
export class A_StateMachine<
    T extends Record<string, any> = Record<string, any>
> extends A_Component {

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
    get ready(): Promise<void> {
        if (!this._initialized) {
            this._initialized = new Promise<void>(
                async (resolve, reject) => {
                    try {
                        await this.call(A_StateMachineFeatures.onInitialize);

                        resolve();
                    } catch (error) {
                        const wrappedError = new A_StateMachineError({
                            title: A_StateMachineError.InitializationError,
                            description: `An error occurred during state machine initialization.`,
                            originalError: error
                        });

                        reject(wrappedError);
                    }
                }
            );
        }

        return this._initialized;
    }



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
    @A_Feature.Extend()
    async [A_StateMachineFeatures.onInitialize](...args: any[]): Promise<void> {
        // Initialization logic can be added here
    }

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
    @A_Feature.Extend()
    async [A_StateMachineFeatures.onBeforeTransition](...args: any[]): Promise<void> {

    }

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
    @A_Feature.Extend()
    async [A_StateMachineFeatures.onAfterTransition](...args: any[]): Promise<void> {

    }

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
    @A_Feature.Extend()
    async [A_StateMachineFeatures.onError](...args: any[]): Promise<void> {
        // Default error handling logic can be added here
    }



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
    @A_Frame.Method({
        name: 'transition',
        description: 'Executes a state transition from one state to another.'
    })
    async transition(
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
        props?: T[keyof T]
    ): Promise<void> {

        await this.ready;

        const transitionName = `${A_FormatterHelper.toCamelCase(String(from))}_${A_FormatterHelper.toCamelCase(String(to))}`;

        const transition = new A_StateMachineTransition({
            from: String(from),
            to: String(to),
            props
        });

        const scope = new A_Scope({
            name: `A-StateMachine-Transition-Scope-${transitionName}`,
            fragments: [transition]
        })
            .inherit(A_Context.scope(this));

        try {

            await this.call(A_StateMachineFeatures.onBeforeTransition, scope);

            await this.call(transitionName, scope);

            await this.call(A_StateMachineFeatures.onAfterTransition, scope);

            scope.destroy();

            return transition.result;

        } catch (error) {
            const wrappedError = new A_StateMachineError({
                title: A_StateMachineError.TransitionError,
                description: `An error occurred while transitioning to "${transitionName}"`,
                originalError: error
            });

            scope.register(wrappedError);

            await this.call(A_StateMachineFeatures.onError, scope);

            scope.destroy();

            throw wrappedError;
        }
    }
}


