import { A_ExecutionContext } from './chunk-SEQJPRV7.mjs';
import { __decorateClass } from './chunk-EQQGB2QZ.mjs';
import { A_Error, A_Component, A_Feature, A_Scope, A_Dependency, A_Entity, A_Context } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';

var A_WorkflowError = class extends A_Error {
};
/** The workflow instance is not registered in any scope. */
A_WorkflowError.ScopeBindingError = "A-Workflow Scope Binding Error";
/** A workflow definition is missing/invalid (no steps, duplicate ids, …). */
A_WorkflowError.DefinitionError = "A-Workflow Definition Error";
/** A step references a target / feature / step id that cannot be resolved. */
A_WorkflowError.ResolutionError = "A-Workflow Resolution Error";
/** A predefined remap / condition function id is unknown. */
A_WorkflowError.FunctionError = "A-Workflow Function Error";
/** A feature template provided to the loader is invalid. */
A_WorkflowError.FeatureLoaderError = "A-Workflow Feature Loader Error";
/** A step handler threw while executing. */
A_WorkflowError.StepExecutionError = "A-Workflow Step Execution Error";
/** The workflow run failed as a whole. */
A_WorkflowError.ExecutionError = "A-Workflow Execution Error";

// src/lib/A-Workflows/A-Workflows.constants.ts
var A_Workflow_Status = /* @__PURE__ */ ((A_Workflow_Status2) => {
  A_Workflow_Status2["CREATED"] = "CREATED";
  A_Workflow_Status2["RUNNING"] = "RUNNING";
  A_Workflow_Status2["PAUSED"] = "PAUSED";
  A_Workflow_Status2["COMPLETED"] = "COMPLETED";
  A_Workflow_Status2["FAILED"] = "FAILED";
  return A_Workflow_Status2;
})(A_Workflow_Status || {});
var A_WorkflowFeatures = /* @__PURE__ */ ((A_WorkflowFeatures2) => {
  A_WorkflowFeatures2["onStart"] = "_A_Workflow_onStart";
  A_WorkflowFeatures2["onBeforeStep"] = "_A_Workflow_onBeforeStep";
  A_WorkflowFeatures2["onAfterStep"] = "_A_Workflow_onAfterStep";
  A_WorkflowFeatures2["onPause"] = "_A_Workflow_onPause";
  A_WorkflowFeatures2["onResume"] = "_A_Workflow_onResume";
  A_WorkflowFeatures2["onComplete"] = "_A_Workflow_onComplete";
  A_WorkflowFeatures2["onFail"] = "_A_Workflow_onFail";
  return A_WorkflowFeatures2;
})(A_WorkflowFeatures || {});
var A_WorkflowEvent = /* @__PURE__ */ ((A_WorkflowEvent2) => {
  A_WorkflowEvent2["onStart"] = "onStart";
  A_WorkflowEvent2["onStep"] = "onStep";
  A_WorkflowEvent2["onSkip"] = "onSkip";
  A_WorkflowEvent2["onPause"] = "onPause";
  A_WorkflowEvent2["onResume"] = "onResume";
  A_WorkflowEvent2["onComplete"] = "onComplete";
  A_WorkflowEvent2["onFail"] = "onFail";
  return A_WorkflowEvent2;
})(A_WorkflowEvent || {});
var A_WorkflowStepErrorBehavior = /* @__PURE__ */ ((A_WorkflowStepErrorBehavior2) => {
  A_WorkflowStepErrorBehavior2["FAIL"] = "fail";
  A_WorkflowStepErrorBehavior2["CONTINUE"] = "continue";
  A_WorkflowStepErrorBehavior2["GOTO"] = "goto";
  return A_WorkflowStepErrorBehavior2;
})(A_WorkflowStepErrorBehavior || {});
var A_WorkflowConditionFn = /* @__PURE__ */ ((A_WorkflowConditionFn2) => {
  A_WorkflowConditionFn2["EQUALS"] = "equals";
  A_WorkflowConditionFn2["NOT_EQUALS"] = "notEquals";
  A_WorkflowConditionFn2["EXISTS"] = "exists";
  A_WorkflowConditionFn2["NOT_EXISTS"] = "notExists";
  A_WorkflowConditionFn2["TRUTHY"] = "truthy";
  A_WorkflowConditionFn2["FALSY"] = "falsy";
  A_WorkflowConditionFn2["GT"] = "gt";
  A_WorkflowConditionFn2["GTE"] = "gte";
  A_WorkflowConditionFn2["LT"] = "lt";
  A_WorkflowConditionFn2["LTE"] = "lte";
  A_WorkflowConditionFn2["IN"] = "in";
  A_WorkflowConditionFn2["MATCHES"] = "matches";
  A_WorkflowConditionFn2["AND"] = "and";
  A_WorkflowConditionFn2["OR"] = "or";
  A_WorkflowConditionFn2["NOT"] = "not";
  return A_WorkflowConditionFn2;
})(A_WorkflowConditionFn || {});
var A_WorkflowValueFn = /* @__PURE__ */ ((A_WorkflowValueFn2) => {
  A_WorkflowValueFn2["CONCAT"] = "concat";
  A_WorkflowValueFn2["UPPERCASE"] = "uppercase";
  A_WorkflowValueFn2["LOWERCASE"] = "lowercase";
  A_WorkflowValueFn2["COALESCE"] = "coalesce";
  A_WorkflowValueFn2["NOW"] = "now";
  A_WorkflowValueFn2["SUM"] = "sum";
  A_WorkflowValueFn2["NOT"] = "not";
  A_WorkflowValueFn2["JSON"] = "json";
  return A_WorkflowValueFn2;
})(A_WorkflowValueFn || {});
var A_WorkflowContextKey = /* @__PURE__ */ ((A_WorkflowContextKey2) => {
  A_WorkflowContextKey2["PARAMS"] = "params";
  A_WorkflowContextKey2["STEPS"] = "steps";
  return A_WorkflowContextKey2;
})(A_WorkflowContextKey || {});

