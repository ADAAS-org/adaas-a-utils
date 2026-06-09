import { A_Component, A_Scope } from '@adaas/a-concept';
import { A_Workflow } from './A-Workflow.entity.mjs';
import { A_TYPES__WorkflowDefinition } from './A-Workflows.types.mjs';
import './A-FeatureLoader.component.mjs';
import './A-Workflows.constants.mjs';

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
declare class A_Workflows extends A_Component {
    /**
     * Build a self-executing {@link A_Workflow} from a plain definition and
     * optional initial params, registering it in the manager's scope so it is
     * ready to run.
     */
    build(definition: A_TYPES__WorkflowDefinition, params?: Record<string, any>): A_Workflow;
    /**
     * Convenience: register (if needed) and run a workflow to its next
     * stopping point. Delegates entirely to {@link A_Workflow.run}.
     */
    run(workflow: A_Workflow): Promise<A_Workflow>;
    /**
     * Convenience: resume a paused / deserialized workflow. Delegates to
     * {@link A_Workflow.run} (which resumes a paused flow).
     */
    resume(workflow: A_Workflow): Promise<A_Workflow>;
    /** Resolve the manager's own scope, raising a clear error when unbound. */
    protected _scope(): A_Scope;
    /** Ensure a workflow is registered in the manager scope before running. */
    protected _ensureRegistered(workflow: A_Workflow): void;
}

export { A_Workflows };
