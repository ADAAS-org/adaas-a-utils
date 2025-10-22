import { A_TYPES__Command_Init, A_TYPES__Command_Listener, A_TYPES__Command_Serialized } from "./A-Command.types";
import { A_CONSTANTS__A_Command_Event, A_CONSTANTS__A_Command_Status } from "./A-Command.constants";
import { A_Entity, A_Error, A_Scope } from "@adaas/a-concept";
export declare class A_Command<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>, LifecycleEvents extends string = A_CONSTANTS__A_Command_Event> extends A_Entity<InvokeType, A_TYPES__Command_Serialized<ResultType>> {
    /**
     * Command Identifier that corresponds to the class name
     */
    static get code(): string;
    protected _result?: ResultType;
    protected _executionScope: A_Scope;
    protected _errors?: Set<A_Error>;
    protected _params: InvokeType;
    protected _status: A_CONSTANTS__A_Command_Status;
    protected _listeners: Map<LifecycleEvents | A_CONSTANTS__A_Command_Event, Set<A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>>>;
    protected _startTime?: Date;
    protected _endTime?: Date;
    /**
     * Execution Duration in milliseconds
     */
    get duration(): number | undefined;
    /**
     * A shared scope between all features of the command during its execution
     */
    get scope(): A_Scope;
    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     *
     */
    get code(): string;
    /**
     * Current status of the command
     */
    get status(): A_CONSTANTS__A_Command_Status;
    /**
     * Start time of the command execution
     */
    get startedAt(): Date | undefined;
    /**
     * End time of the command execution
     */
    get endedAt(): Date | undefined;
    /**
     * Result of the command execution stored in the context
     */
    get result(): ResultType | undefined;
    /**
     * Errors encountered during the command execution stored in the context
     */
    get errors(): Set<A_Error> | undefined;
    /**
     * Parameters used to invoke the command
     */
    get params(): InvokeType;
    /**
     * Indicates if the command has failed
     */
    get isFailed(): boolean;
    /**
     * Indicates if the command has completed successfully
     */
    get isCompleted(): boolean;
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
    params: InvokeType | A_TYPES__Command_Serialized<ResultType> | string);
    init(): Promise<void>;
    compile(): Promise<void>;
    /**
     * Executes the command logic.
     */
    execute(): Promise<any>;
    /**
     * Marks the command as completed
     */
    complete(): Promise<void>;
    /**
     * Marks the command as failed
     */
    fail(): Promise<void>;
    /**
     * Registers an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    on(event: LifecycleEvents | A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>): void;
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event: LifecycleEvents | A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>): void;
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event: LifecycleEvents | A_CONSTANTS__A_Command_Event): void;
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
    fromJSON(serialized: A_TYPES__Command_Serialized<ResultType>): void;
    /**
     * Converts the Command instance to a plain object
     *
     * @returns
     */
    toJSON(): A_TYPES__Command_Serialized<ResultType>;
}
