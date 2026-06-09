'use strict';

var aConcept = require('@adaas/a-concept');
var core = require('@adaas/a-frame/core');
var AWorkflowFunctions_component = require('./A-WorkflowFunctions.component');
var AFeatureLoader_component = require('./A-FeatureLoader.component');
var AWorkflowStepContext_context = require('./A-WorkflowStepContext.context');
var AWorkflows_error = require('./A-Workflows.error');
var AWorkflows_constants = require('./A-Workflows.constants');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_Workflow = class A_Workflow extends aConcept.A_Entity {
  constructor() {
    super(...arguments);
    /** Event listeners by event name. */
    this._listeners = /* @__PURE__ */ new Map();
  }
  // ====================================================================
  // ================== Static Information ==============================
  // ====================================================================
  /** Static workflow type code derived from the class name. */
  static get code() {
    return super.entity;
  }
  // ====================================================================
  // ================== Getters =========================================
  // ====================================================================
  /** Unique workflow type identifier (kebab class name). */
  get code() {
    return this.constructor.code;
  }
  /** Execution scope hosting workflow helper components. */
  get scope() {
    return this._executionScope;
  }
  /** The immutable workflow recipe. */
  get definition() {
    return this._definition;
  }
  /** Current lifecycle status. */
  get status() {
    return this._status;
  }
  /** Index of the NEXT step to execute. */
  get cursor() {
    return this._cursor;
  }
  /** Accumulated data store. */
  get context() {
    return this._context;
  }
  /** Captured failure, if any. */
  get error() {
    return this._error;
  }
  /** Initial parameters the workflow was started with. */
  get params() {
    return this._context[AWorkflows_constants.A_WorkflowContextKey.PARAMS] || {};
  }
  /** Per-step results, keyed by step id. */
  get steps() {
    return this._context[AWorkflows_constants.A_WorkflowContextKey.STEPS] || {};
  }
  /** The step the cursor currently points at, or undefined when done. */
  get currentStep() {
    return this._definition.steps[this._cursor];
  }
  /** Whether the cursor has advanced past the final step. */
  get isDone() {
    return this._cursor >= this._definition.steps.length;
  }
  /** Whether the workflow has reached a terminal status. */
  get isProcessed() {
    return this._status === AWorkflows_constants.A_Workflow_Status.COMPLETED || this._status === AWorkflows_constants.A_Workflow_Status.FAILED;
  }
  /** Whether the workflow is paused at a transfer boundary. */
  get isPaused() {
    return this._status === AWorkflows_constants.A_Workflow_Status.PAUSED;
  }
  /** Timestamps. */
  get createdAt() {
    return this._createdAt;
  }
  get startedAt() {
    return this._startTime;
  }
  get endedAt() {
    return this._endTime;
  }
  /** Total (or elapsed) execution duration in milliseconds. */
  get duration() {
    return this._endTime && this._startTime ? this._endTime.getTime() - this._startTime.getTime() : this._startTime ? Date.now() - this._startTime.getTime() : void 0;
  }
  /**
   * Final result of the workflow — the accumulated context once complete.
   */
  get result() {
    return this._context;
  }
  // ====================================================================
  // ================== Definition (override point) =====================
  // ====================================================================
  /**
   * Declare the workflow recipe.
   *
   * Override this in a subclass to provide the steps for an inheritance-based
   * workflow. The default implementation returns `undefined`, in which case
   * the definition MUST be supplied through the constructor (the data-driven
   * form used by {@link A_Workflows.build}).
   *
   * The class-provided definition always takes precedence over a serialized
   * one, so deserializing a subclass on another service restores logic from
   * the class — not from untrusted wire data.
   */
  setup() {
    return void 0;
  }
  // ====================================================================
  // ================== Execution =======================================
  // ====================================================================
  /**
   * Start (or continue) the workflow and drive it until it completes, fails,
   * or pauses at a transfer boundary.
   *
   * - From `CREATED` → starts the workflow.
   * - From `PAUSED`  → resumes it (equivalent to {@link resume}).
   * - From a terminal status → no-op, returns immediately.
   *
   * This is the native entry point: call it directly on the entity. No
   * external engine is required.
   */
  async run() {
    if (this.isProcessed) return this;
    if (this._status === AWorkflows_constants.A_Workflow_Status.PAUSED) {
      this.resume();
    } else if (this._status === AWorkflows_constants.A_Workflow_Status.CREATED) {
      this.start();
    }
    await this._runLoop();
    return this;
  }
  /**
   * Resume a paused / freshly-deserialized workflow — typically on a
   * different service after transfer. Semantically identical to {@link run}
   * for a paused flow, but named for intent at distributed call sites.
   */
  async resumeRun() {
    return this.run();
  }
  /** Drive the workflow forward from its current cursor. */
  async _runLoop() {
    const functions = this.scope.resolve(AWorkflowFunctions_component.A_WorkflowFunctions);
    const loader = this.scope.resolve(AFeatureLoader_component.A_FeatureLoader);
    while (!this.isDone && this._status === AWorkflows_constants.A_Workflow_Status.RUNNING) {
      const step = this.currentStep;
      if (step.condition && !functions.evaluate(this._context, step.condition)) {
        this.skipStep(step.id);
        continue;
      }
      const params = functions.remap(this._context, step.remap);
      try {
        const result = await this._executeStep(step, params, loader);
        this.recordStepResult(step.id, result, step.output);
      } catch (error) {
        const handled = this._handleStepError(step, error);
        if (!handled) return;
        continue;
      }
      if (step.transferAfter && !this.isDone) {
        this.pause();
        return;
      }
    }
    if (this.isDone && this._status === AWorkflows_constants.A_Workflow_Status.RUNNING) {
      this.complete();
    }
  }
  /**
   * Execute a single workflow step against an isolated step scope and return
   * the result the step handler produced.
   */
  async _executeStep(step, params, loader) {
    const stepScope = new aConcept.A_Scope({
      name: `A-Workflow-Step-${step.id}`
    }).inherit(this.scope);
    const context = new AWorkflowStepContext_context.A_WorkflowStepContext(step.id, params);
    stepScope.register(context);
    try {
      const feature = this._buildStepFeature(step, stepScope, loader);
      await feature.process(stepScope);
      if (context.error) throw context.error;
      return context.hasResult ? context.result : void 0;
    } finally {
      stepScope.destroy();
    }
  }
  /**
   * Build the `A_Feature` for a step.
   *
   * Resolution order:
   *   1. inline `template`  → compiled via {@link A_FeatureLoader},
   *   2. `feature` + `target` → named feature on a registered component,
   *   3. `feature` only      → named feature on THIS workflow entity (the
   *      inheritance form — the handler lives on the subclass).
   */
  _buildStepFeature(step, stepScope, loader) {
    if (step.template) {
      return loader.load(
        { name: step.template.name || step.id, steps: step.template.steps },
        stepScope
      );
    }
    if (step.feature) {
      if (step.target) {
        const ctor = stepScope.resolveConstructor(step.target);
        if (!ctor) {
          throw new AWorkflows_error.A_WorkflowError({
            title: AWorkflows_error.A_WorkflowError.ResolutionError,
            description: `Step "${step.id}" target "${step.target}" is not registered in scope.`
          });
        }
        const instance = stepScope.resolve(ctor);
        if (!instance) {
          throw new AWorkflows_error.A_WorkflowError({
            title: AWorkflows_error.A_WorkflowError.ResolutionError,
            description: `Step "${step.id}" could not resolve an instance of "${step.target}".`
          });
        }
        return new aConcept.A_Feature({
          name: step.feature,
          component: instance,
          scope: stepScope
        });
      }
      return new aConcept.A_Feature({
        name: step.feature,
        component: this,
        scope: stepScope
      });
    }
    throw new AWorkflows_error.A_WorkflowError({
      title: AWorkflows_error.A_WorkflowError.DefinitionError,
      description: `Step "${step.id}" must define either a "template", a "feature" + "target", or a "feature" handled by the workflow itself.`
    });
  }
  /**
   * Apply the step's error behavior. Returns true when the run should
   * continue (the cursor was advanced / redirected), false when the workflow
   * failed.
   */
  _handleStepError(step, rawError) {
    const error = rawError instanceof aConcept.A_Error ? rawError : new AWorkflows_error.A_WorkflowError({
      title: AWorkflows_error.A_WorkflowError.StepExecutionError,
      description: `Step "${step.id}" failed.`,
      originalError: rawError
    });
    const behavior = step.onError || AWorkflows_constants.A_WorkflowStepErrorBehavior.FAIL;
    switch (behavior) {
      case AWorkflows_constants.A_WorkflowStepErrorBehavior.CONTINUE:
        this.recordStepResult(step.id, { error: error.toJSON() }, step.output);
        return true;
      case AWorkflows_constants.A_WorkflowStepErrorBehavior.GOTO:
        if (!step.onErrorGoto) {
          this.fail(new AWorkflows_error.A_WorkflowError({
            title: AWorkflows_error.A_WorkflowError.DefinitionError,
            description: `Step "${step.id}" uses "goto" error behavior without "onErrorGoto".`,
            originalError: error
          }));
          return false;
        }
        this.goto(step.onErrorGoto);
        return true;
      case AWorkflows_constants.A_WorkflowStepErrorBehavior.FAIL:
      default:
        this.fail(error);
        return false;
    }
  }
  // ====================================================================
  // ================== State Transitions ===============================
  // ====================================================================
  /**
   * Transition CREATED → RUNNING (idempotent for an already-running flow).
   * Records the start time on first run and emits `onStart`.
   */
  start() {
    this.checkScopeInheritance();
    if (this._status === AWorkflows_constants.A_Workflow_Status.RUNNING) return;
    if (this._status !== AWorkflows_constants.A_Workflow_Status.CREATED) {
      throw new AWorkflows_error.A_WorkflowError({
        title: AWorkflows_error.A_WorkflowError.ExecutionError,
        description: `Cannot start workflow "${this.aseid.toString()}" from status "${this._status}".`
      });
    }
    if (!this._startTime) this._startTime = /* @__PURE__ */ new Date();
    this._status = AWorkflows_constants.A_Workflow_Status.RUNNING;
    this.emit(AWorkflows_constants.A_WorkflowEvent.onStart);
  }
  /**
   * Transition RUNNING → PAUSED at a transfer boundary. Emits `onPause`.
   * The caller is expected to serialize the workflow at this point.
   */
  pause() {
    if (this._status !== AWorkflows_constants.A_Workflow_Status.RUNNING) return;
    this._status = AWorkflows_constants.A_Workflow_Status.PAUSED;
    this.emit(AWorkflows_constants.A_WorkflowEvent.onPause);
  }
  /**
   * Transition PAUSED → RUNNING after a transfer. Emits `onResume`.
   */
  resume() {
    this.checkScopeInheritance();
    if (this._status === AWorkflows_constants.A_Workflow_Status.RUNNING) return;
    if (this._status !== AWorkflows_constants.A_Workflow_Status.PAUSED) {
      throw new AWorkflows_error.A_WorkflowError({
        title: AWorkflows_error.A_WorkflowError.ExecutionError,
        description: `Cannot resume workflow "${this.aseid.toString()}" from status "${this._status}".`
      });
    }
    this._status = AWorkflows_constants.A_Workflow_Status.RUNNING;
    this.emit(AWorkflows_constants.A_WorkflowEvent.onResume);
  }
  /**
   * Record a successful step result, mirror it to an optional `output` key,
   * advance the cursor, and emit `onStep`.
   */
  recordStepResult(stepId, result, output) {
    this._context[AWorkflows_constants.A_WorkflowContextKey.STEPS][stepId] = result;
    if (output) this._context[output] = result;
    this._cursor++;
    this.emit(AWorkflows_constants.A_WorkflowEvent.onStep);
  }
  /**
   * Advance the cursor past a skipped step and emit `onSkip`.
   */
  skipStep(stepId) {
    this._cursor++;
    this.emit(AWorkflows_constants.A_WorkflowEvent.onSkip);
  }
  /**
   * Move the cursor to the step with the given id (used by `goto` error
   * handling). Throws if the id is unknown.
   */
  goto(stepId) {
    const index = this._definition.steps.findIndex((s) => s.id === stepId);
    if (index === -1) {
      throw new AWorkflows_error.A_WorkflowError({
        title: AWorkflows_error.A_WorkflowError.ResolutionError,
        description: `Cannot jump to unknown step "${stepId}" in workflow "${this.aseid.toString()}".`
      });
    }
    this._cursor = index;
  }
  /**
   * Transition RUNNING → COMPLETED. Records the end time and emits
   * `onComplete`.
   */
  complete() {
    if (this.isProcessed) return;
    this._status = AWorkflows_constants.A_Workflow_Status.COMPLETED;
    this._endTime = /* @__PURE__ */ new Date();
    this.emit(AWorkflows_constants.A_WorkflowEvent.onComplete);
  }
  /**
   * Transition → FAILED. Records the error + end time and emits `onFail`.
   */
  fail(error) {
    if (this.isProcessed) return;
    this._status = AWorkflows_constants.A_Workflow_Status.FAILED;
    this._error = error;
    this._endTime = /* @__PURE__ */ new Date();
    this.emit(AWorkflows_constants.A_WorkflowEvent.onFail);
  }
  // ====================================================================
  // ================== Event Emitter ===================================
  // ====================================================================
  /** Subscribe to a workflow lifecycle event. */
  on(event, listener) {
    if (!this._listeners.has(event)) this._listeners.set(event, /* @__PURE__ */ new Set());
    this._listeners.get(event).add(listener);
  }
  /** Unsubscribe from a workflow lifecycle event. */
  off(event, listener) {
    this._listeners.get(event)?.delete(listener);
  }
  /** Emit a workflow lifecycle event to all listeners. */
  emit(event) {
    this._listeners.get(event)?.forEach((listener) => listener(this));
  }
  // ====================================================================
  // ================== Serialization ===================================
  // ====================================================================
  /**
   * Construct a fresh, class-defined workflow with no constructor argument.
   * The recipe comes from {@link setup}.
   */
  fromUndefined() {
    super.fromUndefined();
    this._initFresh(void 0, void 0);
  }
  fromNew(newEntity) {
    super.fromNew(newEntity);
    this._initFresh(newEntity?.definition, newEntity?.params);
  }
  fromJSON(serialized) {
    super.fromJSON(serialized);
    const definition = this.setup() || serialized.definition;
    this._validateDefinition(definition);
    this._origin = "serialized";
    this._definition = definition;
    this._status = serialized.status;
    this._cursor = serialized.cursor;
    this._context = serialized.context || {
      [AWorkflows_constants.A_WorkflowContextKey.PARAMS]: {},
      [AWorkflows_constants.A_WorkflowContextKey.STEPS]: {}
    };
    this._createdAt = serialized.createdAt ? new Date(serialized.createdAt) : /* @__PURE__ */ new Date();
    if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
    if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);
    if (serialized.error) this._error = new AWorkflows_error.A_WorkflowError(serialized.error);
    this._buildExecutionScope();
  }
  toJSON() {
    return {
      ...super.toJSON(),
      code: this.code,
      definition: this._definition,
      status: this._status,
      cursor: this._cursor,
      context: this._context,
      createdAt: this._createdAt.toISOString(),
      startedAt: this._startTime ? this._startTime.toISOString() : void 0,
      endedAt: this._endTime ? this._endTime.toISOString() : void 0,
      error: this._error ? this._error.toJSON() : void 0
    };
  }
  // ====================================================================
  // ================== Helpers =========================================
  // ====================================================================
  /** Shared fresh-instance initialization for `fromNew` / `fromUndefined`. */
  _initFresh(definition, params) {
    const resolved = this.setup() || definition;
    this._validateDefinition(resolved);
    this._origin = "invoked";
    this._definition = resolved;
    this._status = AWorkflows_constants.A_Workflow_Status.CREATED;
    this._cursor = 0;
    this._createdAt = /* @__PURE__ */ new Date();
    this._context = {
      [AWorkflows_constants.A_WorkflowContextKey.PARAMS]: params || {},
      [AWorkflows_constants.A_WorkflowContextKey.STEPS]: {}
    };
    this._buildExecutionScope();
  }
  /** Build (or rebuild) the execution scope with the helper components. */
  _buildExecutionScope() {
    this._executionScope = new aConcept.A_Scope({
      name: `A-Workflow-Execution-Scope-${this.aseid.toString()}`,
      components: [AWorkflowFunctions_component.A_WorkflowFunctions, AFeatureLoader_component.A_FeatureLoader]
    });
  }
  /** Validate a workflow definition (non-empty, unique step ids). */
  _validateDefinition(definition) {
    if (!definition || typeof definition !== "object" || typeof definition.name !== "string") {
      throw new AWorkflows_error.A_WorkflowError({
        title: AWorkflows_error.A_WorkflowError.DefinitionError,
        description: `A workflow definition with a "name" string is required.`
      });
    }
    if (!Array.isArray(definition.steps) || definition.steps.length === 0) {
      throw new AWorkflows_error.A_WorkflowError({
        title: AWorkflows_error.A_WorkflowError.DefinitionError,
        description: `Workflow "${definition.name}" must declare at least one step.`
      });
    }
    const ids = /* @__PURE__ */ new Set();
    for (const step of definition.steps) {
      if (!step || typeof step.id !== "string" || !step.id) {
        throw new AWorkflows_error.A_WorkflowError({
          title: AWorkflows_error.A_WorkflowError.DefinitionError,
          description: `Workflow "${definition.name}" has a step without a valid "id".`
        });
      }
      if (ids.has(step.id)) {
        throw new AWorkflows_error.A_WorkflowError({
          title: AWorkflows_error.A_WorkflowError.DefinitionError,
          description: `Workflow "${definition.name}" has duplicate step id "${step.id}".`
        });
      }
      ids.add(step.id);
    }
  }
  /**
   * Ensure the execution scope inherits from the scope this entity is
   * registered in. Throws when the workflow is not bound to any scope.
   */
  checkScopeInheritance() {
    let attachedScope;
    try {
      attachedScope = aConcept.A_Context.scope(this);
    } catch (error) {
      throw new AWorkflows_error.A_WorkflowError({
        title: AWorkflows_error.A_WorkflowError.ScopeBindingError,
        description: `Workflow "${this.aseid.toString()}" is not bound to any context scope. Register it before running.`,
        originalError: error
      });
    }
    if (!this._executionScope.isInheritedFrom(attachedScope)) {
      this._executionScope.inherit(attachedScope);
    }
  }
};
exports.A_Workflow = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "A distributed, resumable, self-executing workflow entity. Subclasses declare their recipe via setup() and implement steps as feature handlers, then run() drives execution. Full serialize/deserialize allows pausing on one service and resuming on another with no loss of information."
  })
], exports.A_Workflow);
//# sourceMappingURL=A-Workflow.entity.js.map
//# sourceMappingURL=A-Workflow.entity.js.map