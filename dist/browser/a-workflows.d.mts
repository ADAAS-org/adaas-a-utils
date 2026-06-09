import * as _adaas_a_concept from '@adaas/a-concept';
import { A_TYPES__Error_Serialized, A_TYPES__Entity_Serialized, A_Component, A_Scope, A_Feature, A_Dependency, A_Entity, A_Error } from '@adaas/a-concept';
import { A_ExecutionContext } from './a-execution.mjs';

/**
 * A-Workflows Status Enumeration
 *
 * Defines all possible states a workflow instance can be in during its
 * lifecycle. Workflows progress through these states:
 *
 *   CREATED → RUNNING → (PAUSED ⇄ RUNNING)* → COMPLETED / FAILED
 *
 * The PAUSED state is the distributed-transfer boundary: a workflow can be
 * paused at any step, fully serialized, transferred to another service,
 * deserialized, and resumed from the exact same cursor with the same
 * accumulated context.
 */
declare enum A_Workflow_Status {
    /** Workflow instance created but not yet started. */
    CREATED = "CREATED",
    /** Workflow is actively executing steps. */
    RUNNING = "RUNNING",
    /**
     * Workflow execution is suspended at a transfer boundary. This is the
     * serialize/deserialize handoff point for distributed execution.
     */
    PAUSED = "PAUSED",
    /** All steps executed successfully. */
    COMPLETED = "COMPLETED",
    /** A step failed and the workflow stopped. */
    FAILED = "FAILED"
}
/**
 * A-Workflow Lifecycle Features
 *
 * Extension points that components can implement (via `@A_Feature.Extend`)
 * to inject custom behavior at different stages of a workflow run. The
 * engine ({@link A_Workflows}) dispatches these on the workflow entity.
 */
declare enum A_WorkflowFeatures {
    /** Fired once when a workflow transitions from CREATED to RUNNING. */
    onStart = "_A_Workflow_onStart",
    /** Fired before each individual step is evaluated / executed. */
    onBeforeStep = "_A_Workflow_onBeforeStep",
    /** Fired after each individual step completes (or is skipped). */
    onAfterStep = "_A_Workflow_onAfterStep",
    /** Fired when the workflow is paused at a transfer boundary. */
    onPause = "_A_Workflow_onPause",
    /** Fired when a paused / deserialized workflow is resumed. */
    onResume = "_A_Workflow_onResume",
    /** Fired when every step has completed successfully. */
    onComplete = "_A_Workflow_onComplete",
    /** Fired when a step fails and the workflow stops. */
    onFail = "_A_Workflow_onFail"
}
/**
 * A-Workflow Lifecycle Events
 *
 * Observable events emitted by a workflow instance. Hosts subscribe via
 * `workflow.on(event, listener)` to react to progress without driving the
 * engine themselves (e.g. to stream progress to a UI).
 */
declare enum A_WorkflowEvent {
    onStart = "onStart",
    onStep = "onStep",
    onSkip = "onSkip",
    onPause = "onPause",
    onResume = "onResume",
    onComplete = "onComplete",
    onFail = "onFail"
}
type A_WorkflowEvents = keyof typeof A_WorkflowEvent;
/**
 * Behavior to apply when a workflow step fails.
 */
declare enum A_WorkflowStepErrorBehavior {
    /** Stop the workflow and mark it FAILED (default). */
    FAIL = "fail",
    /** Ignore the error, record it, and continue with the next step. */
    CONTINUE = "continue",
    /** Jump to the step referenced by `onErrorGoto`. */
    GOTO = "goto"
}
/**
 * Predefined CONDITION function identifiers usable in a step's `condition`.
 *
 * They are referenced by string in the (serializable) workflow definition
 * and evaluated by {@link A_WorkflowFunctions}. Keeping them as string ids
 * is what makes a workflow definition portable across services.
 */
declare enum A_WorkflowConditionFn {
    EQUALS = "equals",
    NOT_EQUALS = "notEquals",
    EXISTS = "exists",
    NOT_EXISTS = "notExists",
    TRUTHY = "truthy",
    FALSY = "falsy",
    GT = "gt",
    GTE = "gte",
    LT = "lt",
    LTE = "lte",
    IN = "in",
    MATCHES = "matches",
    AND = "and",
    OR = "or",
    NOT = "not"
}
/**
 * Predefined VALUE-TRANSFORM function identifiers usable in a remap value
 * source's `fn`. Evaluated by {@link A_WorkflowFunctions}.
 */
