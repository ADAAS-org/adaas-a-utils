"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Command = void 0;
const A_Command_constants_1 = require("./A-Command.constants");
const a_concept_1 = require("@adaas/a-concept");
const A_Memory_context_1 = require("../A-Memory/A-Memory.context");
class A_Command extends a_concept_1.A_Entity {
    // ====================================================================
    // ================== Static A-Command Information ====================
    // ====================================================================
    /**
     * Command Identifier that corresponds to the class name
     */
    static get code() {
        return super.entity;
    }
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
    get scope() {
        return this._executionScope;
    }
    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     *
     */
    get code() {
        return this.constructor.code;
    }
    /**
     * Current status of the command
     */
    get status() {
        return this._status;
    }
    /**
     * Start time of the command execution
     */
    get startedAt() {
        return this._startTime;
    }
    /**
     * End time of the command execution
     */
    get endedAt() {
        return this._endTime;
    }
    /**
     * Result of the command execution stored in the context
     */
    get result() {
        return this._result;
    }
    /**
     * Errors encountered during the command execution stored in the context
     */
    get errors() {
        return this._errors;
    }
    /**
     * Parameters used to invoke the command
     */
    get params() {
        return this._params;
    }
    /**
     * Indicates if the command has failed
     */
    get isFailed() {
        return this._status === A_Command_constants_1.A_CONSTANTS__A_Command_Status.FAILED;
    }
    /**
     * Indicates if the command has completed successfully
     */
    get isCompleted() {
        return this._status === A_Command_constants_1.A_CONSTANTS__A_Command_Status.COMPLETED;
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
    params) {
        super(params);
        this._listeners = new Map();
    }
    // --------------------------------------------------------------------------
    // A-Command Lifecycle Methods
    // --------------------------------------------------------------------------
    // should create a new Task in DB  with basic records
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.IN_PROGRESS;
            this._startTime = new Date();
            if (!this.scope.isInheritedFrom(a_concept_1.A_Context.scope(this))) {
                this.scope.inherit(a_concept_1.A_Context.scope(this));
            }
            this.emit('init');
            return yield this.call('init', this.scope);
        });
    }
    // Should compile everything before execution
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('compile');
            return yield this.call('compile', this.scope);
        });
    }
    /**
     * Executes the command logic.
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.init();
                yield this.compile();
                this.emit('execute');
                yield this.call('execute', this.scope);
                yield this.complete();
            }
            catch (error) {
                yield this.fail();
            }
        });
    }
    /**
     * Marks the command as completed
     */
    complete() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.COMPLETED;
            this._endTime = new Date();
            this._result = this.scope.resolve(A_Memory_context_1.A_Memory).toJSON();
            this.emit('complete');
            return yield this.call('complete', this.scope);
        });
    }
    /**
     * Marks the command as failed
     */
    fail() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.FAILED;
            this._endTime = new Date();
            this._errors = this.scope.resolve(A_Memory_context_1.A_Memory).Errors;
            this.emit('fail');
            return yield this.call('fail', this.scope);
        });
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
    on(event, listener) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event).add(listener);
    }
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event, listener) {
        var _a;
        (_a = this._listeners.get(event)) === null || _a === void 0 ? void 0 : _a.delete(listener);
    }
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event) {
        var _a;
        (_a = this._listeners.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(listener => {
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
    fromNew(newEntity) {
        super.fromNew(newEntity);
        this._executionScope = new a_concept_1.A_Scope();
        this._executionScope.register(new A_Memory_context_1.A_Memory());
        this._params = newEntity;
        this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.INITIALIZED;
    }
    /**
     * Allows to convert serialized data to Command instance
     *
     * [!] By default it omits params as they are not stored in the serialized data
     *
     * @param serialized
     */
    fromJSON(serialized) {
        super.fromJSON(serialized);
        this._executionScope = new a_concept_1.A_Scope();
        const memory = new A_Memory_context_1.A_Memory();
        this._executionScope.register(memory);
        if (serialized.startedAt)
            this._startTime = new Date(serialized.startedAt);
        if (serialized.endedAt)
            this._endTime = new Date(serialized.endedAt);
        // Restore result and errors in the memory
        if (serialized.result) {
            Object.entries(serialized.result).forEach(([key, value]) => {
                memory.set(key, value);
            });
        }
        if (serialized.errors) {
            serialized.errors.forEach(err => {
                memory.error(new a_concept_1.A_Error(err));
            });
        }
        this._status = serialized.status || A_Command_constants_1.A_CONSTANTS__A_Command_Status.INITIALIZED;
    }
    /**
     * Converts the Command instance to a plain object
     *
     * @returns
     */
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { code: this.code, status: this._status, startedAt: this._startTime ? this._startTime.toISOString() : undefined, endedAt: this._endTime ? this._endTime.toISOString() : undefined, duration: this.duration, result: this.result, errors: this.errors ? Array.from(this.errors).map(err => err.toJSON()) : undefined });
    }
    ;
}
exports.A_Command = A_Command;
//# sourceMappingURL=A-Command.entity.js.map