// src/lib/A-Workflows/A-WorkflowFunctions.component.ts
var A_WorkflowFunctions = class extends A_Component {
  // ====================================================================
  // ================== Value Resolution ================================
  // ====================================================================
  /**
   * Resolve a single value source against the workflow `context`.
   *
   *   - `{ value }`     → the literal.
   *   - `{ from }`      → dot-path lookup into context (undefined if absent).
   *   - `{ fn, args }`  → apply the named {@link A_WorkflowValueFn} to the
   *                       resolved args.
   */
  resolveValue(context, source) {
    if (source === null || typeof source !== "object") {
      throw new A_WorkflowError({
        title: A_WorkflowError.FunctionError,
        description: `Invalid value source: ${JSON.stringify(source)?.slice(0, 100)}`
      });
    }
    if ("value" in source) return source.value;
    if ("from" in source && typeof source.from === "string") {
      return this._get(context, source.from);
    }
    if ("fn" in source && typeof source.fn === "string") {
      const args = (source.args || []).map((a) => this.resolveValue(context, a));
      return this._applyValueFn(source.fn, args);
    }
    throw new A_WorkflowError({
      title: A_WorkflowError.FunctionError,
      description: `Value source must define one of "value" | "from" | "fn". Received: ${JSON.stringify(source)?.slice(0, 100)}`
    });
  }
  /**
   * Build a params object from a remap specification. Target keys support
   * dot-paths, so a remap may compose nested params.
   *
   * @example
   * ```ts
   * remap(ctx, { 'user.id': { from: 'params.id' }, token: { from: 'steps.login.token' } })
   * // => { user: { id: <ctx.params.id> }, token: <ctx.steps.login.token> }
   * ```
   */
  remap(context, spec) {
    const out = {};
    if (!spec) return out;
    for (const targetKey of Object.keys(spec)) {
      const value = this.resolveValue(context, spec[targetKey]);
      this._set(out, targetKey, value);
    }
    return out;
  }
  // ====================================================================
  // ================== Condition Evaluation ============================
  // ====================================================================
  /**
   * Evaluate a boolean condition against the workflow `context`. Unknown
   * function ids throw an {@link A_WorkflowError}.
   */
  evaluate(context, condition) {
    if (!condition) return true;
    const fn = condition.fn;
    switch (fn) {
      // ── Logical combinators ──────────────────────────────────
      case "and" /* AND */:
        return (condition.conditions || []).every((c) => this.evaluate(context, c));
      case "or" /* OR */:
        return (condition.conditions || []).some((c) => this.evaluate(context, c));
      case "not" /* NOT */:
        return !(condition.conditions || []).every((c) => this.evaluate(context, c));
      // ── Unary predicates ─────────────────────────────────────
      case "exists" /* EXISTS */:
        return this._left(context, condition) !== void 0 && this._left(context, condition) !== null;
      case "notExists" /* NOT_EXISTS */:
        return this._left(context, condition) === void 0 || this._left(context, condition) === null;
      case "truthy" /* TRUTHY */:
        return !!this._left(context, condition);
      case "falsy" /* FALSY */:
        return !this._left(context, condition);
      // ── Binary comparisons ───────────────────────────────────
      case "equals" /* EQUALS */:
        return this._left(context, condition) === this._right(context, condition);
      case "notEquals" /* NOT_EQUALS */:
        return this._left(context, condition) !== this._right(context, condition);
      case "gt" /* GT */:
        return this._left(context, condition) > this._right(context, condition);
      case "gte" /* GTE */:
        return this._left(context, condition) >= this._right(context, condition);
      case "lt" /* LT */:
        return this._left(context, condition) < this._right(context, condition);
      case "lte" /* LTE */:
        return this._left(context, condition) <= this._right(context, condition);
      case "in" /* IN */: {
        const haystack = this._right(context, condition);
        const needle = this._left(context, condition);
        return Array.isArray(haystack) ? haystack.includes(needle) : false;
      }
      case "matches" /* MATCHES */: {
        const value = this._left(context, condition);
        const pattern = this._right(context, condition);
        try {
          return new RegExp(String(pattern)).test(String(value));
        } catch {
          return false;
        }
      }
      default:
        throw new A_WorkflowError({
          title: A_WorkflowError.FunctionError,
          description: `Unknown condition function "${fn}".`
        });
    }
  }
  // ====================================================================
  // ================== Internal Helpers ================================
  // ====================================================================
  /** Resolve the `left` operand of a condition (undefined when omitted). */
  _left(context, condition) {
    return condition.left ? this.resolveValue(context, condition.left) : void 0;
  }
  /** Resolve the `right` operand of a condition (undefined when omitted). */
  _right(context, condition) {
    return condition.right ? this.resolveValue(context, condition.right) : void 0;
  }
  /** Apply a predefined value-transform function to already-resolved args. */
  _applyValueFn(fn, args) {
    switch (fn) {
      case "concat" /* CONCAT */:
        return args.map((a) => a === void 0 || a === null ? "" : String(a)).join("");
      case "uppercase" /* UPPERCASE */:
        return String(args[0] ?? "").toUpperCase();
      case "lowercase" /* LOWERCASE */:
        return String(args[0] ?? "").toLowerCase();
      case "coalesce" /* COALESCE */:
        return args.find((a) => a !== void 0 && a !== null);
      case "now" /* NOW */:
        return (/* @__PURE__ */ new Date()).toISOString();
      case "sum" /* SUM */:
        return args.reduce((acc, a) => acc + (Number(a) || 0), 0);
      case "not" /* NOT */:
        return !args[0];
      case "json" /* JSON */:
        return JSON.stringify(args[0]);
      default:
        throw new A_WorkflowError({
          title: A_WorkflowError.FunctionError,
          description: `Unknown value function "${fn}".`
        });
    }
  }
  /**
   * Read a dot-path from an object. Supports nested objects and numeric
   * array indices (e.g. `steps.list.0.id`). Returns undefined on any
   * missing segment rather than throwing.
   */
  _get(obj, path) {
    if (!path) return void 0;
    let cursor = obj;
    for (const segment of path.split(".")) {
      if (cursor === void 0 || cursor === null) return void 0;
      cursor = cursor[segment];
    }
    return cursor;
  }
  /**
   * Write a value at a dot-path into an object, creating intermediate
   * objects as needed.
   */
  _set(obj, path, value) {
    const segments = path.split(".");
    let cursor = obj;
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      if (cursor[segment] === void 0 || cursor[segment] === null || typeof cursor[segment] !== "object") {
        cursor[segment] = {};
      }
      cursor = cursor[segment];
    }
    cursor[segments[segments.length - 1]] = value;
  }
};
A_WorkflowFunctions = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Predefined, JSON-serialization-safe function library for A-Workflows. Resolves value sources (literal / context-path / named transform), builds remapped step params, and evaluates portable boolean conditions so distributed workflows behave identically on every service."
  })
], A_WorkflowFunctions);
var A_FeatureLoader = class extends A_Component {
  /**
   * Compile a {@link A_TYPES__FeatureLoaderConfig} into an `A_Feature`.
   *
   * @param config  The JSON feature description.
   * @param scope   The scope used to resolve target constructors and to run
   *                the resulting feature. Targets MUST be registered (or
   *                resolvable through inheritance) in this scope.
   * @returns A ready-to-process `A_Feature` bound to `scope`.
   */
  load(config, scope) {
    this._validate(config, scope);
    const template = config.steps.map((step) => this._toStageStep(config.name, step, scope));
    return new A_Feature({
      name: config.name,
      scope,
      template
    });
  }
  // ====================================================================
  // ================== Internal Helpers ================================
  // ====================================================================
  /** Validate the loader config and scope before compilation. */
  _validate(config, scope) {
    if (!config || typeof config !== "object" || typeof config.name !== "string") {
      throw new A_WorkflowError({
        title: A_WorkflowError.FeatureLoaderError,
        description: `Invalid feature loader config: a "name" string is required.`
      });
    }
    if (!Array.isArray(config.steps) || config.steps.length === 0) {
      throw new A_WorkflowError({
        title: A_WorkflowError.FeatureLoaderError,
        description: `Feature "${config.name}" must declare at least one step.`
      });
    }
    if (!(scope instanceof A_Scope)) {
      throw new A_WorkflowError({
        title: A_WorkflowError.FeatureLoaderError,
        description: `A valid A_Scope is required to load feature "${config.name}".`
      });
    }
  }
  /** Convert one loader step into a fully-specified stage step. */
  _toStageStep(featureName, step, scope) {
    if (!step || typeof step.target !== "string" || typeof step.handler !== "string") {
      throw new A_WorkflowError({
        title: A_WorkflowError.FeatureLoaderError,
        description: `Feature "${featureName}" has an invalid step. Each step requires "target" and "handler" strings.`
      });
    }
    const ctor = scope.resolveConstructor(step.target);
    if (!ctor) {
      throw new A_WorkflowError({
        title: A_WorkflowError.ResolutionError,
        description: `Feature "${featureName}" references target "${step.target}" which is not registered in the provided scope.`
      });
    }
    return {
      name: featureName,
      handler: step.handler,
      dependency: new A_Dependency(ctor),
      behavior: step.behavior ?? "sync",
      before: step.before ?? "",
      after: step.after ?? "",
      throwOnError: step.throwOnError ?? true,
      override: ""
    };
  }
};
A_FeatureLoader = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Compiles a JSON feature description (target class names + handler method names) into a runnable A_Feature using the framework template initializer. Enables portable, serialization-safe feature definitions for distributed workflows."
  })
], A_FeatureLoader);
var A_WorkflowStepContext = class extends A_ExecutionContext {
  constructor(stepId, params) {
    super("a-workflow-step-context");
    this.meta.set("stepId", stepId);
    this.meta.set("params", params || {});
  }
  /** Id of the step currently being executed. */
  get stepId() {
    return this.meta.get("stepId");
  }
  /** Remapped params provided to the step handler. */
  get params() {
    return this.meta.get("params") || {};
  }
  /** Result produced by the step handler, if any. */
  get result() {
    return this.meta.get("result");
  }
  /** Error produced by the step handler, if any. */
  get error() {
    return this.meta.get("error");
  }
  /** Whether the step handler reported a result. */
  get hasResult() {
    return this.meta.has("result");
  }
  /** Record a successful result for the step. */
  succeed(result) {
    this.meta.set("result", result);
    return this;
  }
  /** Record a failure for the step. */
  fail(error) {
    this.meta.set("error", error);
    return this;
  }
};
A_WorkflowStepContext = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Per-step input/output context for A-Workflows. Carries the remapped params into a workflow step handler and collects the produced result or error back out so the engine can thread it into the accumulated workflow context."
  })
], A_WorkflowStepContext);