declare enum A_WorkflowValueFn {
    /** Concatenate the resolved args into a single string. */
    CONCAT = "concat",
    /** Uppercase the resolved string arg. */
    UPPERCASE = "uppercase",
    /** Lowercase the resolved string arg. */
    LOWERCASE = "lowercase",
    /** Return the first non-null/undefined resolved arg. */
    COALESCE = "coalesce",
    /** Current ISO timestamp (ignores args). */
    NOW = "now",
    /** Numeric sum of resolved args. */
    SUM = "sum",
    /** Boolean NOT of the first resolved arg. */
    NOT = "not",
    /** JSON-stringify the first resolved arg. */
    JSON = "json"
}
/**
 * Reserved top-level keys inside the workflow's accumulated context store.
 */
declare enum A_WorkflowContextKey {
    /** Initial parameters the workflow was started with. */
    PARAMS = "params",
    /** Per-step results, keyed by step id. */
    STEPS = "steps"
}

/**
 * A serializable description of HOW to produce a single value from the
 * workflow's accumulated context. This is the atom of the remap / condition
 * system — it never contains executable code, only references and named
 * function ids, so it survives JSON round-trips across services.
 *
 * Exactly one of `value` / `from` / `fn` should be provided:
 *   - `{ value }`  — a literal constant.
 *   - `{ from }`   — a dot-path into the workflow context,
 *                    e.g. `'steps.fetchUser.id'` or `'params.userId'`.
 *   - `{ fn, args }` — apply a predefined {@link A_WorkflowValueFn} to the
 *                    resolved `args` (each of which is itself a value source).
 */
type A_TYPES__WorkflowValueSource = {
    value: any;
    from?: never;
    fn?: never;
    args?: never;
} | {
    from: string;
    value?: never;
    fn?: never;
    args?: never;
} | {
    fn: A_WorkflowValueFn | `${A_WorkflowValueFn}`;
    args?: Array<A_TYPES__WorkflowValueSource>;
    value?: never;
    from?: never;
};
/**
 * A parameter-remap specification. Each KEY is a (dot-path) target on the
 * resulting params object; each VALUE describes how to source it from the
 * workflow context.
 *
 * @example
 * ```ts
 * const remap: A_TYPES__WorkflowRemap = {
 *   userId: { from: 'params.id' },
 *   token:  { from: 'steps.login.token' },
 *   label:  { fn: 'concat', args: [{ value: 'user-' }, { from: 'params.id' }] },
 * };
 * ```
 */
type A_TYPES__WorkflowRemap = Record<string, A_TYPES__WorkflowValueSource>;
/**
 * A serializable boolean expression evaluated against the workflow context
 * by {@link A_WorkflowFunctions}. Used to conditionally run (or skip) a step.
 *
 *   - Comparison fns (`equals`, `gt`, …) use `left` / `right`.
 *   - Unary fns (`exists`, `truthy`, `falsy`, `notExists`) use `left`.
 *   - Logical fns (`and`, `or`, `not`) use nested `conditions`.
 */
type A_TYPES__WorkflowCondition = {
    fn: A_WorkflowConditionFn | `${A_WorkflowConditionFn}`;
    left?: A_TYPES__WorkflowValueSource;
    right?: A_TYPES__WorkflowValueSource;
    conditions?: Array<A_TYPES__WorkflowCondition>;
};
/**
 * One handler reference inside a {@link A_TYPES__FeatureLoaderConfig}. It
 * maps to a single `A_TYPES__A_StageStep` once resolved against a scope.
 */
