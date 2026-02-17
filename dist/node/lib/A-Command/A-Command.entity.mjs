import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Command_Status, A_CommandTransitions, A_CommandEvent, A_CommandFeatures } from './A-Command.constants';
import { A_Entity, A_Feature, A_Error, A_Scope, A_Context, A_Inject, A_Dependency } from '@adaas/a-concept';
import { A_CommandError } from './A-Command.error';
import { A_StateMachineFeatures, A_StateMachine, A_StateMachineTransition } from '@adaas/a-utils/a-state-machine';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_ExecutionContext } from '@adaas/a-utils/a-execution';
import { A_Frame } from '@adaas/a-frame';

var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
let A_Command = class extends A_Entity {
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
  constructor(params) {
    super(params);
    /** Map of event listeners organized by event name */
    this._listeners = /* @__PURE__ */ new Map();
  }
  // ====================================================================
  // ================== Static Command Information ======================
  // ====================================================================
  /**
   * Static command identifier derived from the class name
   * Used for command registration and serialization
   */
  static get code() {
    return super.entity;
  }
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
  get duration() {
    return this._endTime && this._startTime ? this._endTime.getTime() - this._startTime.getTime() : this._startTime ? (/* @__PURE__ */ new Date()).getTime() - this._startTime.getTime() : void 0;
  }
  /**
   * Idle time before execution started in milliseconds
   * 
   * Time between command creation and execution start.
   * Useful for monitoring command queue performance.
   */
  get idleTime() {
    return this._startTime && this._createdAt ? this._startTime.getTime() - this._createdAt.getTime() : void 0;
  }
  /**
   * Command execution scope for dependency injection
   * 
   * Provides access to components, services, and shared resources
   * during command execution. Inherits from the scope where the
   * command was registered.
   */
  get scope() {
    return this._executionScope;
  }
  /**
   * Execution context associated with the command
   */
  get context() {
    return this.scope.resolve(A_ExecutionContext);
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
  get code() {
    return this.constructor.code;
  }
  /**
   * Current lifecycle status of the command
   * 
   * Indicates the current phase in the command execution lifecycle.
   * Used to track progress and determine available operations.
   */
  get status() {
    return this._status;
  }
  /**
   * Timestamp when the command was created
   * 
   * Marks the initial instantiation time, useful for tracking
   * command age and queue performance metrics.
   */
  get createdAt() {
    return this._createdAt;
  }
  /**
   * Timestamp when command execution started
   * 
   * Undefined until execution begins. Used for calculating
   * execution duration and idle time.
   */
  get startedAt() {
    return this._startTime;
  }
  /**
   * Timestamp when command execution ended
   * 
   * Set when command reaches COMPLETED or FAILED status.
   * Used for calculating total execution duration.
   */
  get endedAt() {
    return this._endTime;
  }
  /**
   * Result data produced by command execution
   * 
   * Contains the output data from successful command execution.
   * Undefined until command completes successfully.
   */
  get result() {
    return this._result;
  }
  /**
   * Array of errors that occurred during execution
   * 
   * Automatically wraps native errors in A_Error instances
   * for consistent error handling. Empty array if no errors occurred.
   */
  get error() {
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
  get params() {
    return this._params;
  }
  /**
   * Indicates if the command has been processed (completed or failed)
   * 
   * Returns true if the command has completed or failed, false otherwise.
   */
  get isProcessed() {
    return this._status === A_Command_Status.COMPLETED || this._status === A_Command_Status.FAILED;
  }
  async [_k = A_StateMachineFeatures.onBeforeTransition](transition, logger, ...args) {
    this.checkScopeInheritance();
    logger?.debug("yellow", `Command ${this.aseid.toString()} transitioning from ${transition.from} to ${transition.to}`);
  }
  async [_j = A_CommandTransitions.CREATED_TO_INITIALIZED](transition, ...args) {
    if (this._status !== A_Command_Status.CREATED) {
      return;
    }
    this._createdAt = /* @__PURE__ */ new Date();
    this._status = A_Command_Status.INITIALIZED;
    this.emit(A_CommandEvent.onInit);
  }
  async [_i = A_CommandTransitions.INITIALIZED_TO_EXECUTING](transition, ...args) {
    if (this._status !== A_Command_Status.INITIALIZED && this._status !== A_Command_Status.CREATED) {
      return;
    }
    this._startTime = /* @__PURE__ */ new Date();
    this._status = A_Command_Status.EXECUTING;
    this.emit(A_CommandEvent.onExecute);
  }
  /**
   * Handles command completion after successful execution
   * 
   * EXECUTION -> COMPLETED transition
   */
  async [_h = A_CommandTransitions.EXECUTING_TO_COMPLETED](transition, ...args) {
    this._endTime = /* @__PURE__ */ new Date();
    this._status = A_Command_Status.COMPLETED;
    this.emit(A_CommandEvent.onComplete);
  }
  /**
   * Handles command failure during execution
   * 
   * EXECUTION -> FAILED transition
   */
  async [_g = A_CommandTransitions.EXECUTING_TO_FAILED](transition, error, ...args) {
    this._endTime = /* @__PURE__ */ new Date();
    this._status = A_Command_Status.FAILED;
    this.emit(A_CommandEvent.onFail);
  }
  /**
   * Default behavior for Command Initialization uses StateMachine to transition states
   */
  async [_f = A_CommandFeatures.onInit](stateMachine, ...args) {
    await stateMachine.transition(A_Command_Status.CREATED, A_Command_Status.INITIALIZED);
  }
  async [_e = A_CommandFeatures.onBeforeExecute](stateMachine, ...args) {
    await stateMachine.transition(A_Command_Status.INITIALIZED, A_Command_Status.EXECUTING);
  }
  async [_d = A_CommandFeatures.onExecute](...args) {
  }
  /**
   * By Default on AfterExecute calls the Completion method to mark the command as completed
   * 
   * [!] This can be overridden to implement custom behavior using A_Feature overrides
   */
  async [_c = A_CommandFeatures.onAfterExecute](...args) {
  }
  async [_b = A_CommandFeatures.onComplete](stateMachine, ...args) {
    await stateMachine.transition(A_Command_Status.EXECUTING, A_Command_Status.COMPLETED);
  }
  async [_a = A_CommandFeatures.onFail](stateMachine, operation, ...args) {
    await stateMachine.transition(A_Command_Status.EXECUTING, A_Command_Status.FAILED);
  }
  // --------------------------------------------------------------------------
  // A-Command Lifecycle Methods
  // --------------------------------------------------------------------------
  /**
   * Initializes the command before execution.
   */
  async init() {
    await this.call(A_CommandFeatures.onInit, this.scope);
  }
  /**
   * Executes the command logic.
   */
  async execute() {
    if (this.isProcessed) return;
    try {
      this.checkScopeInheritance();
      const context = new A_ExecutionContext("execute-command");
      this.scope.register(context);
      await new Promise(async (resolve, reject) => {
        try {
          const onBeforeExecuteFeature = new A_Feature({
            name: A_CommandFeatures.onBeforeExecute,
            component: this,
            scope: this.scope
          });
          const onExecuteFeature = new A_Feature({
            name: A_CommandFeatures.onExecute,
            component: this,
            scope: this.scope
          });
          const onAfterExecuteFeature = new A_Feature({
            name: A_CommandFeatures.onAfterExecute,
            component: this,
            scope: this.scope
          });
          this.on(A_CommandEvent.onComplete, () => {
            onBeforeExecuteFeature.interrupt();
            onExecuteFeature.interrupt();
            onAfterExecuteFeature.interrupt();
            resolve();
          });
          this.on(A_CommandEvent.onFail, () => {
            onBeforeExecuteFeature.interrupt();
            onExecuteFeature.interrupt();
            onAfterExecuteFeature.interrupt();
            reject(this.error);
          });
          await onBeforeExecuteFeature.process(this.scope);
          await onExecuteFeature.process(this.scope);
          await onAfterExecuteFeature.process(this.scope);
          if (this._origin === "invoked") {
            await this.complete();
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      let targetError = error instanceof A_Error ? error : new A_CommandError({
        title: A_CommandError.ExecutionError,
        description: `An error occurred while executing command "${this.aseid.toString()}".`,
        originalError: error
      });
      await this.fail(targetError);
    }
  }
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
  async complete(result) {
    if (this.isProcessed) return;
    this._status = A_Command_Status.COMPLETED;
    this._result = result;
    await this.call(A_CommandFeatures.onComplete, this.scope);
    this.scope.destroy();
  }
  /**
   * Marks the command as failed
   */
  async fail(error) {
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
  on(event, listener) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, /* @__PURE__ */ new Set());
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
    this._listeners.get(event)?.delete(listener);
  }
  /**
   * Emits an event to all registered listeners
   * 
   * @param event 
   */
  emit(event) {
    this._listeners.get(event)?.forEach(async (listener) => {
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
    this._origin = "invoked";
    this._executionScope = new A_Scope({
      name: `A-Command-Execution-Scope-${this.aseid.toString()}`,
      components: [A_StateMachine]
    });
    this._createdAt = /* @__PURE__ */ new Date();
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
  fromJSON(serialized) {
    super.fromJSON(serialized);
    this._origin = "serialized";
    this._executionScope = new A_Scope({
      name: `A-Command-Execution-Scope-${this.aseid.toString()}`,
      components: [A_StateMachine]
    });
    if (serialized.createdAt) this._createdAt = new Date(serialized.createdAt);
    if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
    if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);
    this._params = serialized.params;
    this._status = serialized.status;
    if (serialized.error)
      this._error = new A_CommandError(serialized.error);
    if (serialized.result)
      this._result = serialized.result;
  }
  /**
   * Converts the Command instance to a plain object
   * 
   * @returns 
   */
  toJSON() {
    return {
      ...super.toJSON(),
      code: this.code,
      status: this._status,
      params: this._params,
      createdAt: this._createdAt.toISOString(),
      startedAt: this._startTime ? this._startTime.toISOString() : void 0,
      endedAt: this._endTime ? this._endTime.toISOString() : void 0,
      duration: this.duration,
      idleTime: this.idleTime,
      result: this.result,
      error: this.error ? this.error.toJSON() : void 0
    };
  }
  //============================================================================================
  //                                Helpers Methods
  //============================================================================================
  /**
   * Ensures that the command's execution scope inherits from the context scope
   * 
   * Throws an error if the command is not bound to any context scope
   */
  checkScopeInheritance() {
    let attachedScope;
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
};
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_StateMachineTransition)),
  __decorateParam(1, A_Inject(A_Logger))
], A_Command.prototype, _k, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_StateMachineTransition))
], A_Command.prototype, _j, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_StateMachineTransition))
], A_Command.prototype, _i, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_StateMachineTransition))
], A_Command.prototype, _h, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_StateMachineTransition)),
  __decorateParam(1, A_Inject(A_Error))
], A_Command.prototype, _g, 1);
__decorateClass([
  A_Feature.Extend(),
  __decorateParam(0, A_Inject(A_StateMachine))
], A_Command.prototype, _f, 1);
__decorateClass([
  A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_StateMachine))
], A_Command.prototype, _e, 1);
__decorateClass([
  A_Feature.Extend()
], A_Command.prototype, _d, 1);
__decorateClass([
  A_Feature.Extend()
], A_Command.prototype, _c, 1);
__decorateClass([
  A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, A_Inject(A_StateMachine))
], A_Command.prototype, _b, 1);
__decorateClass([
  A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, A_Dependency.Required()),
  __decorateParam(0, A_Inject(A_StateMachine)),
  __decorateParam(1, A_Inject(A_ExecutionContext))
], A_Command.prototype, _a, 1);
A_Command = __decorateClass([
  A_Frame.Entity({
    namespace: "A-Utils",
    name: "A-Command",
    description: "Advanced Command Pattern Implementation with full lifecycle management, event handling, and state persistence. This entity allows to execute commands in distributed environment across multiple services."
  })
], A_Command);

export { A_Command };
//# sourceMappingURL=A-Command.entity.mjs.map
//# sourceMappingURL=A-Command.entity.mjs.map