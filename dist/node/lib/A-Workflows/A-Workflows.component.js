'use strict';

var aConcept = require('@adaas/a-concept');
var core = require('@adaas/a-frame/core');
var AWorkflow_entity = require('./A-Workflow.entity');
var AWorkflows_constants = require('./A-Workflows.constants');
var AWorkflows_error = require('./A-Workflows.error');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_Workflows = class A_Workflows extends aConcept.A_Component {
  /**
   * Build a self-executing {@link A_Workflow} from a plain definition and
   * optional initial params, registering it in the manager's scope so it is
   * ready to run.
   */
  build(definition, params) {
    const scope = this._scope();
    const workflow = new AWorkflow_entity.A_Workflow({ definition, params });
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
    if (workflow.status !== AWorkflows_constants.A_Workflow_Status.PAUSED && workflow.status !== AWorkflows_constants.A_Workflow_Status.CREATED) {
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
      return aConcept.A_Context.scope(this);
    } catch (error) {
      throw new AWorkflows_error.A_WorkflowError({
        title: AWorkflows_error.A_WorkflowError.ScopeBindingError,
        description: `A_Workflows manager is not registered in any scope. Register it before building workflows.`,
        originalError: error
      });
    }
  }
  /** Ensure a workflow is registered in the manager scope before running. */
  _ensureRegistered(workflow) {
    if (!aConcept.A_Context.has(workflow)) {
      this._scope().register(workflow);
    }
  }
};
exports.A_Workflows = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Optional manager/builder for data-driven workflows. Wraps a plain workflow definition (e.g. compiled from AIS source) into a self-executing A_Workflow entity, registers it, and delegates execution to the entity. Inheritance-based workflows do not need this component."
  })
], exports.A_Workflows);
//# sourceMappingURL=A-Workflows.component.js.map
//# sourceMappingURL=A-Workflows.component.js.map