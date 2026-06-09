import { A_Error } from '@adaas/a-concept';
import { A_ExecutionContext } from '../A-Execution/A-Execution.context.mjs';
import { A_TYPES__WorkflowStepContext_Storage } from './A-Workflows.types.mjs';
import './A-Workflows.constants.mjs';

/**
 * A_WorkflowStepContext — the per-step input/output channel.
 *
 * The engine ({@link A_Workflows}) registers ONE of these into the isolated
 * scope it builds for each step, carrying the remapped `params` IN. A step's
 * handler (a `@A_Feature.Extend` method on the target component/entity) reads
 * `params` via `@A_Inject(A_WorkflowStepContext)` and writes its outcome back
 * via `succeed(result)` / `fail(error)`. The engine then lifts `result` out
 * and stores it in the workflow's accumulated context under `steps.<id>`.
 *
 * Modelled on {@link A_OperationContext} (A_Fragment + A_Meta) so the same
 * "params in / result out" ergonomics apply across the library.
 */
declare class A_WorkflowStepContext<_Params extends Record<string, any> = Record<string, any>, _Result = any> extends A_ExecutionContext<A_TYPES__WorkflowStepContext_Storage<_Params, _Result>> {
    constructor(stepId: string, params?: _Params);
    /** Id of the step currently being executed. */
    get stepId(): string;
    /** Remapped params provided to the step handler. */
    get params(): _Params;
    /** Result produced by the step handler, if any. */
    get result(): _Result | undefined;
    /** Error produced by the step handler, if any. */
    get error(): A_Error | undefined;
    /** Whether the step handler reported a result. */
    get hasResult(): boolean;
    /** Record a successful result for the step. */
    succeed(result: _Result): this;
    /** Record a failure for the step. */
    fail(error: A_Error): this;
}

export { A_WorkflowStepContext };
