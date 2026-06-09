import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Component, A_Context } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';
import { A_Workflow } from './A-Workflow.entity';
import { A_Workflow_Status } from './A-Workflows.constants';
import { A_WorkflowError } from './A-Workflows.error';

let A_Workflows = class extends A_Component {
  /**
   * Build a self-executing {@link A_Workflow} from a plain definition and
   * optional initial params, registering it in the manager's scope so it is
   * ready to run.
   */
  build(definition, params) {
    const scope = this._scope();
    const workflow = new A_Workflow({ definition, params });
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
    if (workflow.status !== A_Workflow_Status.PAUSED && workflow.status !== A_Workflow_Status.CREATED) {
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
      return A_Context.scope(this);
    } catch (error) {
      throw new A_WorkflowError({
        title: A_WorkflowError.ScopeBindingError,
        description: `A_Workflows manager is not registered in any scope. Register it before building workflows.`,
        originalError: error
      });
    }
  }
  /** Ensure a workflow is registered in the manager scope before running. */
  _ensureRegistered(workflow) {
    if (!A_Context.has(workflow)) {
      this._scope().register(workflow);
    }
  }
};
A_Workflows = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Optional manager/builder for data-driven workflows. Wraps a plain workflow definition (e.g. compiled from AIS source) into a self-executing A_Workflow entity, registers it, and delegates execution to the entity. Inheritance-based workflows do not need this component."
  })
], A_Workflows);

export { A_Workflows };
//# sourceMappingURL=A-Workflows.component.mjs.map
//# sourceMappingURL=A-Workflows.component.mjs.map