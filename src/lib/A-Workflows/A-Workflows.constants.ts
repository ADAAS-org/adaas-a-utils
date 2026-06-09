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
export enum A_Workflow_Status {
    /** Workflow instance created but not yet started. */
    CREATED = 'CREATED',
    /** Workflow is actively executing steps. */
    RUNNING = 'RUNNING',
    /**
     * Workflow execution is suspended at a transfer boundary. This is the
     * serialize/deserialize handoff point for distributed execution.
     */
    PAUSED = 'PAUSED',
    /** All steps executed successfully. */
    COMPLETED = 'COMPLETED',
    /** A step failed and the workflow stopped. */
    FAILED = 'FAILED',
}

/**
 * A-Workflow Lifecycle Features
 *
 * Extension points that components can implement (via `@A_Feature.Extend`)
 * to inject custom behavior at different stages of a workflow run. The
 * engine ({@link A_Workflows}) dispatches these on the workflow entity.
 */
export enum A_WorkflowFeatures {
    /** Fired once when a workflow transitions from CREATED to RUNNING. */
    onStart = '_A_Workflow_onStart',
    /** Fired before each individual step is evaluated / executed. */
    onBeforeStep = '_A_Workflow_onBeforeStep',
    /** Fired after each individual step completes (or is skipped). */
    onAfterStep = '_A_Workflow_onAfterStep',
    /** Fired when the workflow is paused at a transfer boundary. */
    onPause = '_A_Workflow_onPause',
    /** Fired when a paused / deserialized workflow is resumed. */
    onResume = '_A_Workflow_onResume',
    /** Fired when every step has completed successfully. */
    onComplete = '_A_Workflow_onComplete',
    /** Fired when a step fails and the workflow stops. */
    onFail = '_A_Workflow_onFail',
}

/**
 * A-Workflow Lifecycle Events
 *
 * Observable events emitted by a workflow instance. Hosts subscribe via
 * `workflow.on(event, listener)` to react to progress without driving the
 * engine themselves (e.g. to stream progress to a UI).
 */
export enum A_WorkflowEvent {
    onStart = 'onStart',
    onStep = 'onStep',
    onSkip = 'onSkip',
    onPause = 'onPause',
    onResume = 'onResume',
    onComplete = 'onComplete',
    onFail = 'onFail',
}

export type A_WorkflowEvents = keyof typeof A_WorkflowEvent;

/**
 * Behavior to apply when a workflow step fails.
 */
export enum A_WorkflowStepErrorBehavior {
    /** Stop the workflow and mark it FAILED (default). */
    FAIL = 'fail',
    /** Ignore the error, record it, and continue with the next step. */
    CONTINUE = 'continue',
    /** Jump to the step referenced by `onErrorGoto`. */
    GOTO = 'goto',
}

/**
 * Predefined CONDITION function identifiers usable in a step's `condition`.
 *
 * They are referenced by string in the (serializable) workflow definition
 * and evaluated by {@link A_WorkflowFunctions}. Keeping them as string ids
 * is what makes a workflow definition portable across services.
 */
export enum A_WorkflowConditionFn {
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
    EXISTS = 'exists',
    NOT_EXISTS = 'notExists',
    TRUTHY = 'truthy',
    FALSY = 'falsy',
    GT = 'gt',
    GTE = 'gte',
    LT = 'lt',
    LTE = 'lte',
    IN = 'in',
    MATCHES = 'matches',
    AND = 'and',
    OR = 'or',
    NOT = 'not',
}

/**
 * Predefined VALUE-TRANSFORM function identifiers usable in a remap value
 * source's `fn`. Evaluated by {@link A_WorkflowFunctions}.
 */
export enum A_WorkflowValueFn {
    /** Concatenate the resolved args into a single string. */
    CONCAT = 'concat',
    /** Uppercase the resolved string arg. */
    UPPERCASE = 'uppercase',
    /** Lowercase the resolved string arg. */
    LOWERCASE = 'lowercase',
    /** Return the first non-null/undefined resolved arg. */
    COALESCE = 'coalesce',
    /** Current ISO timestamp (ignores args). */
    NOW = 'now',
    /** Numeric sum of resolved args. */
    SUM = 'sum',
    /** Boolean NOT of the first resolved arg. */
    NOT = 'not',
    /** JSON-stringify the first resolved arg. */
    JSON = 'json',
}

/**
 * Reserved top-level keys inside the workflow's accumulated context store.
 */
export enum A_WorkflowContextKey {
    /** Initial parameters the workflow was started with. */
    PARAMS = 'params',
    /** Per-step results, keyed by step id. */
    STEPS = 'steps',
}