type A_TYPES__FeatureLoaderStep = {
    /**
     * Class name of the component / entity / container registered in the
     * scope that owns the handler method. Resolved via
     * `scope.resolveConstructor(target)`.
     */
    target: string;
    /** Method name to invoke on the resolved target. */
    handler: string;
    /**
     * Execution behavior. `sync` (default) preserves declaration order;
     * `async` runs independently.
     */
    behavior?: 'sync' | 'async';
    /** Ordering hint — run after the referenced `Class.method`. */
    after?: string;
    /** Ordering hint — run before the referenced `Class.method`. */
    before?: string;
    /** Whether a failure in this handler aborts the feature. Default true. */
    throwOnError?: boolean;
};
/**
 * JSON description of an `A_Feature` that {@link A_FeatureLoader} compiles
 * into an `A_Feature` instance using the framework's template initializer.
 */
type A_TYPES__FeatureLoaderConfig = {
    /** Feature name (used as the stage step `name`). */
    name: string;
    /** Ordered list of handler references that make up the feature. */
    steps: Array<A_TYPES__FeatureLoaderStep>;
};
/**
 * A single node in a workflow definition.
 *
 * A step invokes EITHER:
 *   - a named `feature` on a `target` component/entity registered in scope
 *     (component-based dispatch using `@A_Feature.Extend` handlers), OR
 *   - an inline `template` (a {@link A_TYPES__FeatureLoaderConfig}) compiled
 *     on the fly by {@link A_FeatureLoader}.
 *
 * Before invocation the engine builds the step's input params from `remap`
 * and the workflow context; after invocation the step `result` is stored in
 * the workflow context under `steps.<id>` (and, if set, mirrored to `output`).
 */
type A_TYPES__WorkflowStep = {
    /** Stable, unique-within-workflow identifier. Used as cursor + result key. */
    id: string;
    /** Optional human-readable label. */
    name?: string;
    /** Named feature to call on `target`. Mutually exclusive with `template`. */
    feature?: string;
    /** Class name of the component/entity to use as the feature caller. */
    target?: string;
    /** Inline feature template compiled by {@link A_FeatureLoader}. */
    template?: A_TYPES__FeatureLoaderConfig;
    /** How to build the step params from the workflow context. */
    remap?: A_TYPES__WorkflowRemap;
    /**
     * Optional extra dot-path under which to also store this step's result
     * (in addition to the always-present `steps.<id>`).
     */
    output?: string;
    /** Only run this step when the condition evaluates truthy; else skip. */
    condition?: A_TYPES__WorkflowCondition;
    /**
     * Pause the workflow AFTER this step completes. This is the distributed
     * transfer boundary — serialize the workflow here and resume elsewhere.
     */
    transferAfter?: boolean;
    /** What to do when this step throws. Default `fail`. */
    onError?: A_WorkflowStepErrorBehavior | `${A_WorkflowStepErrorBehavior}`;
    /** Step id to jump to when `onError` is `goto`. */
    onErrorGoto?: string;
};
/**
 * The full, serializable definition of a workflow — the recipe, independent
 * of any runtime state. Safe to author by hand, store, version, and ship.
 */
type A_TYPES__WorkflowDefinition = {
    /** Logical workflow name. */
    name: string;
    /** Ordered list of steps. */
    steps: Array<A_TYPES__WorkflowStep>;
};
/**
 * Constructor payload for a freshly invoked workflow.
 *
 * `definition` is OPTIONAL: an inherited workflow class provides its recipe by
 * overriding `setup()`, so subclasses are typically constructed with just
 * `params` (or nothing at all). Pass an explicit `definition` only for ad-hoc,
 * data-driven workflows built at runtime (e.g. compiled from AIS source).
 */
type A_TYPES__Workflow_Init = {
    /** The workflow recipe. Optional when a subclass provides it via `setup()`. */
    definition?: A_TYPES__WorkflowDefinition;
    /** Initial parameters, exposed in context as `params.*`. */
    params?: Record<string, any>;
};
/**
 * The mutable, accumulated data store carried through a workflow run.
 * Always contains `params` (initial inputs) and `steps` (per-step results).
 */
type A_TYPES__WorkflowContext = {
    params: Record<string, any>;
    steps: Record<string, any>;
    [key: string]: any;
};
/**
 * Full serialized representation of a workflow INSTANCE — definition + live
 * state + accumulated context + error + timing. This is the exact payload
 * transferred between UI → server → execution service → back. Deserializing
 * it on any service with the same registered components yields a workflow
 * that resumes from the same cursor with the same data.
 */
