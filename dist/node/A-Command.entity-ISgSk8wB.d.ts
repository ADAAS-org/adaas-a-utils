import { A_Command_Status, A_CommandEvent, A_CommandTransitions, A_CommandFeatures } from './lib/A-Command/A-Command.constants.js';
import { A_TYPES__Error_Serialized, A_TYPES__Entity_Serialized, A_Entity, A_Scope, A_Error } from '@adaas/a-concept';
import { A_StateMachine } from './lib/A-StateMachine/A-StateMachine.component.js';
import { A_StateMachineTransition } from './lib/A-StateMachine/A-StateMachineTransition.context.js';
import { A_ExecutionContext } from './lib/A-Execution/A-Execution.context.js';
import { A_StateMachineFeatures } from './lib/A-StateMachine/A-StateMachine.constants.js';
import { A_Logger } from './lib/A-Logger/A-Logger.component.js';

/**
 * Command Constructor Type
 *
 * Generic constructor type for creating command instances.
 * Used for dependency injection and factory patterns.
 *
 * @template T - The command class type extending A_Command
 */
type A_TYPES__Command_Constructor<T = A_Command> = new (...args: any[]) => T;
/**
 * Command Initialization Parameters
 *
 * Base type for command parameters. Commands should extend this with
 * specific parameter types for their use case.
 *
 * @example
 * ```typescript
 * interface UserCommandParams extends A_TYPES__Command_Init {
 *   userId: string;
 *   action: 'create' | 'update' | 'delete';
 * }
 * ```
 */
type A_TYPES__Command_Init = Record<string, any>;
/**
 * Command Serialized Format
 *
 * Complete serialized representation of a command including all state,
 * timing information, results, and errors. Used for persistence,
 * transmission between services, and state restoration.
 *
 * @template ParamsType - Type of command parameters
 * @template ResultType - Type of command execution result
 *
 * @example
 * ```typescript
 * const serialized: A_TYPES__Command_Serialized<
 *   { userId: string },
 *   { success: boolean }
 * > = command.toJSON();
 * ```
 */
type A_TYPES__Command_Serialized<ParamsType extends Record<string, any> = Record<string, any>, ResultType extends Record<string, any> = Record<string, any>> = {
    /**
     * Unique identifier for the command type (derived from class name)
     */
    code: string;
    /**
     * Current execution status of the command
     */
    status: A_Command_Status;
    /**
     * Parameters used to initialize the command
     */
    params: ParamsType;
    /**
     * ISO timestamp when the command was created
     */
    createdAt: string;
    /**
     * ISO timestamp when command execution started (if started)
     */
    startedAt?: string;
    /**
     * ISO timestamp when command execution ended (if completed/failed)
     */
    endedAt?: string;
    /**
     * Total execution duration in milliseconds (if completed/failed)
     */
    duration?: number;
    /**
     * Time between creation and execution start in milliseconds
     */
    idleTime?: number;
    /**
     * Result data produced by successful command execution
     */
    result?: ResultType;
    /**
     * Array of serialized errors that occurred during execution
     */
    error?: A_TYPES__Error_Serialized;
} & A_TYPES__Entity_Serialized;
/**
 * Command Event Listener Function
 *
 * Type definition for event listener functions that can be registered
 * to respond to command lifecycle events.
 *
 * @template InvokeType - Type of command initialization parameters
 * @template ResultType - Type of command execution result
 * @template LifecycleEvents - Union type of custom lifecycle event names
 *
 * @param command - The command instance that triggered the event
 *
 * @example
 * ```typescript
 * const listener: A_TYPES__Command_Listener<UserParams, UserResult> = (command) => {
 *   console.log(`Command ${command?.code} triggered event`);
 * };
 *
 * command.on('onExecute', listener);
 * ```
 */
type A_TYPES__Command_Listener<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>, LifecycleEvents extends string = keyof typeof A_CommandEvent> = (command?: A_Command<InvokeType, ResultType, LifecycleEvents>) => void;
type A_Command_ExecutionContext<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>> = {
    result: ResultType;
    params: InvokeType;
};

