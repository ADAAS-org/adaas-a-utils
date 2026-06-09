/**
 * A-Workflow Inheritance & Distribution Examples
 *
 * This example demonstrates the *native* A-Concept way to author workflows:
 * you **inherit** `A_Workflow`, declare the recipe in `setup()`, and implement
 * each step as a feature handler **on the workflow itself**. The workflow then
 * runs itself via `wf.run()` — no external engine is required.
 *
 * This mirrors the AI-Script (`.ais`) concept:
 *
 *     Workflow('Daily stats aggregation and storing to the temporary cache') {
 *         ref: dailyWorkflow
 *     }
 *
 * which compiles to a `A_Workflow` subclass whose step handlers carry the
 * business logic. Because the logic lives in the class (not on the wire), the
 * workflow can be serialized at any `transferAfter` boundary, shipped to
 * another service, reconstructed with `new MyWorkflow(serialized)`, and resumed
 * — giving you native chaining across multiple services.
 *
 * The file is self-contained and runnable: `npm run example:A-Workflows`.
 */

import { A_Context, A_Feature, A_Inject } from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import {
    A_Workflow,
    A_Workflow_Status,
    A_WorkflowEvent,
    A_WorkflowStepContext,
    A_TYPES__WorkflowDefinition,
    A_TYPES__Workflow_Serialized,
} from "../src/lib/A-Workflows";


// ============================================================================
// ====================== Example 1: A simple workflow ========================
// ============================================================================

/**
 * The smallest possible inheritance-based workflow.
 *
 * - `setup()` declares the recipe (steps reference handlers by `feature` name).
 * - Each `@A_Feature.Extend()` method IS a step. It reads its remapped input
 *   from the per-step `A_WorkflowStepContext` and reports the result via
 *   `ctx.succeed(...)`.
 * - Steps without a `target` resolve against the workflow instance itself.
 */
@A_Frame.Define({ namespace: 'examples', description: 'Greets a user' })
class GreetingWorkflow extends A_Workflow {

    protected setup(): A_TYPES__WorkflowDefinition {
        return {
            name: 'Greet a user',
            steps: [
                {
                    id: 'greet',
                    feature: 'greet',
                    // Pull `name` from the workflow params into this step.
                    remap: { name: { from: 'params.name' } },
                },
            ],
        };
    }

    @A_Feature.Extend()
    async greet(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ): Promise<void> {
        ctx.succeed({ message: `Hello, ${ctx.params.name}!` });
    }
}


// ============================================================================
// ====================== Example 2: A distributed workflow ===================
// ============================================================================

/**
 * A two-step workflow that crosses a service boundary.
 *
 * Step `aggregate` runs on Service A, then — because it is marked
 * `transferAfter: true` — the workflow pauses. Its full state is serialized,
 * shipped to Service B, reconstructed there as the SAME subclass, and resumed
 * so step `store` executes on Service B.
 *
 * Note how step `store` consumes the previous step's output through
 * `remap: { count: { from: 'steps.aggregate.count' } }`. Step results are
 * accumulated in the workflow context under `steps.<stepId>` and travel with
 * the serialized payload, so the downstream service sees them transparently.
 */
@A_Frame.Define({
    namespace: 'examples',
    description: 'Daily stats aggregation and storing to the temporary cache',
})
class DailyAggregationWorkflow extends A_Workflow {

    protected setup(): A_TYPES__WorkflowDefinition {
        return {
            name: 'Daily stats aggregation and storing to the temporary cache',
            steps: [
                {
                    id: 'aggregate',
                    feature: 'aggregate',
                    remap: { date: { from: 'params.date' } },
                    transferAfter: true, // pause + hand off to the next service
                },
                {
                    id: 'store',
                    feature: 'store',
                    remap: { count: { from: 'steps.aggregate.count' } },
                },
            ],
        };
    }

    @A_Feature.Extend()
    async aggregate(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ): Promise<void> {
        // Pretend we crunched the numbers for the day.
        ctx.succeed({ count: 100, date: ctx.params.date });
    }

    @A_Feature.Extend()
    async store(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ): Promise<void> {
        // Pretend we wrote the aggregate to a temporary cache.
        ctx.succeed({ stored: true, cachedCount: ctx.params.count });
    }
}


// ============================================================================
// ====================== Example 3: Conditional branching ====================
// ============================================================================