type A_TYPES__Workflow_Serialized = {
    /** Workflow type code (kebab class name). */
    code: string;
    /** The recipe. */
    definition: A_TYPES__WorkflowDefinition;
    /** Current lifecycle status. */
    status: A_Workflow_Status;
    /** Index of the NEXT step to execute. */
    cursor: number;
    /** Accumulated context (params + per-step results). */
    context: A_TYPES__WorkflowContext;
    createdAt: string;
    startedAt?: string;
    endedAt?: string;
    /** Captured failure, if any. */
    error?: A_TYPES__Error_Serialized;
} & A_TYPES__Entity_Serialized;
/**
 * Internal storage shape of {@link A_WorkflowStepContext} — the per-step
 * in/out fragment the engine registers into each step scope. Handlers read
 * `params` and write `result` (via `succeed`) or `error` (via `fail`).
 */
type A_TYPES__WorkflowStepContext_Storage<_Params extends Record<string, any> = Record<string, any>, _Result = any> = {
    /** Id of the step currently being executed. */
    stepId: string;
    /** Remapped params for this step. */
    params: _Params;
    /** Result produced by the step handler(s). */
    result?: _Result;
    /** Live {@link A_Error} instance if the step handler failed. */
    error?: any;
};

/**
 * A_FeatureLoader — compiles a JSON feature description into a runnable
 * `A_Feature` using the framework's template initializer.
 *
 * This is the bridge between a portable, serializable workflow definition
 * and the A-Concept feature pipeline. A workflow step (or any caller) can
 * describe a feature purely as data:
 *
 * ```jsonc
 * {
 *   "name": "charge-card",
 *   "steps": [
 *     { "target": "PaymentGateway", "handler": "authorize" },
 *     { "target": "PaymentGateway", "handler": "capture", "after": "PaymentGateway.authorize" }
 *   ]
 * }
 * ```
 *
 * {@link load} resolves each `target` class name against the provided scope,
 * builds the corresponding `A_Dependency`, assembles the
 * `A_TYPES__A_StageStep[]` template, and returns a `new A_Feature({...})`
 * ready to `process(scope)`.
 *
 * Because the config carries only class names + method names (strings), the
 * same description compiles to an identical feature on any service whose
 * scope registers the referenced components — which is what makes templated
 * workflow steps work across a distributed run.
 */
declare class A_FeatureLoader extends A_Component {
    /**
     * Compile a {@link A_TYPES__FeatureLoaderConfig} into an `A_Feature`.
     *
     * @param config  The JSON feature description.
     * @param scope   The scope used to resolve target constructors and to run
     *                the resulting feature. Targets MUST be registered (or
     *                resolvable through inheritance) in this scope.
     * @returns A ready-to-process `A_Feature` bound to `scope`.
     */
    load(config: A_TYPES__FeatureLoaderConfig, scope: A_Scope): A_Feature;
    /** Validate the loader config and scope before compilation. */
    protected _validate(config: A_TYPES__FeatureLoaderConfig, scope: A_Scope): void;
    /** Convert one loader step into a fully-specified stage step. */
    protected _toStageStep(featureName: string, step: A_TYPES__FeatureLoaderStep, scope: A_Scope): {
        name: string;
        handler: string;
        dependency: A_Dependency<_adaas_a_concept.A_TYPES__A_DependencyInjectable>;
        behavior: "sync" | "async";
        before: string;
        after: string;
        throwOnError: boolean;
        override: string;
    };
}

/**
 * Listener signature for workflow lifecycle events.
 */
