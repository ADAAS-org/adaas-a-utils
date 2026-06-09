import {
    A_Component,
    A_Context,
    A_Scope,
} from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import { A_Workflow } from "./A-Workflow.entity";
import { A_Workflow_Status } from "./A-Workflows.constants";
import { A_WorkflowError } from "./A-Workflows.error";
import { A_TYPES__WorkflowDefinition } from "./A-Workflows.types";


/**
 * A_Workflows — an OPTIONAL manager / builder for the **data-driven** form of
 * workflows.
 *
 * The native, preferred way to use workflows is by inheritance: subclass
 * {@link A_Workflow}, declare the recipe via `setup()`, implement steps as
 * feature handlers, then call `workflow.run()` directly on the entity. No
 * engine is needed for that — the entity is self-executing.
 *
 * This component exists for the cases where the recipe is NOT known at compile
 * time and arrives as plain data — e.g. a workflow compiled from AIS source
 * (`Workflow('...'){ref:...}`) into a `A_TYPES__WorkflowDefinition`. It simply
 * wraps such a definition into a generic {@link A_Workflow}, registers it in
 * the manager's scope, and delegates execution to the entity itself.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Optional manager/builder for data-driven workflows. Wraps a plain workflow definition (e.g. compiled from AIS source) into a self-executing A_Workflow entity, registers it, and delegates execution to the entity. Inheritance-based workflows do not need this component.'
})
export class A_Workflows extends A_Component {

    /**
     * Build a self-executing {@link A_Workflow} from a plain definition and
     * optional initial params, registering it in the manager's scope so it is
     * ready to run.
     */
    build(
        definition: A_TYPES__WorkflowDefinition,
        params?: Record<string, any>
    ): A_Workflow {
        const scope = this._scope();
        const workflow = new A_Workflow({ definition, params });
        scope.register(workflow);
        return workflow;
    }

    /**
     * Convenience: register (if needed) and run a workflow to its next
     * stopping point. Delegates entirely to {@link A_Workflow.run}.
     */
    async run(workflow: A_Workflow): Promise<A_Workflow> {
        this._ensureRegistered(workflow);
        await workflow.run();
        return workflow;
    }

    /**
     * Convenience: resume a paused / deserialized workflow. Delegates to
     * {@link A_Workflow.run} (which resumes a paused flow).
     */
    async resume(workflow: A_Workflow): Promise<A_Workflow> {
        this._ensureRegistered(workflow);

        if (workflow.status !== A_Workflow_Status.PAUSED
            && workflow.status !== A_Workflow_Status.CREATED) {
            return workflow;
        }

        await workflow.run();
        return workflow;
    }

    // ====================================================================
    // ================== Helpers =========================================
    // ====================================================================

    /** Resolve the manager's own scope, raising a clear error when unbound. */
    protected _scope(): A_Scope {
        try {
            return A_Context.scope(this);
        } catch (error) {
            throw new A_WorkflowError({
                title: A_WorkflowError.ScopeBindingError,
                description: `A_Workflows manager is not registered in any scope. Register it before building workflows.`,
                originalError: error,
            });
        }
    }

    /** Ensure a workflow is registered in the manager scope before running. */
    protected _ensureRegistered(workflow: A_Workflow): void {
        if (!A_Context.has(workflow)) {
            this._scope().register(workflow);
        }
    }
}