/**
 * Demonstrates declarative conditions and a non-fatal failure policy.
 *
 * - The `notify` step only runs when the order total exceeds a threshold
 *   (`condition`). Otherwise it is skipped and an `onSkip` event fires.
 * - The `audit` step is allowed to fail without sinking the whole workflow
 *   (`onError: 'continue'`).
 */
@A_Frame.Define({ namespace: 'examples', description: 'Processes an order' })
class OrderWorkflow extends A_Workflow {

    protected setup(): A_TYPES__WorkflowDefinition {
        return {
            name: 'Process an order',
            steps: [
                {
                    id: 'notify',
                    feature: 'notify',
                    remap: { total: { from: 'params.total' } },
                    // Only notify for big orders.
                    condition: {
                        fn: 'gt',
                        left: { from: 'params.total' },
                        right: { value: 1000 },
                    },
                },
                {
                    id: 'audit',
                    feature: 'audit',
                    onError: 'continue', // best-effort; never blocks the order
                },
            ],
        };
    }

    @A_Feature.Extend()
    async notify(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ): Promise<void> {
        ctx.succeed({ notified: true, total: ctx.params.total });
    }

    @A_Feature.Extend()
    async audit(): Promise<void> {
        // An auxiliary system is flaky — but we don't want to fail the order.
        throw new Error('Audit service unavailable');
    }
}


// ============================================================================
// ====================== Runner ==============================================
// ============================================================================

async function runSimpleExample(): Promise<void> {
    console.log('\n=== Example 1 :: Simple inheritance-based workflow ===');

    const wf = new GreetingWorkflow({ params: { name: 'Ada' } });
    A_Context.root.register(wf);

    // Observe lifecycle events.
    wf.on(A_WorkflowEvent.onComplete, () => console.log('  → workflow completed'));

    await wf.run();

    console.log('  status :', wf.status);
    console.log('  result :', wf.steps.greet);
}

async function runDistributedExample(): Promise<void> {
    console.log('\n=== Example 2 :: Distributed workflow across two services ===');

    // ---- Service A: start and run until the transfer boundary --------------
    const serviceA = new DailyAggregationWorkflow({ params: { date: '2026-06-09' } });
    A_Context.root.register(serviceA);

    await serviceA.run();

    console.log('  [A] status :', serviceA.status);     // PAUSED
    console.log('  [A] cursor :', serviceA.cursor);      // 1
    console.log('  [A] aggregate :', serviceA.steps.aggregate);

    // ---- Serialize for transport (HTTP body, queue message, etc.) ----------
    const wire: A_TYPES__Workflow_Serialized =
        JSON.parse(JSON.stringify(serviceA.toJSON()));
    console.log('  [wire] bytes :', JSON.stringify(wire).length);

    // ---- Service B: brand-new runtime ENTIRELY independent from Service A ---
    A_Context.reset();

    // Logic comes from the class (setup() + handlers); state comes from `wire`.
    const serviceB = new DailyAggregationWorkflow(wire);
    A_Context.root.register(serviceB);

    console.log('  [B] restored status :', serviceB.status); // PAUSED
    console.log('  [B] same identity   :', serviceB.aseid.toString() === wire.aseid);

    await serviceB.run(); // resumes the paused workflow on Service B

    console.log('  [B] status :', serviceB.status);          // COMPLETED
    console.log('  [B] store  :', serviceB.steps.store);
}

async function runConditionalExample(): Promise<void> {
    console.log('\n=== Example 3 :: Conditional branching & resilient steps ===');

    A_Context.reset();

    // Small order → the `notify` step is skipped.
    const small = new OrderWorkflow({ params: { total: 50 } });
    A_Context.root.register(small);
    small.on(A_WorkflowEvent.onSkip, (wf) => console.log('  skipped a step at cursor', wf.cursor));
    await small.run();
    console.log('  small order status :', small.status, '| notify ran:', 'notify' in small.steps);

    // Large order → the `notify` step runs; the `audit` step fails but is tolerated.
    const large = new OrderWorkflow({ params: { total: 5000 } });
    A_Context.root.register(large);
    await large.run();
    console.log('  large order status :', large.status, '| notify:', large.steps.notify);
}

async function main(): Promise<void> {
    await runSimpleExample();
    await runDistributedExample();
    await runConditionalExample();
    console.log('\nAll workflow examples finished.\n');
}

main().catch((err) => {
    console.error('Workflow example failed:', err);
    process.exit(1);
});