type A_TYPES__Workflow_Listener = (workflow: A_Workflow) => void;
/**
 * A_Workflow — a distributed, resumable, **self-executing** workflow entity.
 *
 * ## The native A-Concept pattern: inherit & define
 * A workflow is meant to be used by INHERITANCE — you subclass `A_Workflow`,
 * declare the recipe by overriding {@link setup}, and implement each step as a
 * `@A_Feature.Extend()` handler method on the subclass itself:
 *
 * ```ts
 * @A_Frame.Define({ namespace: 'App' })
 * class DailyAggregation extends A_Workflow {
 *     protected setup(): A_TYPES__WorkflowDefinition {
 *         return {
 *             name: 'Daily stats aggregation',
 *             steps: [
 *                 { id: 'aggregate', feature: 'aggregate', transferAfter: true },
 *                 { id: 'store', feature: 'store', remap: { data: { from: 'steps.aggregate' } } },
 *             ],
 *         };
 *     }
 *
 *     @A_Feature.Extend()
 *     async aggregate(@A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext) {
 *         ctx.succeed({ count: 42 });
 *     }
 *
 *     @A_Feature.Extend()
 *     async store(@A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext) {
 *         ctx.succeed({ stored: true, data: ctx.params.data });
 *     }
 * }
 *
 * const wf = new DailyAggregation({ params: { date: '2026-06-09' } });
 * scope.register(wf);
 * await wf.run();
 * ```
 *
 * Because the step handlers live on the entity, they resolve dependencies
 * through the entity's own scope — exactly the reason the inheritance form is
 * preferred over an external engine driving a plain data definition.
 *
 * ## Distributed execution & native chaining
 * The entity mirrors {@link A_Command}'s distributed model: it tracks an
 * `_origin` ('invoked' | 'serialized') and rebuilds its `_executionScope` in
 * {@link fromNew}, {@link fromUndefined} and {@link fromJSON}. A workflow can
 * be paused at a transfer boundary ({@link A_Workflow_Status.PAUSED}),
 * serialized via {@link toJSON}, shipped to another service (UI → server →
 * execution service → back), reconstructed there with `new MyWorkflow(json)`,
 * and resumed via {@link resume} from the exact same cursor with the same
 * accumulated context. The subclass supplies the logic on every hop; only the
 * lightweight state travels on the wire.
 *
 * The execution scope always registers {@link A_WorkflowFunctions} and
 * {@link A_FeatureLoader}, so a deserialized workflow is self-contained for
 * remap / condition evaluation and templated steps.
 *
 * ## Data-driven form
 * For dynamic workflows (e.g. compiled from AIS source into a pure data
 * definition with no dedicated class), pass the `definition` to the
 * constructor instead of overriding `setup()`. {@link A_Workflows.build}
 * uses this form.
 */
