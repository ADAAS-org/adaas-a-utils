import { A_Entity, A_Scope, A_Error, A_Feature } from '@adaas/a-concept';
import { A_FeatureLoader } from './A-FeatureLoader.component.mjs';
import { A_Workflow_Status, A_WorkflowEvent } from './A-Workflows.constants.mjs';
import { A_TYPES__Workflow_Init, A_TYPES__Workflow_Serialized, A_TYPES__WorkflowDefinition, A_TYPES__WorkflowContext, A_TYPES__WorkflowStep } from './A-Workflows.types.mjs';

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

export { type A_TYPES__Workflow_Listener, A_Workflow };
