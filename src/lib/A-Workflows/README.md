# A-Workflows

A distributed, resumable **workflow** subsystem for the A-Concept / ADAAS
framework. There are two ways to author a workflow:

1. **Inheritance (preferred, native A-Concept idiom)** — subclass `A_Workflow`,
   declare the recipe in `setup()`, and implement each step as a feature handler
   **on the workflow itself**. Run it directly with `wf.run()`.
2. **Data-driven** — describe a workflow as a portable JSON definition and let
   the `A_Workflows` builder turn it into a running instance. Useful for
   AI-Script (`.ais`) compiled workflows.

Both forms support **parameter remapping, conditional steps, templated
features, and pause / serialize / resume transfer boundaries** for cross-service
execution.

Built entirely on A-Concept internals (components, entities, fragments,
features, dependencies) — no loose helper functions.

## Elements

| Class | Kind | Responsibility |
| --- | --- | --- |
| `A_Workflow` | `A_Entity` | The serializable, **self-executing** workflow instance (definition + status + cursor + context). Subclass it and override `setup()`. |
| `A_Workflows` | `A_Component` | Optional builder/manager for the data-driven form. `build()`, `run()`, `resume()`. |
| `A_FeatureLoader` | `A_Component` | Compiles a JSON feature template into a runnable `A_Feature`. |
| `A_WorkflowFunctions` | `A_Component` | Predefined, serialization-safe remap + condition functions. |
| `A_WorkflowStepContext` | `A_Fragment` | Per-step params-in / result-out channel. |
| `A_WorkflowError` | `A_Error` | Typed errors. |

## Quick start (inheritance — preferred)

Mirrors the AI-Script concept
`Workflow('Daily stats aggregation and storing to the temporary cache') { ref: dailyWorkflow }`:
the workflow is a class, the steps are feature handlers, and it runs itself.

```ts
import { A_Context, A_Feature, A_Inject } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';
import {
    A_Workflow,
    A_WorkflowStepContext,
    A_TYPES__WorkflowDefinition,
} from '@adaas/a-utils/a-workflows';

@A_Frame.Define({ namespace: 'App' })
class DailyAggregation extends A_Workflow {

    // Declare the recipe. Steps reference handlers by `feature` name.
    protected setup(): A_TYPES__WorkflowDefinition {
        return {
            name: 'Daily stats aggregation and storing to the temporary cache',
            steps: [
                { id: 'aggregate', feature: 'aggregate',
                  remap: { date: { from: 'params.date' } },
                  transferAfter: true },
                { id: 'store', feature: 'store',
                  remap: { count: { from: 'steps.aggregate.count' } } },
            ],
        };
    }

    // Each handler IS a step — it lives on the workflow itself.
    @A_Feature.Extend()
    async aggregate(@A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext) {
        ctx.succeed({ count: 42, date: ctx.params.date });
    }

    @A_Feature.Extend()
    async store(@A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext) {
        ctx.succeed({ stored: true, cachedCount: ctx.params.count });
    }
}

const wf = new DailyAggregation({ params: { date: '2026-06-09' } });
A_Context.root.register(wf);   // bind to a scope before running
await wf.run();
console.log(wf.steps.aggregate); // { count: 42, date: '2026-06-09' }
```

A subclass can be constructed with `new DailyAggregation()`,
`new DailyAggregation({ params })`, or `new DailyAggregation(serialized)` — the
recipe always comes from `setup()`, so the class is the single source of truth
for logic. Register the instance in a scope before calling `run()`.

## Distributed execution (inheritance)

Mark a step `transferAfter: true` to pause the workflow after it completes.
Serialize the paused instance, ship it to another service, reconstruct the
**same subclass**, and resume — logic comes from the class, state from the wire:

```ts
// ── Service A ────────────────────────────────────────────────
const wf = new DailyAggregation({ params: { date } });
A_Context.root.register(wf);
await wf.run();                       // runs until the transfer boundary (PAUSED)
const wire = JSON.stringify(wf.toJSON());

// ── Service B (fresh runtime) ────────────────────────────────
A_Context.reset();
const resumed = new DailyAggregation(JSON.parse(wire));
A_Context.root.register(resumed);
await resumed.run();                  // resumes from the exact same cursor
```

The `A_Workflow` entity rebuilds its execution scope in both `fromNew` and
`fromJSON` (mirroring `A_Command`), and always registers `A_WorkflowFunctions` +
`A_FeatureLoader`, so a deserialized workflow is fully self-contained. Step
results travel in the serialized `context.steps`, so downstream steps see them
transparently.

See [`examples/A-Workflows-examples.ts`](../../../examples/A-Workflows-examples.ts)
for runnable inheritance, distributed, and conditional examples
(`npm run example:A-Workflows`).

## Data-driven form (`A_Workflows` builder)

When the recipe arrives as data (e.g. compiled from `.ais`) and the step logic
lives on **other** registered components, use the builder. Steps reference the
owning component via `target` and the handler via `feature`:

```ts
import { A_Context, A_Component, A_Feature, A_Inject } from '@adaas/a-concept';
import { A_Workflows, A_WorkflowStepContext } from '@adaas/a-utils/a-workflows';

class Math extends A_Component {
    @A_Feature.Extend()
    async add(@A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext) {
        ctx.succeed({ sum: ctx.params.a + ctx.params.b });
    }
}

A_Context.root.register(A_Workflows);
A_Context.root.register(Math);

const engine = A_Context.root.resolve(A_Workflows)!;

const workflow = engine.build({
    name: 'demo',
    steps: [{
        id: 'sum',
        feature: 'add',
        target: 'Math',
        remap: { a: { from: 'params.a' }, b: { from: 'params.b' } },
    }],
}, { a: 2, b: 3 });

await engine.run(workflow);
console.log(workflow.steps.sum); // { sum: 5 }
```

The same `transferAfter` / serialize / `engine.resume()` flow applies to the
data-driven form.

## Parameter remap & conditions

Definitions never carry code. Values are referenced by dot-path and behavior by
string id (interpreted identically on every service by `A_WorkflowFunctions`):

```ts
// remap
{ userId: { from: 'params.id' },
  token:  { from: 'steps.login.token' },
  label:  { fn: 'concat', args: [{ value: 'user-' }, { from: 'params.id' }] } }

// condition (skip the step unless it evaluates truthy)
{ fn: 'and', conditions: [
    { fn: 'equals', left: { from: 'params.role' }, right: { value: 'admin' } },
    { fn: 'exists', left: { from: 'steps.login.token' } },
] }
```

## Step error behavior

| `onError` | Effect |
| --- | --- |
| `fail` (default) | Stop and mark the workflow `FAILED`. |
| `continue` | Record the error and run the next step. |
| `goto` | Jump to `onErrorGoto`. |

## Templated steps

A step can define its behavior inline via `A_FeatureLoader` instead of a named
feature:

```ts
{ id: 'charge',
  template: {
      name: 'charge-card',
      steps: [
          { target: 'PaymentGateway', handler: 'authorize' },
          { target: 'PaymentGateway', handler: 'capture', after: 'PaymentGateway.authorize' },
      ],
  } }
```