declare class A_Workflow extends A_Entity<A_TYPES__Workflow_Init, A_TYPES__Workflow_Serialized> {
    /** Static workflow type code derived from the class name. */
    static get code(): string;
    /** Whether the instance was freshly invoked or restored from serialization. */
    protected _origin: 'invoked' | 'serialized';
    /** Execution scope hosting workflow helper components. */
    protected _executionScope: A_Scope;
    /** The immutable workflow recipe. */
    protected _definition: A_TYPES__WorkflowDefinition;
    /** Current lifecycle status. */
    protected _status: A_Workflow_Status;
    /** Index of the NEXT step to execute. */
    protected _cursor: number;
    /** Accumulated data store (`params` + per-step `steps`). */
    protected _context: A_TYPES__WorkflowContext;
    /** Captured failure, if any. */
    protected _error?: A_Error;
    /** Timing. */
    protected _createdAt: Date;
    protected _startTime?: Date;
    protected _endTime?: Date;
    /** Event listeners by event name. */
    protected _listeners: Map<A_WorkflowEvent, Set<A_TYPES__Workflow_Listener>>;
    /** Unique workflow type identifier (kebab class name). */
    get code(): string;
    /** Execution scope hosting workflow helper components. */
    get scope(): A_Scope;
    /** The immutable workflow recipe. */
    get definition(): A_TYPES__WorkflowDefinition;
    /** Current lifecycle status. */
    get status(): A_Workflow_Status;
    /** Index of the NEXT step to execute. */
    get cursor(): number;
    /** Accumulated data store. */
    get context(): A_TYPES__WorkflowContext;
    /** Captured failure, if any. */
    get error(): A_Error | undefined;
    /** Initial parameters the workflow was started with. */
    get params(): Record<string, any>;
    /** Per-step results, keyed by step id. */
    get steps(): Record<string, any>;
    /** The step the cursor currently points at, or undefined when done. */
    get currentStep(): A_TYPES__WorkflowStep | undefined;
    /** Whether the cursor has advanced past the final step. */
    get isDone(): boolean;
    /** Whether the workflow has reached a terminal status. */
    get isProcessed(): boolean;
    /** Whether the workflow is paused at a transfer boundary. */
    get isPaused(): boolean;
    /** Timestamps. */
    get createdAt(): Date;
    get startedAt(): Date | undefined;
    get endedAt(): Date | undefined;
    /** Total (or elapsed) execution duration in milliseconds. */
    get duration(): number | undefined;
    /**
     * Final result of the workflow — the accumulated context once complete.
     */
    get result(): A_TYPES__WorkflowContext;
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
    protected setup(): A_TYPES__WorkflowDefinition | void;
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
    run(): Promise<this>;
    /**
     * Resume a paused / freshly-deserialized workflow — typically on a
     * different service after transfer. Semantically identical to {@link run}
     * for a paused flow, but named for intent at distributed call sites.
     */
    resumeRun(): Promise<this>;
    /** Drive the workflow forward from its current cursor. */
    protected _runLoop(): Promise<void>;
    /**
     * Execute a single workflow step against an isolated step scope and return
     * the result the step handler produced.
     */
    protected _executeStep(step: A_TYPES__WorkflowStep, params: Record<string, any>, loader: A_FeatureLoader): Promise<any>;
    /**
     * Build the `A_Feature` for a step.
     *
     * Resolution order:
     *   1. inline `template`  → compiled via {@link A_FeatureLoader},
     *   2. `feature` + `target` → named feature on a registered component,
     *   3. `feature` only      → named feature on THIS workflow entity (the
     *      inheritance form — the handler lives on the subclass).
     */
    protected _buildStepFeature(step: A_TYPES__WorkflowStep, stepScope: A_Scope, loader: A_FeatureLoader): A_Feature;
    /**
     * Apply the step's error behavior. Returns true when the run should
     * continue (the cursor was advanced / redirected), false when the workflow
     * failed.
     */
    protected _handleStepError(step: A_TYPES__WorkflowStep, rawError: unknown): boolean;
    /**
     * Transition CREATED → RUNNING (idempotent for an already-running flow).
     * Records the start time on first run and emits `onStart`.
     */
    start(): void;
    /**
     * Transition RUNNING → PAUSED at a transfer boundary. Emits `onPause`.
     * The caller is expected to serialize the workflow at this point.
     */
    pause(): void;
    /**
     * Transition PAUSED → RUNNING after a transfer. Emits `onResume`.
     */
    resume(): void;
    /**
     * Record a successful step result, mirror it to an optional `output` key,
     * advance the cursor, and emit `onStep`.
     */
    recordStepResult(stepId: string, result: any, output?: string): void;
    /**
     * Advance the cursor past a skipped step and emit `onSkip`.
     */
    skipStep(stepId: string): void;
    /**
     * Move the cursor to the step with the given id (used by `goto` error
     * handling). Throws if the id is unknown.
     */
    goto(stepId: string): void;
    /**
     * Transition RUNNING → COMPLETED. Records the end time and emits
     * `onComplete`.
     */
    complete(): void;
    /**
     * Transition → FAILED. Records the error + end time and emits `onFail`.
     */
    fail(error: A_Error): void;
    /** Subscribe to a workflow lifecycle event. */
    on(event: A_WorkflowEvent, listener: A_TYPES__Workflow_Listener): void;
    /** Unsubscribe from a workflow lifecycle event. */
    off(event: A_WorkflowEvent, listener: A_TYPES__Workflow_Listener): void;
    /** Emit a workflow lifecycle event to all listeners. */
    emit(event: A_WorkflowEvent): void;
    /**
     * Construct a fresh, class-defined workflow with no constructor argument.
     * The recipe comes from {@link setup}.
     */
    fromUndefined(): void;
    fromNew(newEntity: A_TYPES__Workflow_Init): void;
    fromJSON(serialized: A_TYPES__Workflow_Serialized): void;
    toJSON(): A_TYPES__Workflow_Serialized;
    /** Shared fresh-instance initialization for `fromNew` / `fromUndefined`. */
    protected _initFresh(definition: A_TYPES__WorkflowDefinition | undefined, params: Record<string, any> | undefined): void;
    /** Build (or rebuild) the execution scope with the helper components. */
    protected _buildExecutionScope(): void;
    /** Validate a workflow definition (non-empty, unique step ids). */
    protected _validateDefinition(definition?: A_TYPES__WorkflowDefinition): void;
    /**
     * Ensure the execution scope inherits from the scope this entity is
     * registered in. Throws when the workflow is not bound to any scope.
     */
    protected checkScopeInheritance(): void;
}

