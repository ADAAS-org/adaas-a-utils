import {
    A_TYPES__Command_Init,
    A_TYPES__Command_Listener,
    A_TYPES__Command_Serialized
} from "./A-Command.types";
import {
    A_CommandFeatures,
    A_Command_Event,
    A_Command_Status,
    A_CommandTransitions
} from "./A-Command.constants";
import { A_Caller, A_Context, A_Dependency, A_Entity, A_Error, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_CommandError } from "./A-Command.error";
import { A_OperationContext } from "../A-Operation/A-Operation.context";
import { A_StateMachine } from "../A-StateMachine/A-StateMachine.component";
import { A_StateMachineFeatures } from "../A-StateMachine/A-StateMachine.constants";
import { A_Logger } from "../A-Logger/A-Logger.component";
import { A_StateMachineTransition } from "../A-StateMachine/A-StateMachineTransition.context";

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
export class A_Command<
    InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init,
    ResultType extends Record<string, any> = Record<string, any>,
    LifecycleEvents extends string | A_Command_Event = A_Command_Event,
> extends A_Entity<InvokeType, A_TYPES__Command_Serialized<InvokeType, ResultType>> {

    // ====================================================================
    // ================== Static Command Information ======================
    // ====================================================================

    /**
     * Static command identifier derived from the class name
     * Used for command registration and serialization
     */
    static get code(): string {
        return super.entity;
    }

    // ====================================================================
    // ================== Instance Properties =============================
    // ====================================================================

    /** The origin of the command, used to know has it been created from serialization or invoked */
    protected _origin!: 'invoked' | 'serialized';

    /** Command execution scope for dependency injection and feature resolution */
    protected _executionScope!: A_Scope;

    /** Result data produced by successful command execution */
    protected _result?: ResultType;

    /** Set of errors that occurred during command execution */
    protected _error!: A_Error;

    /** Command initialization parameters */
    protected _params!: InvokeType;

    /** Current lifecycle status of the command */
    protected _status!: A_Command_Status

    /** Map of event listeners organized by event name */
    protected _listeners: Map<
        LifecycleEvents | A_Command_Event,
        Set<A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>>
    > = new Map();

    /** Timestamp when command execution started */
    protected _startTime?: Date;

    /** Timestamp when command execution ended */
    protected _endTime?: Date;

    /** Timestamp when command was created */
    protected _createdAt!: Date;


    // ====================================================================
    // ================== Public Getter Properties =======================
    // ====================================================================

    /**
     * Total execution duration in milliseconds
     * 
     * - If completed/failed: Returns total time from start to end
     * - If currently executing: Returns elapsed time since start
     * - If not started: Returns undefined
     */
    get duration(): number | undefined {
        return this._endTime && this._startTime
            ? this._endTime.getTime() - this._startTime.getTime()
            : this._startTime
                ? new Date().getTime() - this._startTime.getTime()
                : undefined;
    }

    /**
     * Idle time before execution started in milliseconds
     * 
     * Time between command creation and execution start.
     * Useful for monitoring command queue performance.
     */
    get idleTime(): number | undefined {
        return this._startTime && this._createdAt
            ? this._startTime.getTime() - this._createdAt.getTime()
            : undefined;
    }

    /**
     * Command execution scope for dependency injection
     * 
     * Provides access to components, services, and shared resources
     * during command execution. Inherits from the scope where the
     * command was registered.
     */
    get scope(): A_Scope {
        return this._executionScope;
    }

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
    get code(): string {
        return (this.constructor as typeof A_Command).code;
    }
    /**
     * Current lifecycle status of the command
     * 
     * Indicates the current phase in the command execution lifecycle.
     * Used to track progress and determine available operations.
     */
    get status(): A_Command_Status {
        return this._status;
    }

    /**
     * Timestamp when the command was created
     * 
     * Marks the initial instantiation time, useful for tracking
     * command age and queue performance metrics.
     */
    get createdAt(): Date {
        return this._createdAt!;
    }

    /**
     * Timestamp when command execution started
     * 
     * Undefined until execution begins. Used for calculating
     * execution duration and idle time.
     */
    get startedAt(): Date | undefined {
        return this._startTime;
    }

    /**
     * Timestamp when command execution ended
     * 
     * Set when command reaches COMPLETED or FAILED status.
     * Used for calculating total execution duration.
     */
    get endedAt(): Date | undefined {
        return this._endTime;
    }

    /**
     * Result data produced by command execution
     * 
     * Contains the output data from successful command execution.
     * Undefined until command completes successfully.
     */
    get result(): ResultType | undefined {
        return this._result;
    }

    /**
     * Array of errors that occurred during execution
     * 
     * Automatically wraps native errors in A_Error instances
     * for consistent error handling. Empty array if no errors occurred.
     */
    get error(): A_Error | undefined {
        return this._error;
    }

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
    get params(): InvokeType {
        return this._params;
    }

    /**
     * Indicates if the command has been processed (completed or failed)
     * 
     * Returns true if the command has completed or failed, false otherwise.
     */
    get isProcessed(): boolean {
        return this._status === A_Command_Status.COMPLETED
            || this._status === A_Command_Status.FAILED;
    }

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
        params: InvokeType | A_TYPES__Command_Serialized<InvokeType, ResultType> | string,
    ) {
        super(params as any);
    }

    // --------------------------------------------------------------------------
    // A-StateMachine Feature Extensions
    // --------------------------------------------------------------------------
    @A_Feature.Extend()
    protected async [A_StateMachineFeatures.onBeforeTransition](
        @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
        @A_Inject(A_Logger) logger?: A_Logger,
        ...args: any[]
    ) {
        this.checkScopeInheritance();

        //  and register all allowed status transitions
        //  switch across allowed transitions, if not allowed throw an error
        logger?.debug('yellow', `Command ${this.aseid.toString()} transitioning from ${transition.from} to ${transition.to}`);
    }

    @A_Feature.Extend()
    protected async [A_CommandTransitions.CREATED_TO_INITIALIZED](
        @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
        ...args: any[]
    ): Promise<void> {
        if (this._status !== A_Command_Status.CREATED) {
            return;
        }

        this._createdAt = new Date();
        this._status = A_Command_Status.INITIALIZED;

        this.emit(A_CommandFeatures.onInit);
    }

    @A_Feature.Extend()
    protected async [A_CommandTransitions.INITIALIZED_TO_EXECUTING](
        @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
        ...args: any[]
    ): Promise<void> {
        if (this._status !== A_Command_Status.INITIALIZED
            && this._status !== A_Command_Status.CREATED
        ) {
            return;
        }

        this._startTime = new Date();
        this._status = A_Command_Status.EXECUTING;

        this.emit(A_CommandFeatures.onExecute);
    }

    @A_Feature.Extend()
    /**
     * Handles command completion after successful execution
     * 
     * EXECUTION -> COMPLETED transition
     */
    protected async [A_CommandTransitions.EXECUTING_TO_COMPLETED](
        @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
        ...args: any[]
    ): Promise<void> {
        this._endTime = new Date();
        this._status = A_Command_Status.COMPLETED;

        this.emit(A_CommandFeatures.onComplete);
    }

    @A_Feature.Extend()
    /**
     * Handles command failure during execution
     * 
     * EXECUTION -> FAILED transition
     */
    protected async [A_CommandTransitions.EXECUTING_TO_FAILED](
        @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
        @A_Inject(A_Error) error: A_Error,
        ...args: any[]
    ): Promise<void> {
        this._endTime = new Date();

        this._status = A_Command_Status.FAILED;

        this.emit(A_CommandFeatures.onFail);
    }


    // --------------------------------------------------------------------------
    // A-Command Lifecycle Feature Extensions
    // --------------------------------------------------------------------------
    @A_Feature.Extend()
    /**
     * Default behavior for Command Initialization uses StateMachine to transition states
     */
    protected async [A_CommandFeatures.onInit](
        @A_Inject(A_StateMachine) stateMachine: A_StateMachine,
        ...args: any[]
    ): Promise<void> {
        await stateMachine.transition(A_Command_Status.CREATED, A_Command_Status.INITIALIZED);
    }

    @A_Feature.Extend({
        after: /.*/
    })
    protected async [A_CommandFeatures.onBeforeExecute](
        @A_Dependency.Required()
        @A_Inject(A_StateMachine) stateMachine: A_StateMachine,
        ...args: any[]
    ): Promise<void> {
        await stateMachine.transition(A_Command_Status.INITIALIZED, A_Command_Status.EXECUTING);
    }

    @A_Feature.Extend()
    protected async [A_CommandFeatures.onExecute](
        ...args: any[]
    ): Promise<void> {
    }

    @A_Feature.Extend()
    /**
     * By Default on AfterExecute calls the Completion method to mark the command as completed
     * 
     * [!] This can be overridden to implement custom behavior using A_Feature overrides
     */
    protected async [A_CommandFeatures.onAfterExecute](
        ...args: any[]
    ): Promise<void> {
    }

    @A_Feature.Extend({
        after: /.*/
    })
    protected async [A_CommandFeatures.onComplete](
        @A_Inject(A_StateMachine) stateMachine: A_StateMachine,
        ...args: any[]
    ): Promise<void> {
        await stateMachine.transition(A_Command_Status.EXECUTING, A_Command_Status.COMPLETED);
    }

    @A_Feature.Extend({
        after: /.*/
    })
    protected async [A_CommandFeatures.onFail](
        @A_Dependency.Required()
        @A_Inject(A_StateMachine) stateMachine: A_StateMachine,
        @A_Inject(A_OperationContext) operation: A_OperationContext,
        ...args: any[]
    ): Promise<void> {
        await stateMachine.transition(A_Command_Status.EXECUTING, A_Command_Status.FAILED);
    }

    // --------------------------------------------------------------------------
    // A-Command Lifecycle Methods
    // --------------------------------------------------------------------------
    /**
     * Initializes the command before execution.
     */
    async init(): Promise<void> {
        await this.call(A_CommandFeatures.onInit, this.scope);
    }

    /**
     * Executes the command logic.
     */
    async execute(): Promise<any> {

        if (this.isProcessed) return;

        try {
            this.checkScopeInheritance();

            const context = new A_OperationContext('execute-command');

            this.scope.register(context);

            await new Promise<void>(async (resolve, reject) => {

                try {


                    const onBeforeExecuteFeature = new A_Feature({
                        name: A_CommandFeatures.onBeforeExecute,
                        component: this,
                        scope: this.scope
                    })

                    const onExecuteFeature = new A_Feature({
                        name: A_CommandFeatures.onExecute,
                        component: this,
                        scope: this.scope
                    })

                    const onAfterExecuteFeature = new A_Feature({
                        name: A_CommandFeatures.onAfterExecute,
                        component: this,
                        scope: this.scope
                    })



                    this.on(A_CommandFeatures.onComplete, () => {

                        onBeforeExecuteFeature.interrupt();
                        onExecuteFeature.interrupt();
                        onAfterExecuteFeature.interrupt();

                        resolve();
                    });


                    await onBeforeExecuteFeature.process(this.scope);

                    await onExecuteFeature.process(this.scope);

                    await onAfterExecuteFeature.process(this.scope);

                    /** only in case it was really invoked we automatically transit it to COMPLETED state */
                    if (this._origin === 'invoked') {
                        await this.complete();
                    }

                    resolve();

                } catch (error) {
                    reject(error);
                }
            });

        } catch (error) {
            let targetError = error instanceof A_Error
                ? error
                : new A_CommandError({
                    title: A_CommandError.ExecutionError,
                    description: `An error occurred while executing command "${this.aseid.toString()}".`,
                    originalError: error
                });

            await this.fail(targetError);
        }
    }

    /**
     * Marks the command as completed
     */
    async complete(result?: ResultType) {
        if (this.isProcessed) return;

        this._status = A_Command_Status.COMPLETED;

        this._result = result;

        await this.call(A_CommandFeatures.onComplete, this.scope);

        this.scope.destroy();
    }



    /**
     * Marks the command as failed
     */
    async fail(error?: A_Error) {
        if (this.isProcessed) return;

        this._status = A_Command_Status.FAILED;
        if (error) {
            this._error = error;
            this.scope.register(error);
        }

        await this.call(A_CommandFeatures.onFail, this.scope);

        this.scope.destroy();
    }


    // --------------------------------------------------------------------------   
    // A-Command Event-Emitter methods
    // --------------------------------------------------------------------------

    /**
     * Registers an event listener for a specific event
     * 
     * @param event 
     * @param listener 
     */
    on(event: LifecycleEvents | A_Command_Event, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event)!.add(listener);
    }
    /**
     * Removes an event listener for a specific event
     * 
     * @param event 
     * @param listener 
     */
    off(event: LifecycleEvents | A_Command_Event, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>) {
        this._listeners.get(event)?.delete(listener);
    }
    /**
     * Emits an event to all registered listeners
     * 
     * @param event 
     */
    emit(event: LifecycleEvents | A_Command_Event) {
        this._listeners.get(event)?.forEach(async listener => {
            listener(this);
        });
    }


    // --------------------------------------------------------------------------
    // A-Entity Base Class Overrides
    // --------------------------------------------------------------------------
    // Serialization / Deserialization
    // -------------------------------------------------------------------------


    /**
     * Allows to create a Command instance from new data
     * 
     * @param newEntity 
     */
    fromNew(newEntity: InvokeType): void {
        super.fromNew(newEntity);

        this._origin = 'invoked';

        this._executionScope = new A_Scope({
            name: `A-Command-Execution-Scope-${this.aseid.toString()}`,
            components: [A_StateMachine],
        });

        this._createdAt = new Date();

        this._params = newEntity;

        this._status = A_Command_Status.CREATED;
    }



    /**
     * Allows to convert serialized data to Command instance
     * 
     * [!] By default it omits params as they are not stored in the serialized data
     * 
     * @param serialized 
     */
    fromJSON(serialized: A_TYPES__Command_Serialized<InvokeType, ResultType>): void {
        super.fromJSON(serialized);

        this._origin = 'serialized';

        this._executionScope = new A_Scope({
            name: `A-Command-Execution-Scope-${this.aseid.toString()}`,
            components: [A_StateMachine],
        });

        if (serialized.createdAt) this._createdAt = new Date(serialized.createdAt);
        if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
        if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);

        this._params = serialized.params
        this._status = serialized.status;

        if (serialized.error)
            this._error = new A_CommandError(serialized.error)

        if (serialized.result)
            this._result = serialized.result;
    }


    /**
     * Converts the Command instance to a plain object
     * 
     * @returns 
     */
    toJSON(): A_TYPES__Command_Serialized<InvokeType, ResultType> {
        return {
            ...super.toJSON(),
            code: this.code,
            status: this._status,
            params: this._params,
            createdAt: this._createdAt.toISOString(),
            startedAt: this._startTime ? this._startTime.toISOString() : undefined,
            endedAt: this._endTime ? this._endTime.toISOString() : undefined,
            duration: this.duration,
            idleTime: this.idleTime,
            result: this.result,
            error: this.error ? this.error.toJSON() : undefined,
        }
    };


    //============================================================================================
    //                                Helpers Methods
    //============================================================================================
    /**
     * Ensures that the command's execution scope inherits from the context scope
     * 
     * Throws an error if the command is not bound to any context scope
     */
    protected checkScopeInheritance(): void {
        let attachedScope: A_Scope;

        try {
            attachedScope = A_Context.scope(this);
        } catch (error) {
            throw new A_CommandError({
                title: A_CommandError.CommandScopeBindingError,
                description: `Command ${this.aseid.toString()} is not bound to any context scope. Ensure the command is properly registered within a context before execution.`,
                originalError: error
            });
        }

        if (!this.scope.isInheritedFrom(A_Context.scope(this))) {
            this.scope.inherit(A_Context.scope(this));
        }
    }
}

