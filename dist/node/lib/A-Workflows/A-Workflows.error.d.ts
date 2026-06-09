import { A_Error } from '@adaas/a-concept';

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

export { A_WorkflowError };