/**
 * A_Workflows — an OPTIONAL manager / builder for the **data-driven** form of
 * workflows.
 *
 * The native, preferred way to use workflows is by inheritance: subclass
 * {@link A_Workflow}, declare the recipe via `setup()`, implement steps as
 * feature handlers, then call `workflow.run()` directly on the entity. No
 * engine is needed for that — the entity is self-executing.
 *
 * This component exists for the cases where the recipe is NOT known at compile
 * time and arrives as plain data — e.g. a workflow compiled from AIS source
 * (`Workflow('...'){ref:...}`) into a `A_TYPES__WorkflowDefinition`. It simply
 * wraps such a definition into a generic {@link A_Workflow}, registers it in
 * the manager's scope, and delegates execution to the entity itself.
 */
declare class A_Workflows extends A_Component {
    /**
     * Build a self-executing {@link A_Workflow} from a plain definition and
     * optional initial params, registering it in the manager's scope so it is
     * ready to run.
     */
    build(definition: A_TYPES__WorkflowDefinition, params?: Record<string, any>): A_Workflow;
    /**
     * Convenience: register (if needed) and run a workflow to its next
     * stopping point. Delegates entirely to {@link A_Workflow.run}.
     */
    run(workflow: A_Workflow): Promise<A_Workflow>;
    /**
     * Convenience: resume a paused / deserialized workflow. Delegates to
     * {@link A_Workflow.run} (which resumes a paused flow).
     */
    resume(workflow: A_Workflow): Promise<A_Workflow>;
    /** Resolve the manager's own scope, raising a clear error when unbound. */
    protected _scope(): A_Scope;
    /** Ensure a workflow is registered in the manager scope before running. */
    protected _ensureRegistered(workflow: A_Workflow): void;
}

/**
 * A_WorkflowFunctions — the predefined, serialization-safe function library
 * powering parameter remapping and conditional step execution.
 *
 * A workflow definition never carries executable code (it must survive JSON
 * transfer across services). Instead it references VALUES by dot-path and
 * BEHAVIOR by string id. This component is the single place those ids are
 * interpreted, so every service in a distributed run evaluates them
 * identically.
 *
 * Three public capabilities:
 *   - {@link resolveValue} — turn a single {@link A_TYPES__WorkflowValueSource}
 *     into a concrete value against the workflow context.
 *   - {@link remap} — build a full params object from a remap spec.
 *   - {@link evaluate} — evaluate a boolean {@link A_TYPES__WorkflowCondition}.
 *
 * All logic lives on this component (per the strict A-Concept "no loose
 * helper functions" rule); the string ids are merely dispatched internally.
 */
declare class A_WorkflowFunctions extends A_Component {
    /**
     * Resolve a single value source against the workflow `context`.
     *
     *   - `{ value }`     → the literal.
     *   - `{ from }`      → dot-path lookup into context (undefined if absent).
     *   - `{ fn, args }`  → apply the named {@link A_WorkflowValueFn} to the
     *                       resolved args.
     */
    resolveValue(context: Record<string, any>, source: A_TYPES__WorkflowValueSource): any;
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
    remap(context: Record<string, any>, spec?: A_TYPES__WorkflowRemap): Record<string, any>;
    /**
     * Evaluate a boolean condition against the workflow `context`. Unknown
     * function ids throw an {@link A_WorkflowError}.
     */
    evaluate(context: Record<string, any>, condition?: A_TYPES__WorkflowCondition): boolean;
    /** Resolve the `left` operand of a condition (undefined when omitted). */
    protected _left(context: Record<string, any>, condition: A_TYPES__WorkflowCondition): any;
    /** Resolve the `right` operand of a condition (undefined when omitted). */
    protected _right(context: Record<string, any>, condition: A_TYPES__WorkflowCondition): any;
    /** Apply a predefined value-transform function to already-resolved args. */
    protected _applyValueFn(fn: string, args: any[]): any;
    /**
     * Read a dot-path from an object. Supports nested objects and numeric
     * array indices (e.g. `steps.list.0.id`). Returns undefined on any
     * missing segment rather than throwing.
     */
    protected _get(obj: Record<string, any>, path: string): any;
    /**
     * Write a value at a dot-path into an object, creating intermediate
     * objects as needed.
     */
    protected _set(obj: Record<string, any>, path: string, value: any): void;
}

