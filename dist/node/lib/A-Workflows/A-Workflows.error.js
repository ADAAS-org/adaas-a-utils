'use strict';

var aConcept = require('@adaas/a-concept');

class A_WorkflowError extends aConcept.A_Error {
}
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

exports.A_WorkflowError = A_WorkflowError;
//# sourceMappingURL=A-Workflows.error.js.map
//# sourceMappingURL=A-Workflows.error.js.map