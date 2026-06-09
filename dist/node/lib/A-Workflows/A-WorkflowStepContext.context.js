'use strict';

var core = require('@adaas/a-frame/core');
var aExecution = require('@adaas/a-utils/a-execution');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_WorkflowStepContext = class A_WorkflowStepContext extends aExecution.A_ExecutionContext {
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
exports.A_WorkflowStepContext = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Per-step input/output context for A-Workflows. Carries the remapped params into a workflow step handler and collects the produced result or error back out so the engine can thread it into the accumulated workflow context."
  })
], exports.A_WorkflowStepContext);
//# sourceMappingURL=A-WorkflowStepContext.context.js.map
//# sourceMappingURL=A-WorkflowStepContext.context.js.map