/**
 * A_WorkflowStepContext — the per-step input/output channel.
 *
 * The engine ({@link A_Workflows}) registers ONE of these into the isolated
 * scope it builds for each step, carrying the remapped `params` IN. A step's
 * handler (a `@A_Feature.Extend` method on the target component/entity) reads
 * `params` via `@A_Inject(A_WorkflowStepContext)` and writes its outcome back
 * via `succeed(result)` / `fail(error)`. The engine then lifts `result` out
 * and stores it in the workflow's accumulated context under `steps.<id>`.
 *
 * Modelled on {@link A_OperationContext} (A_Fragment + A_Meta) so the same
 * "params in / result out" ergonomics apply across the library.
 */
declare class A_WorkflowStepContext<_Params extends Record<string, any> = Record<string, any>, _Result = any> extends A_ExecutionContext<A_TYPES__WorkflowStepContext_Storage<_Params, _Result>> {
    constructor(stepId: string, params?: _Params);
    /** Id of the step currently being executed. */
    get stepId(): string;
    /** Remapped params provided to the step handler. */
    get params(): _Params;
    /** Result produced by the step handler, if any. */
    get result(): _Result | undefined;
    /** Error produced by the step handler, if any. */
    get error(): A_Error | undefined;
    /** Whether the step handler reported a result. */
    get hasResult(): boolean;
    /** Record a successful result for the step. */
    succeed(result: _Result): this;
    /** Record a failure for the step. */
    fail(error: A_Error): this;
}

/**
 * Error type for all A-Workflows failures. Mirrors the convention used by
 * {@link A_CommandError} / {@link A_StateMachineError}: static string titles
 * are used as the error `title` so sinks can branch on a stable code.
 */
declare class A_WorkflowError extends A_Error {
    /** The workflow instance is not registered in any scope. */
    static readonly ScopeBindingError = "A-Workflow Scope Binding Error";
    /** A workflow definition is missing/invalid (no steps, duplicate ids, …). */
    static readonly DefinitionError = "A-Workflow Definition Error";
    /** A step references a target / feature / step id that cannot be resolved. */
    static readonly ResolutionError = "A-Workflow Resolution Error";
    /** A predefined remap / condition function id is unknown. */
    static readonly FunctionError = "A-Workflow Function Error";
    /** A feature template provided to the loader is invalid. */
    static readonly FeatureLoaderError = "A-Workflow Feature Loader Error";
    /** A step handler threw while executing. */
    static readonly StepExecutionError = "A-Workflow Step Execution Error";
    /** The workflow run failed as a whole. */
    static readonly ExecutionError = "A-Workflow Execution Error";
}

export { A_FeatureLoader, type A_TYPES__FeatureLoaderConfig, type A_TYPES__FeatureLoaderStep, type A_TYPES__WorkflowCondition, type A_TYPES__WorkflowContext, type A_TYPES__WorkflowDefinition, type A_TYPES__WorkflowRemap, type A_TYPES__WorkflowStep, type A_TYPES__WorkflowStepContext_Storage, type A_TYPES__WorkflowValueSource, type A_TYPES__Workflow_Init, type A_TYPES__Workflow_Listener, type A_TYPES__Workflow_Serialized, A_Workflow, A_WorkflowConditionFn, A_WorkflowContextKey, A_WorkflowError, A_WorkflowEvent, type A_WorkflowEvents, A_WorkflowFeatures, A_WorkflowFunctions, A_WorkflowStepContext, A_WorkflowStepErrorBehavior, A_WorkflowValueFn, A_Workflow_Status, A_Workflows };