/**
 * A_Command - Advanced Command Pattern Implementation
 *
 * A comprehensive command pattern implementation that encapsulates business logic
 * as executable commands with full lifecycle management, event handling, and
 * state persistence capabilities.
 *
 * ## Key Features
 * - **Structured Lifecycle**: Automatic progression through init → compile → execute → complete/fail
 * - **Event-Driven**: Subscribe to lifecycle events and emit custom events
 * - **State Persistence**: Full serialization/deserialization for cross-service communication
 * - **Type Safety**: Generic types for parameters, results, and custom events
 * - **Dependency Injection**: Integrated with A-Concept's DI system
 * - **Error Management**: Comprehensive error capture and handling
 * - **Execution Tracking**: Built-in timing and performance metrics
 *
 * ## Lifecycle Phases
 * 1. **CREATED** - Command instantiated but not initialized
 * 2. **INITIALIZED** - Execution scope and dependencies set up
 * 3. **COMPILED** - Ready for execution with all resources prepared
 * 4. **EXECUTING** - Currently running business logic
 * 5. **COMPLETED** - Successfully finished execution
 * 6. **FAILED** - Execution failed with errors captured
 *
 * @template InvokeType - Type definition for command parameters
 * @template ResultType - Type definition for command execution result
 * @template LifecycleEvents - Union type of custom lifecycle event names
 *
 * @example
 * ```typescript
 * // Define parameter and result types
 * interface UserCreateParams {
 *   name: string;
 *   email: string;
 *   role: 'admin' | 'user';
 * }
 *
 * interface UserCreateResult {
 *   userId: string;
 *   success: boolean;
 * }
 *
 * // Create custom command
 * class CreateUserCommand extends A_Command<UserCreateParams, UserCreateResult> {}
 *
 * // Execute command
 * const command = new CreateUserCommand({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   role: 'user'
 * });
 *
 * scope.register(command);
 * await command.execute();
 *
 * console.log('Result:', command.result);
 * console.log('Status:', command.status);
 * ```
 */