// src/lib/A-Workflows/A-Workflow.entity.ts
var A_Workflow = class extends A_Entity {
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
    return this._context["params" /* PARAMS */] || {};
  }
  /** Per-step results, keyed by step id. */
  get steps() {
    return this._context["steps" /* STEPS */] || {};
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
    return this._status === "COMPLETED" /* COMPLETED */ || this._status === "FAILED" /* FAILED */;
  }
  /** Whether the workflow is paused at a transfer boundary. */
  get isPaused() {
    return this._status === "PAUSED" /* PAUSED */;
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
    if (this._status === "PAUSED" /* PAUSED */) {
      this.resume();
    } else if (this._status === "CREATED" /* CREATED */) {
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
    const functions = this.scope.resolve(A_WorkflowFunctions);
    const loader = this.scope.resolve(A_FeatureLoader);
    while (!this.isDone && this._status === "RUNNING" /* RUNNING */) {
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
    if (this.isDone && this._status === "RUNNING" /* RUNNING */) {
      this.complete();
    }
  }
  /**
   * Execute a single workflow step against an isolated step scope and return
   * the result the step handler produced.
   */
  async _executeStep(step, params, loader) {
    const stepScope = new A_Scope({
      name: `A-Workflow-Step-${step.id}`
    }).inherit(this.scope);
    const context = new A_WorkflowStepContext(step.id, params);
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
          throw new A_WorkflowError({
            title: A_WorkflowError.ResolutionError,
            description: `Step "${step.id}" target "${step.target}" is not registered in scope.`
          });
        }
        const instance = stepScope.resolve(ctor);
        if (!instance) {
          throw new A_WorkflowError({
            title: A_WorkflowError.ResolutionError,
            description: `Step "${step.id}" could not resolve an instance of "${step.target}".`
          });
        }
        return new A_Feature({
          name: step.feature,
          component: instance,
          scope: stepScope
        });
      }
      return new A_Feature({
        name: step.feature,
        component: this,
        scope: stepScope
      });
    }
    throw new A_WorkflowError({
      title: A_WorkflowError.DefinitionError,
      description: `Step "${step.id}" must define either a "template", a "feature" + "target", or a "feature" handled by the workflow itself.`
    });
  }
  /**
   * Apply the step's error behavior. Returns true when the run should
   * continue (the cursor was advanced / redirected), false when the workflow
   * failed.
   */
  _handleStepError(step, rawError) {
    const error = rawError instanceof A_Error ? rawError : new A_WorkflowError({
      title: A_WorkflowError.StepExecutionError,
      description: `Step "${step.id}" failed.`,
      originalError: rawError
    });
    const behavior = step.onError || "fail" /* FAIL */;
    switch (behavior) {
      case "continue" /* CONTINUE */:
        this.recordStepResult(step.id, { error: error.toJSON() }, step.output);
        return true;
      case "goto" /* GOTO */:
        if (!step.onErrorGoto) {
          this.fail(new A_WorkflowError({
            title: A_WorkflowError.DefinitionError,
            description: `Step "${step.id}" uses "goto" error behavior without "onErrorGoto".`,
            originalError: error
          }));
          return false;
        }
        this.goto(step.onErrorGoto);
        return true;
      case "fail" /* FAIL */:
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
    if (this._status === "RUNNING" /* RUNNING */) return;
    if (this._status !== "CREATED" /* CREATED */) {
      throw new A_WorkflowError({
        title: A_WorkflowError.ExecutionError,
        description: `Cannot start workflow "${this.aseid.toString()}" from status "${this._status}".`
      });
    }
    if (!this._startTime) this._startTime = /* @__PURE__ */ new Date();
    this._status = "RUNNING" /* RUNNING */;
    this.emit("onStart" /* onStart */);
  }
  /**
   * Transition RUNNING → PAUSED at a transfer boundary. Emits `onPause`.
   * The caller is expected to serialize the workflow at this point.
   */
  pause() {
    if (this._status !== "RUNNING" /* RUNNING */) return;
    this._status = "PAUSED" /* PAUSED */;
    this.emit("onPause" /* onPause */);
  }
  /**
   * Transition PAUSED → RUNNING after a transfer. Emits `onResume`.
   */
  resume() {
    this.checkScopeInheritance();
    if (this._status === "RUNNING" /* RUNNING */) return;
    if (this._status !== "PAUSED" /* PAUSED */) {
      throw new A_WorkflowError({
        title: A_WorkflowError.ExecutionError,
        description: `Cannot resume workflow "${this.aseid.toString()}" from status "${this._status}".`
      });
    }
    this._status = "RUNNING" /* RUNNING */;
    this.emit("onResume" /* onResume */);
  }
  /**
   * Record a successful step result, mirror it to an optional `output` key,
   * advance the cursor, and emit `onStep`.
   */
  recordStepResult(stepId, result, output) {
    this._context["steps" /* STEPS */][stepId] = result;
    if (output) this._context[output] = result;
    this._cursor++;
    this.emit("onStep" /* onStep */);
  }
  /**
   * Advance the cursor past a skipped step and emit `onSkip`.
   */
  skipStep(stepId) {
    this._cursor++;
    this.emit("onSkip" /* onSkip */);
  }
  /**
   * Move the cursor to the step with the given id (used by `goto` error
   * handling). Throws if the id is unknown.
   */
  goto(stepId) {
    const index = this._definition.steps.findIndex((s) => s.id === stepId);
    if (index === -1) {
      throw new A_WorkflowError({
        title: A_WorkflowError.ResolutionError,
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
    this._status = "COMPLETED" /* COMPLETED */;
    this._endTime = /* @__PURE__ */ new Date();
    this.emit("onComplete" /* onComplete */);
  }
  /**
   * Transition → FAILED. Records the error + end time and emits `onFail`.
   */
  fail(error) {
    if (this.isProcessed) return;
    this._status = "FAILED" /* FAILED */;
    this._error = error;
    this._endTime = /* @__PURE__ */ new Date();
    this.emit("onFail" /* onFail */);
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
      ["params" /* PARAMS */]: {},
      ["steps" /* STEPS */]: {}
    };
    this._createdAt = serialized.createdAt ? new Date(serialized.createdAt) : /* @__PURE__ */ new Date();
    if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
    if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);
    if (serialized.error) this._error = new A_WorkflowError(serialized.error);
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
    this._status = "CREATED" /* CREATED */;
    this._cursor = 0;
    this._createdAt = /* @__PURE__ */ new Date();
    this._context = {
      ["params" /* PARAMS */]: params || {},
      ["steps" /* STEPS */]: {}
    };
    this._buildExecutionScope();
  }
  /** Build (or rebuild) the execution scope with the helper components. */
  _buildExecutionScope() {
    this._executionScope = new A_Scope({
      name: `A-Workflow-Execution-Scope-${this.aseid.toString()}`,
      components: [A_WorkflowFunctions, A_FeatureLoader]
    });
  }
  /** Validate a workflow definition (non-empty, unique step ids). */
  _validateDefinition(definition) {
    if (!definition || typeof definition !== "object" || typeof definition.name !== "string") {
      throw new A_WorkflowError({
        title: A_WorkflowError.DefinitionError,
        description: `A workflow definition with a "name" string is required.`
      });
    }
    if (!Array.isArray(definition.steps) || definition.steps.length === 0) {
      throw new A_WorkflowError({
        title: A_WorkflowError.DefinitionError,
        description: `Workflow "${definition.name}" must declare at least one step.`
      });
    }
    const ids = /* @__PURE__ */ new Set();
    for (const step of definition.steps) {
      if (!step || typeof step.id !== "string" || !step.id) {
        throw new A_WorkflowError({
          title: A_WorkflowError.DefinitionError,
          description: `Workflow "${definition.name}" has a step without a valid "id".`
        });
      }
      if (ids.has(step.id)) {
        throw new A_WorkflowError({
          title: A_WorkflowError.DefinitionError,
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
      attachedScope = A_Context.scope(this);
    } catch (error) {
      throw new A_WorkflowError({
        title: A_WorkflowError.ScopeBindingError,
        description: `Workflow "${this.aseid.toString()}" is not bound to any context scope. Register it before running.`,
        originalError: error
      });
    }
    if (!this._executionScope.isInheritedFrom(attachedScope)) {
      this._executionScope.inherit(attachedScope);
    }
  }
};
A_Workflow = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "A distributed, resumable, self-executing workflow entity. Subclasses declare their recipe via setup() and implement steps as feature handlers, then run() drives execution. Full serialize/deserialize allows pausing on one service and resuming on another with no loss of information."
  })
], A_Workflow);

