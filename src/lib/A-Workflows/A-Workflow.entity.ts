import {
    A_Context,
    A_Entity,
    A_Error,
    A_Feature,
    A_Scope,
} from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import { A_WorkflowFunctions } from "./A-WorkflowFunctions.component";
import { A_FeatureLoader } from "./A-FeatureLoader.component";
import { A_WorkflowStepContext } from "./A-WorkflowStepContext.context";
import { A_WorkflowError } from "./A-Workflows.error";
import {
    A_Workflow_Status,
    A_WorkflowContextKey,
    A_WorkflowEvent,
    A_WorkflowStepErrorBehavior,
} from "./A-Workflows.constants";
import {
    A_TYPES__Workflow_Init,
    A_TYPES__Workflow_Serialized,
    A_TYPES__WorkflowContext,
    A_TYPES__WorkflowDefinition,
    A_TYPES__WorkflowStep,
} from "./A-Workflows.types";


/**
 * Listener signature for workflow lifecycle events.
 */
export type A_TYPES__Workflow_Listener = (workflow: A_Workflow) => void;


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
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'A distributed, resumable, self-executing workflow entity. Subclasses declare their recipe via setup() and implement steps as feature handlers, then run() drives execution. Full serialize/deserialize allows pausing on one service and resuming on another with no loss of information.'
})
export class A_Workflow extends A_Entity<
    A_TYPES__Workflow_Init,
    A_TYPES__Workflow_Serialized
