import {
    A_TYPES__Command_Init,
    A_TYPES__Command_Listener,
    A_TYPES__Command_Serialized
} from "./A-Command.types";
import {
    A_CONSTANTS__A_Command_Event,
    A_CONSTANTS__A_Command_Status
} from "./A-Command.constants";
import { A_Context, A_Entity, A_Error, A_Scope } from "@adaas/a-concept";
import { A_Memory } from "../A-Memory/A-Memory.context";
import { A_CommandError } from "./A-Command.error";


export class A_Command<
    InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init,
    ResultType extends Record<string, any> = Record<string, any>,
    LifecycleEvents extends string | A_CONSTANTS__A_Command_Event = A_CONSTANTS__A_Command_Event
> extends A_Entity<InvokeType, A_TYPES__Command_Serialized<InvokeType, ResultType>> {

    // ====================================================================
    // ================== Static A-Command Information ====================
    // ====================================================================

    /**
     * Command Identifier that corresponds to the class name
     */
    static get code(): string {
        return super.entity;
    }

    // ====================================================================
    // ================ Instance A-Command Information ====================
    // ====================================================================
    protected _result?: ResultType;
    protected _executionScope!: A_Scope;
    protected _errors?: Set<A_Error>;

    protected _params!: InvokeType;
    protected _status!: A_CONSTANTS__A_Command_Status

    protected _listeners: Map<
        // the name of the event
        LifecycleEvents | A_CONSTANTS__A_Command_Event,
        // the listeners for the event
        Set<A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>>
    > = new Map();

    protected _startTime?: Date;
    protected _endTime?: Date

    /**
     * Execution Duration in milliseconds
     */
    get duration() {
        return this._endTime && this._startTime
            ? this._endTime.getTime() - this._startTime.getTime()
            : this._startTime
                ? new Date().getTime() - this._startTime.getTime()
                : undefined;
    }
    /**
     * A shared scope between all features of the command during its execution
     */
    get scope(): A_Scope {
        return this._executionScope;
    }
    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     * 
     */
    get code(): string {
        return (this.constructor as typeof A_Command).code;
    }
    /**
     * Current status of the command
     */
    get status(): A_CONSTANTS__A_Command_Status {
        return this._status;
    }
    /**
     * Start time of the command execution
     */
    get startedAt(): Date | undefined {
        return this._startTime;
    }
    /**
     * End time of the command execution
     */
    get endedAt(): Date | undefined {
        return this._endTime;
    }
    /**
     * Result of the command execution stored in the context
     */
    get result(): ResultType | undefined {
        return this._result;
    }
    /**
     * Errors encountered during the command execution stored in the context
     */
    get errors(): Set<A_Error> | undefined {
        return this._errors;
    }
    /**
     * Parameters used to invoke the command
     */
    get params(): InvokeType {
        return this._params;
    }
    /**
     * Indicates if the command has failed
     */
    get isFailed(): boolean {
        return this._status === A_CONSTANTS__A_Command_Status.FAILED;
    }
    /**
     * Indicates if the command has completed successfully
     */
    get isCompleted(): boolean {
        return this._status === A_CONSTANTS__A_Command_Status.COMPLETED;
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
        params: InvokeType | A_TYPES__Command_Serialized<InvokeType, ResultType> | string
    ) {
        super(params as any)
    }


    // --------------------------------------------------------------------------
    // A-Command Lifecycle Methods
    // --------------------------------------------------------------------------

    // should create a new Task in DB  with basic records
    async init(): Promise<void> {
        //  first check statuis if it passed then - skip
        if (this._status !== A_CONSTANTS__A_Command_Status.CREATED) {
            return;
        }

        this._status = A_CONSTANTS__A_Command_Status.INITIALIZATION;
        this._startTime = new Date();

        this.checkScopeInheritance();

        this.emit('init');
        await this.call('init', this.scope);
        this._status = A_CONSTANTS__A_Command_Status.INITIALIZED;
    }

    // Should compile everything before execution
    async compile() {
        if (this._status !== A_CONSTANTS__A_Command_Status.INITIALIZED) {
            return;
        }

        this.checkScopeInheritance();

        this._status = A_CONSTANTS__A_Command_Status.COMPILATION;
        this.emit('compile');
        await this.call('compile', this.scope);
        this._status = A_CONSTANTS__A_Command_Status.COMPILED;
    }

    /**
     * Processes the command execution
     * 
     * @returns 
     */
    async process() {
        if (this._status !== A_CONSTANTS__A_Command_Status.COMPILED)
            return;

        this._status = A_CONSTANTS__A_Command_Status.IN_PROGRESS;

        this.checkScopeInheritance();

        this.emit('execute');

        await this.call('execute', this.scope);
    }

    /**
     * Executes the command logic.
     */
    async execute(): Promise<any> {
        this.checkScopeInheritance();

        try {
            await this.init();
            await this.compile();
            await this.process();
            await this.complete();

        } catch (error) {
            await this.fail();
        }
    }

    /**
     * Marks the command as completed
     */
    async complete() {
        this.checkScopeInheritance();

        this._status = A_CONSTANTS__A_Command_Status.COMPLETED;
        this._endTime = new Date();
        this._result = this.scope.resolve(A_Memory).toJSON() as ResultType;

        this.emit('complete');
        return await this.call('complete', this.scope);
    }


    /**
     * Marks the command as failed
     */
    async fail() {
        this.checkScopeInheritance();

        this._status = A_CONSTANTS__A_Command_Status.FAILED;
        this._endTime = new Date();
        this._errors = this.scope.resolve(A_Memory).Errors;

        this.emit('fail');
        return await this.call('fail', this.scope);
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
    on(event: LifecycleEvents | A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>) {
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
    off(event: LifecycleEvents | A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>) {
        this._listeners.get(event)?.delete(listener);
    }
    /**
     * Emits an event to all registered listeners
     * 
     * @param event 
     */
    emit(event: LifecycleEvents | A_CONSTANTS__A_Command_Event) {
        this._listeners.get(event)?.forEach(listener => {
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

        this._executionScope = new A_Scope();

        this._executionScope.register(new A_Memory<ResultType>());

        this._params = newEntity;

        this._status = A_CONSTANTS__A_Command_Status.CREATED;
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

        this._executionScope = new A_Scope();

        const memory = new A_Memory<ResultType>();

        this._executionScope.register(memory);

        if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
        if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);


        // Restore result and errors in the memory
        if (serialized.result) {
            Object.entries(serialized.result).forEach(([key, value]) => {
                memory.set(key, value);
            });
        }

        if (serialized.errors) {
            serialized.errors.forEach(err => {
                memory.error(new A_Error(err));
            });
        }

        this._params = serialized.params

        this._status = serialized.status || A_CONSTANTS__A_Command_Status.CREATED;

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
            startedAt: this._startTime ? this._startTime.toISOString() : undefined,
            endedAt: this._endTime ? this._endTime.toISOString() : undefined,
            duration: this.duration,
            result: this.result,
            errors: this.errors ? Array.from(this.errors).map(err => err.toJSON()) : undefined
        }
    };


    protected checkScopeInheritance(): void {
        let attachedScope: A_Scope;
        try {
            attachedScope = A_Context.scope(this);
        } catch (error) {
            throw new A_CommandError({
                title: A_CommandError.CommandScopeBindingError,
                description: `Command ${this.code} is not bound to any context scope. Ensure the command is properly registered within a context before execution.`,
                originalError: error
            });
        }

        if (!this.scope.isInheritedFrom(A_Context.scope(this))) {
            this.scope.inherit(A_Context.scope(this));
        }
    }

}