// src/lib/A-Workflows/A-Workflows.component.ts
var A_Workflows = class extends A_Component {
  /**
   * Build a self-executing {@link A_Workflow} from a plain definition and
   * optional initial params, registering it in the manager's scope so it is
   * ready to run.
   */
  build(definition, params) {
    const scope = this._scope();
    const workflow = new A_Workflow({ definition, params });
    scope.register(workflow);
    return workflow;
  }
  /**
   * Convenience: register (if needed) and run a workflow to its next
   * stopping point. Delegates entirely to {@link A_Workflow.run}.
   */
  async run(workflow) {
    this._ensureRegistered(workflow);
    await workflow.run();
    return workflow;
  }
  /**
   * Convenience: resume a paused / deserialized workflow. Delegates to
   * {@link A_Workflow.run} (which resumes a paused flow).
   */
  async resume(workflow) {
    this._ensureRegistered(workflow);
    if (workflow.status !== "PAUSED" /* PAUSED */ && workflow.status !== "CREATED" /* CREATED */) {
      return workflow;
    }
    await workflow.run();
    return workflow;
  }
  // ====================================================================
  // ================== Helpers =========================================
  // ====================================================================
  /** Resolve the manager's own scope, raising a clear error when unbound. */
  _scope() {
    try {
      return A_Context.scope(this);
    } catch (error) {
      throw new A_WorkflowError({
        title: A_WorkflowError.ScopeBindingError,
        description: `A_Workflows manager is not registered in any scope. Register it before building workflows.`,
        originalError: error
      });
    }
  }
  /** Ensure a workflow is registered in the manager scope before running. */
  _ensureRegistered(workflow) {
    if (!A_Context.has(workflow)) {
      this._scope().register(workflow);
    }
  }
};
A_Workflows = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Optional manager/builder for data-driven workflows. Wraps a plain workflow definition (e.g. compiled from AIS source) into a self-executing A_Workflow entity, registers it, and delegates execution to the entity. Inheritance-based workflows do not need this component."
  })
], A_Workflows);

export { A_FeatureLoader, A_Workflow, A_WorkflowConditionFn, A_WorkflowContextKey, A_WorkflowError, A_WorkflowEvent, A_WorkflowFeatures, A_WorkflowFunctions, A_WorkflowStepContext, A_WorkflowStepErrorBehavior, A_WorkflowValueFn, A_Workflow_Status, A_Workflows };
//# sourceMappingURL=a-workflows.mjs.map
//# sourceMappingURL=a-workflows.mjs.map