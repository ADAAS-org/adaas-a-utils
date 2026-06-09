import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Frame } from '@adaas/a-frame/core';
import { A_ExecutionContext } from '@adaas/a-utils/a-execution';

let A_WorkflowStepContext = class extends A_ExecutionContext {
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

export { A_WorkflowStepContext };
//# sourceMappingURL=A-WorkflowStepContext.context.mjs.map
//# sourceMappingURL=A-WorkflowStepContext.context.mjs.map