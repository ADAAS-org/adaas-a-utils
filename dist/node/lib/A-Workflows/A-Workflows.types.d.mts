import { A_TYPES__Error_Serialized, A_TYPES__Entity_Serialized } from '@adaas/a-concept';
import { A_WorkflowValueFn, A_WorkflowConditionFn, A_WorkflowStepErrorBehavior, A_Workflow_Status } from './A-Workflows.constants.mjs';

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

export type { A_TYPES__FeatureLoaderConfig, A_TYPES__FeatureLoaderStep, A_TYPES__WorkflowCondition, A_TYPES__WorkflowContext, A_TYPES__WorkflowDefinition, A_TYPES__WorkflowRemap, A_TYPES__WorkflowStep, A_TYPES__WorkflowStepContext_Storage, A_TYPES__WorkflowValueSource, A_TYPES__Workflow_Init, A_TYPES__Workflow_Serialized };