> {

    // ====================================================================
    // ================== Static Information ==============================
    // ====================================================================

    /** Static workflow type code derived from the class name. */
    static get code(): string {
        return super.entity;
    }

    // ====================================================================
    // ================== Instance State ==================================
    // ====================================================================

    /** Whether the instance was freshly invoked or restored from serialization. */
    protected _origin!: 'invoked' | 'serialized';

    /** Execution scope hosting workflow helper components. */
    protected _executionScope!: A_Scope;

    /** The immutable workflow recipe. */
    protected _definition!: A_TYPES__WorkflowDefinition;

    /** Current lifecycle status. */
    protected _status!: A_Workflow_Status;

    /** Index of the NEXT step to execute. */
    protected _cursor!: number;

    /** Accumulated data store (`params` + per-step `steps`). */
    protected _context!: A_TYPES__WorkflowContext;

    /** Captured failure, if any. */
    protected _error?: A_Error;

    /** Timing. */
    protected _createdAt!: Date;
    protected _startTime?: Date;
    protected _endTime?: Date;

    /** Event listeners by event name. */
    protected _listeners: Map<A_WorkflowEvent, Set<A_TYPES__Workflow_Listener>> = new Map();

    // ====================================================================
    // ================== Getters =========================================
    // ====================================================================

    /** Unique workflow type identifier (kebab class name). */
    get code(): string {
        return (this.constructor as typeof A_Workflow).code;
    }

    /** Execution scope hosting workflow helper components. */
    get scope(): A_Scope {
        return this._executionScope;
    }

    /** The immutable workflow recipe. */
    get definition(): A_TYPES__WorkflowDefinition {
        return this._definition;
    }

    /** Current lifecycle status. */
    get status(): A_Workflow_Status {
        return this._status;
    }

    /** Index of the NEXT step to execute. */
    get cursor(): number {
        return this._cursor;
    }

    /** Accumulated data store. */
    get context(): A_TYPES__WorkflowContext {
        return this._context;
    }

    /** Captured failure, if any. */
    get error(): A_Error | undefined {
        return this._error;
    }

    /** Initial parameters the workflow was started with. */
    get params(): Record<string, any> {
        return this._context[A_WorkflowContextKey.PARAMS] || {};
    }

    /** Per-step results, keyed by step id. */
    get steps(): Record<string, any> {
        return this._context[A_WorkflowContextKey.STEPS] || {};
    }

    /** The step the cursor currently points at, or undefined when done. */
    get currentStep(): A_TYPES__WorkflowStep | undefined {
        return this._definition.steps[this._cursor];
    }

    /** Whether the cursor has advanced past the final step. */
    get isDone(): boolean {
        return this._cursor >= this._definition.steps.length;
    }

    /** Whether the workflow has reached a terminal status. */
    get isProcessed(): boolean {
        return this._status === A_Workflow_Status.COMPLETED
            || this._status === A_Workflow_Status.FAILED;
    }

    /** Whether the workflow is paused at a transfer boundary. */
    get isPaused(): boolean {
        return this._status === A_Workflow_Status.PAUSED;
    }

    /** Timestamps. */
    get createdAt(): Date { return this._createdAt; }
    get startedAt(): Date | undefined { return this._startTime; }
    get endedAt(): Date | undefined { return this._endTime; }

    /** Total (or elapsed) execution duration in milliseconds. */
    get duration(): number | undefined {
        return this._endTime && this._startTime
            ? this._endTime.getTime() - this._startTime.getTime()
            : this._startTime
                ? Date.now() - this._startTime.getTime()
                : undefined;
    }

    /**
     * Final result of the workflow — the accumulated context once complete.
     */
    get result(): A_TYPES__WorkflowContext {
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
    protected setup(): A_TYPES__WorkflowDefinition | void {
        return undefined;
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
    async run(): Promise<this> {
        if (this.isProcessed) return this;

        if (this._status === A_Workflow_Status.PAUSED) {
            this.resume();
        } else if (this._status === A_Workflow_Status.CREATED) {
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
    async resumeRun(): Promise<this> {
        return this.run();
    }

    /** Drive the workflow forward from its current cursor. */
    protected async _runLoop(): Promise<void> {
        const functions = this.scope.resolve(A_WorkflowFunctions)!;
        const loader = this.scope.resolve(A_FeatureLoader)!;

        while (!this.isDone && this._status === A_Workflow_Status.RUNNING) {
            const step = this.currentStep!;

            // 1) Conditional execution — skip when the condition is falsy.
            if (step.condition && !functions.evaluate(this._context, step.condition)) {
                this.skipStep(step.id);
                continue;
            }

            // 2) Build step params from the accumulated context.
            const params = functions.remap(this._context, step.remap);

            // 3) Execute the step.
            try {
                const result = await this._executeStep(step, params, loader);
                this.recordStepResult(step.id, result, step.output);
            } catch (error) {
                const handled = this._handleStepError(step, error);
                if (!handled) return; // failed
                continue; // continue / goto already adjusted the cursor
            }

            // 4) Transfer boundary — pause for serialization & handoff.
            if (step.transferAfter && !this.isDone) {
                this.pause();
                return;
            }
        }

        if (this.isDone && this._status === A_Workflow_Status.RUNNING) {
            this.complete();
        }
    }

    /**
     * Execute a single workflow step against an isolated step scope and return
     * the result the step handler produced.
     */
    protected async _executeStep(
        step: A_TYPES__WorkflowStep,
        params: Record<string, any>,
        loader: A_FeatureLoader
    ): Promise<any> {
        const stepScope = new A_Scope({
            name: `A-Workflow-Step-${step.id}`,
        }).inherit(this.scope);

        const context = new A_WorkflowStepContext(step.id, params);
        stepScope.register(context);

        try {
            const feature = this._buildStepFeature(step, stepScope, loader);

            await feature.process(stepScope);

            if (context.error) throw context.error;

            return context.hasResult ? context.result : undefined;
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
    protected _buildStepFeature(
        step: A_TYPES__WorkflowStep,
        stepScope: A_Scope,
        loader: A_FeatureLoader
    ): A_Feature {
        // 1) Inline template → compile via the feature loader.
        if (step.template) {
            return loader.load(
                { name: step.template.name || step.id, steps: step.template.steps },
                stepScope
            );
        }

        if (step.feature) {
            // 2) Named feature on an explicit, registered target.
            if (step.target) {
                const ctor = stepScope.resolveConstructor(step.target);
                if (!ctor) {
                    throw new A_WorkflowError({
                        title: A_WorkflowError.ResolutionError,
                        description: `Step "${step.id}" target "${step.target}" is not registered in scope.`,
                    });
                }

                const instance = stepScope.resolve(ctor as any);
                if (!instance) {
                    throw new A_WorkflowError({
                        title: A_WorkflowError.ResolutionError,
                        description: `Step "${step.id}" could not resolve an instance of "${step.target}".`,
                    });
                }

                return new A_Feature({
                    name: step.feature,
                    component: instance as any,
                    scope: stepScope,
                });
            }

            // 3) Named feature on THIS workflow entity (inheritance form).
            return new A_Feature({
                name: step.feature,
                component: this,
                scope: stepScope,
            });
        }

        throw new A_WorkflowError({
            title: A_WorkflowError.DefinitionError,
            description: `Step "${step.id}" must define either a "template", a "feature" + "target", or a "feature" handled by the workflow itself.`,
        });
    }

    /**
     * Apply the step's error behavior. Returns true when the run should
     * continue (the cursor was advanced / redirected), false when the workflow
     * failed.
     */
    protected _handleStepError(
        step: A_TYPES__WorkflowStep,
        rawError: unknown
    ): boolean {
        const error = rawError instanceof A_Error
            ? rawError
            : new A_WorkflowError({
                title: A_WorkflowError.StepExecutionError,
                description: `Step "${step.id}" failed.`,
                originalError: rawError,
            });

        const behavior = step.onError || A_WorkflowStepErrorBehavior.FAIL;

        switch (behavior) {
            case A_WorkflowStepErrorBehavior.CONTINUE:
                this.recordStepResult(step.id, { error: error.toJSON() }, step.output);
                return true;

            case A_WorkflowStepErrorBehavior.GOTO:
                if (!step.onErrorGoto) {
                    this.fail(new A_WorkflowError({
                        title: A_WorkflowError.DefinitionError,
                        description: `Step "${step.id}" uses "goto" error behavior without "onErrorGoto".`,
                        originalError: error,
                    }));
                    return false;
                }
                this.goto(step.onErrorGoto);
                return true;

            case A_WorkflowStepErrorBehavior.FAIL:
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
    start(): void {
        this.checkScopeInheritance();

        if (this._status === A_Workflow_Status.RUNNING) return;

        if (this._status !== A_Workflow_Status.CREATED) {
            throw new A_WorkflowError({
                title: A_WorkflowError.ExecutionError,
                description: `Cannot start workflow "${this.aseid.toString()}" from status "${this._status}".`,
            });
        }

        if (!this._startTime) this._startTime = new Date();
        this._status = A_Workflow_Status.RUNNING;
        this.emit(A_WorkflowEvent.onStart);
    }

    /**
     * Transition RUNNING → PAUSED at a transfer boundary. Emits `onPause`.
     * The caller is expected to serialize the workflow at this point.
     */
    pause(): void {
        if (this._status !== A_Workflow_Status.RUNNING) return;
        this._status = A_Workflow_Status.PAUSED;
        this.emit(A_WorkflowEvent.onPause);
    }

    /**
     * Transition PAUSED → RUNNING after a transfer. Emits `onResume`.
     */
    resume(): void {
        this.checkScopeInheritance();

        if (this._status === A_Workflow_Status.RUNNING) return;

        if (this._status !== A_Workflow_Status.PAUSED) {
            throw new A_WorkflowError({
                title: A_WorkflowError.ExecutionError,
                description: `Cannot resume workflow "${this.aseid.toString()}" from status "${this._status}".`,
            });
        }

        this._status = A_Workflow_Status.RUNNING;
        this.emit(A_WorkflowEvent.onResume);
    }

    /**
     * Record a successful step result, mirror it to an optional `output` key,
     * advance the cursor, and emit `onStep`.
     */
    recordStepResult(stepId: string, result: any, output?: string): void {
        this._context[A_WorkflowContextKey.STEPS][stepId] = result;
        if (output) this._context[output] = result;
        this._cursor++;
        this.emit(A_WorkflowEvent.onStep);
    }

    /**
     * Advance the cursor past a skipped step and emit `onSkip`.
     */
    skipStep(stepId: string): void {
        this._cursor++;
        this.emit(A_WorkflowEvent.onSkip);
    }

    /**
     * Move the cursor to the step with the given id (used by `goto` error
     * handling). Throws if the id is unknown.
     */
    goto(stepId: string): void {
        const index = this._definition.steps.findIndex(s => s.id === stepId);
        if (index === -1) {
            throw new A_WorkflowError({
                title: A_WorkflowError.ResolutionError,
                description: `Cannot jump to unknown step "${stepId}" in workflow "${this.aseid.toString()}".`,
            });
        }
        this._cursor = index;
    }

    /**
     * Transition RUNNING → COMPLETED. Records the end time and emits
     * `onComplete`.
     */
    complete(): void {
        if (this.isProcessed) return;
        this._status = A_Workflow_Status.COMPLETED;
        this._endTime = new Date();
        this.emit(A_WorkflowEvent.onComplete);
    }

    /**
     * Transition → FAILED. Records the error + end time and emits `onFail`.
     */
    fail(error: A_Error): void {
        if (this.isProcessed) return;
        this._status = A_Workflow_Status.FAILED;
        this._error = error;
        this._endTime = new Date();
        this.emit(A_WorkflowEvent.onFail);
    }

    // ====================================================================
    // ================== Event Emitter ===================================
    // ====================================================================

    /** Subscribe to a workflow lifecycle event. */
    on(event: A_WorkflowEvent, listener: A_TYPES__Workflow_Listener): void {
        if (!this._listeners.has(event)) this._listeners.set(event, new Set());
        this._listeners.get(event)!.add(listener);
    }

    /** Unsubscribe from a workflow lifecycle event. */
    off(event: A_WorkflowEvent, listener: A_TYPES__Workflow_Listener): void {
        this._listeners.get(event)?.delete(listener);
    }

    /** Emit a workflow lifecycle event to all listeners. */
    emit(event: A_WorkflowEvent): void {
        this._listeners.get(event)?.forEach(listener => listener(this));
    }

    // ====================================================================
    // ================== Serialization ===================================
    // ====================================================================

    /**
     * Construct a fresh, class-defined workflow with no constructor argument.
     * The recipe comes from {@link setup}.
     */
    fromUndefined(): void {
        super.fromUndefined();
        this._initFresh(undefined, undefined);
    }

    fromNew(newEntity: A_TYPES__Workflow_Init): void {
        super.fromNew(newEntity);
        this._initFresh(newEntity?.definition, newEntity?.params);
    }

    fromJSON(serialized: A_TYPES__Workflow_Serialized): void {
        super.fromJSON(serialized);

        // Prefer the class-provided recipe (logic authority lives in code, not
        // on the wire); fall back to the serialized definition for data-driven
        // workflows that have no dedicated class.
        const definition = (this.setup() || serialized.definition) as A_TYPES__WorkflowDefinition;
        this._validateDefinition(definition);

        this._origin = 'serialized';
        this._definition = definition;
        this._status = serialized.status;
        this._cursor = serialized.cursor;
        this._context = serialized.context || {
            [A_WorkflowContextKey.PARAMS]: {},
            [A_WorkflowContextKey.STEPS]: {},
        };

        this._createdAt = serialized.createdAt ? new Date(serialized.createdAt) : new Date();
        if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
        if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);

        if (serialized.error) this._error = new A_WorkflowError(serialized.error);

        this._buildExecutionScope();
    }

    toJSON(): A_TYPES__Workflow_Serialized {
        return {
            ...super.toJSON(),
            code: this.code,
            definition: this._definition,
            status: this._status,
            cursor: this._cursor,
            context: this._context,
            createdAt: this._createdAt.toISOString(),
            startedAt: this._startTime ? this._startTime.toISOString() : undefined,
            endedAt: this._endTime ? this._endTime.toISOString() : undefined,
            error: this._error ? this._error.toJSON() : undefined,
        };
    }

    // ====================================================================
    // ================== Helpers =========================================
    // ====================================================================

    /** Shared fresh-instance initialization for `fromNew` / `fromUndefined`. */
    protected _initFresh(
        definition: A_TYPES__WorkflowDefinition | undefined,
        params: Record<string, any> | undefined
    ): void {
        // The class recipe (setup) wins; the constructor definition is the
        // data-driven fallback.
        const resolved = (this.setup() || definition) as A_TYPES__WorkflowDefinition;
        this._validateDefinition(resolved);

        this._origin = 'invoked';
        this._definition = resolved;
        this._status = A_Workflow_Status.CREATED;
        this._cursor = 0;
        this._createdAt = new Date();
        this._context = {
            [A_WorkflowContextKey.PARAMS]: params || {},
            [A_WorkflowContextKey.STEPS]: {},
        };

        this._buildExecutionScope();
    }

    /** Build (or rebuild) the execution scope with the helper components. */
    protected _buildExecutionScope(): void {
        this._executionScope = new A_Scope({
            name: `A-Workflow-Execution-Scope-${this.aseid.toString()}`,
            components: [A_WorkflowFunctions, A_FeatureLoader],
        });
    }

    /** Validate a workflow definition (non-empty, unique step ids). */
    protected _validateDefinition(definition?: A_TYPES__WorkflowDefinition): void {
        if (!definition || typeof definition !== 'object' || typeof definition.name !== 'string') {
            throw new A_WorkflowError({
                title: A_WorkflowError.DefinitionError,
                description: `A workflow definition with a "name" string is required.`,
            });
        }

        if (!Array.isArray(definition.steps) || definition.steps.length === 0) {
            throw new A_WorkflowError({
                title: A_WorkflowError.DefinitionError,
                description: `Workflow "${definition.name}" must declare at least one step.`,
            });
        }

        const ids = new Set<string>();
        for (const step of definition.steps) {
            if (!step || typeof step.id !== 'string' || !step.id) {
                throw new A_WorkflowError({
                    title: A_WorkflowError.DefinitionError,
                    description: `Workflow "${definition.name}" has a step without a valid "id".`,
                });
            }
            if (ids.has(step.id)) {
                throw new A_WorkflowError({
                    title: A_WorkflowError.DefinitionError,
                    description: `Workflow "${definition.name}" has duplicate step id "${step.id}".`,
                });
            }
            ids.add(step.id);
        }
    }

    /**
     * Ensure the execution scope inherits from the scope this entity is
     * registered in. Throws when the workflow is not bound to any scope.
     */
    protected checkScopeInheritance(): void {
        let attachedScope: A_Scope;

        try {
            attachedScope = A_Context.scope(this);
        } catch (error) {
            throw new A_WorkflowError({
                title: A_WorkflowError.ScopeBindingError,
                description: `Workflow "${this.aseid.toString()}" is not bound to any context scope. Register it before running.`,
                originalError: error,
            });
        }

        if (!this._executionScope.isInheritedFrom(attachedScope)) {
            this._executionScope.inherit(attachedScope);
        }
    }
}