declare class A_Command<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>, LifecycleEvents extends string | keyof typeof A_CommandEvent = keyof typeof A_CommandEvent> extends A_Entity<InvokeType, A_TYPES__Command_Serialized<InvokeType, ResultType>> {
    /**
     * Static command identifier derived from the class name
     * Used for command registration and serialization
     */
    static get code(): string;
    /** The origin of the command, used to know has it been created from serialization or invoked */
    protected _origin: 'invoked' | 'serialized';
    /** Command execution scope for dependency injection and feature resolution */
    protected _executionScope: A_Scope;
    /** Result data produced by successful command execution */
    protected _result?: ResultType;
    /** Set of errors that occurred during command execution */
    protected _error: A_Error;
    /** Command initialization parameters */
    protected _params: InvokeType;
    /** Current lifecycle status of the command */
    protected _status: A_Command_Status;
    /** Map of event listeners organized by event name */
    protected _listeners: Map<LifecycleEvents | keyof typeof A_CommandEvent, Set<A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>>>;
    /** Timestamp when command execution started */
    protected _startTime?: Date;
    /** Timestamp when command execution ended */
    protected _endTime?: Date;
    /** Timestamp when command was created */
    protected _createdAt: Date;
    /**
     * Total execution duration in milliseconds
     *
     * - If completed/failed: Returns total time from start to end
     * - If currently executing: Returns elapsed time since start
     * - If not started: Returns undefined
     */
    get duration(): number | undefined;
    /**
     * Idle time before execution started in milliseconds
     *
     * Time between command creation and execution start.
     * Useful for monitoring command queue performance.
     */
    get idleTime(): number | undefined;
    /**
     * Command execution scope for dependency injection
     *
     * Provides access to components, services, and shared resources
     * during command execution. Inherits from the scope where the
     * command was registered.
     */
    get scope(): A_Scope;
    /**
     * Execution context associated with the command
     */
    get context(): A_ExecutionContext<A_Command_ExecutionContext<InvokeType, ResultType>>;
    /**
     * Unique command type identifier
     *
     * Derived from the class name and used for:
     * - Command registration and resolution
     * - Serialization and deserialization
     * - Logging and debugging
     *
     * @example 'create-user-command', 'process-order-command'
     */
    get code(): string;
    /**
     * Current lifecycle status of the command
     *
     * Indicates the current phase in the command execution lifecycle.
     * Used to track progress and determine available operations.
     */
    get status(): A_Command_Status;
    /**
     * Timestamp when the command was created
     *
     * Marks the initial instantiation time, useful for tracking
     * command age and queue performance metrics.
     */
    get createdAt(): Date;
    /**
     * Timestamp when command execution started
     *
     * Undefined until execution begins. Used for calculating
     * execution duration and idle time.
     */
    get startedAt(): Date | undefined;
    /**
     * Timestamp when command execution ended
     *
     * Set when command reaches COMPLETED or FAILED status.
     * Used for calculating total execution duration.
     */
    get endedAt(): Date | undefined;
    /**
     * Result data produced by command execution
     *
     * Contains the output data from successful command execution.
     * Undefined until command completes successfully.
     */
    get result(): ResultType | undefined;
    /**
     * Array of errors that occurred during execution
     *
     * Automatically wraps native errors in A_Error instances
     * for consistent error handling. Empty array if no errors occurred.
     */
    get error(): A_Error | undefined;
    /**
     * Command initialization parameters
     *
     * Contains the input data used to create and configure the command.
     * These parameters are immutable during command execution.
                    return new A_Error(err);
                }
            });
    }

    /**
     * Command initialization parameters
     *
     * Contains the input data used to create and configure the command.
     * These parameters are immutable during command execution.
     */
    get params(): InvokeType;
    /**
     * Indicates if the command has been processed (completed or failed)
     *
     * Returns true if the command has completed or failed, false otherwise.
     */
    get isProcessed(): boolean;
    /**
     *
     * A-Command represents an executable command with a specific code and parameters.
     * It can be executed within a given scope and stores execution results and errors.
     *
     *
     * A-Command should be context independent and execution logic should be based on attached components
     *
     * @param code
     * @param params
     */
    constructor(
    /**
     * Command invocation parameters
     */
    params: InvokeType | A_TYPES__Command_Serialized<InvokeType, ResultType> | string);
    protected [A_StateMachineFeatures.onBeforeTransition](transition: A_StateMachineTransition, logger?: A_Logger, ...args: any[]): Promise<void>;
    protected [A_CommandTransitions.CREATED_TO_INITIALIZED](transition: A_StateMachineTransition, ...args: any[]): Promise<void>;
    protected [A_CommandTransitions.INITIALIZED_TO_EXECUTING](transition: A_StateMachineTransition, ...args: any[]): Promise<void>;
    protected [A_CommandTransitions.EXECUTING_TO_COMPLETED](transition: A_StateMachineTransition, ...args: any[]): Promise<void>;
    protected [A_CommandTransitions.EXECUTING_TO_FAILED](transition: A_StateMachineTransition, error: A_Error, ...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onInit](stateMachine: A_StateMachine, ...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onBeforeExecute](stateMachine: A_StateMachine, ...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onExecute](...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onAfterExecute](...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onComplete](stateMachine: A_StateMachine, ...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onFail](stateMachine: A_StateMachine, operation: A_ExecutionContext<A_Command_ExecutionContext<InvokeType, ResultType>>, ...args: any[]): Promise<void>;
    /**
     * Initializes the command before execution.
     */
    init(): Promise<void>;
    /**
     * Executes the command logic.
     */
    execute(): Promise<any>;
    /**
     * Marks the command as completed
     *
     *
     * Calling This method will set the command status to COMPLETED, record the end time,
     * store the result, emit the onComplete event, and destroy the execution scope.
     *
     * [!] After Calling this method, the command is considered fully processed And further processing will be INTERRUPTED.
     * [!] If the command is already processed (COMPLETED or FAILED), this method does nothing.
     * [!] This method can be called with optional result data to store with the command.
     *
     * @param result - Optional result data to store with the command
     */
    complete(result?: ResultType): Promise<void>;
    /**
     * Marks the command as failed
     */
    fail(error?: A_Error): Promise<void>;
    /**
     * Registers an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    on(event: LifecycleEvents | A_CommandEvent, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>): void;
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event: LifecycleEvents | A_CommandEvent, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>): void;
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event: LifecycleEvents | keyof typeof A_CommandEvent): void;
    /**
     * Allows to create a Command instance from new data
     *
     * @param newEntity
     */
    fromNew(newEntity: InvokeType): void;
    /**
     * Allows to convert serialized data to Command instance
     *
     * [!] By default it omits params as they are not stored in the serialized data
     *
     * @param serialized
     */
    fromJSON(serialized: A_TYPES__Command_Serialized<InvokeType, ResultType>): void;
    /**
     * Converts the Command instance to a plain object
     *
     * @returns
     */
    toJSON(): A_TYPES__Command_Serialized<InvokeType, ResultType>;
    /**
     * Ensures that the command's execution scope inherits from the context scope
     *
     * Throws an error if the command is not bound to any context scope
     */
    protected checkScopeInheritance(): void;
}

export { A_Command as A, type A_Command_ExecutionContext as a, type A_TYPES__Command_Constructor as b, type A_TYPES__Command_Init as c, type A_TYPES__Command_Listener as d, type A_TYPES__Command_Serialized as e };
