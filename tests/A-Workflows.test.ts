import { A_Component, A_Context, A_Error, A_Feature, A_Inject, A_Scope } from '@adaas/a-concept';
import {
    A_Workflows,
    A_Workflow,
    A_Workflow_Status,
    A_WorkflowEvent,
    A_WorkflowFunctions,
    A_FeatureLoader,
    A_WorkflowStepContext,
    A_WorkflowError,
    A_WorkflowStepErrorBehavior,
    A_TYPES__WorkflowDefinition,
    A_TYPES__Workflow_Serialized,
} from '@adaas/a-utils/a-workflows';

jest.retryTimes(0);

// =============================================================================
// ======================== Shared Test Components =============================
// =============================================================================

/**
 * Math operations exposed as named features. Each handler reads the remapped
 * params from the per-step context and writes a result back.
 */
class MathComponent extends A_Component {

    @A_Feature.Extend()
    async add(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ) {
        ctx.succeed({ sum: (Number(ctx.params.a) || 0) + (Number(ctx.params.b) || 0) });
    }

    @A_Feature.Extend()
    async double(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ) {
        ctx.succeed({ value: (Number(ctx.params.value) || 0) * 2 });
    }

    @A_Feature.Extend()
    async boom(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ) {
        throw new A_Error({ title: 'Boom', description: `step "${ctx.stepId}" exploded` });
    }
}

/**
 * Records the order of handler execution to assert sequencing.
 */
const executionLog: string[] = [];

class TrackingComponent extends A_Component {
    @A_Feature.Extend()
    async record(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ) {
        executionLog.push(ctx.stepId);
        ctx.succeed({ at: ctx.params.label });
    }
}

/** Register the engine + targets in the root scope. */
function bootstrap() {
    A_Context.root.register(A_Workflows);
    A_Context.root.register(MathComponent);
    A_Context.root.register(TrackingComponent);
    return A_Context.root.resolve(A_Workflows)!;
}


describe('A-Workflows', () => {

    beforeEach(() => {
        A_Context.reset();
        executionLog.length = 0;
    });

    // =========================================================================
    // ======================== Definition & Build =============================
    // =========================================================================

    describe('Build & validation', () => {

        it('Should build a workflow in CREATED status with initial params', () => {
            const engine = bootstrap();
            const def: A_TYPES__WorkflowDefinition = {
                name: 'simple',
                steps: [{ id: 's1', feature: 'add', target: 'MathComponent' }],
            };

            const wf = engine.build(def, { x: 1 });

            expect(wf).toBeInstanceOf(A_Workflow);
            expect(wf.status).toBe(A_Workflow_Status.CREATED);
            expect(wf.cursor).toBe(0);
            expect(wf.params).toEqual({ x: 1 });
            expect(wf.steps).toEqual({});
            expect(wf.code).toBe('a-workflow');
        });

        it('Should reject a definition with no steps', () => {
            const engine = bootstrap();
            expect(() => engine.build({ name: 'empty', steps: [] } as any))
                .toThrow(A_WorkflowError);
        });

        it('Should reject duplicate step ids', () => {
            const engine = bootstrap();
            expect(() => engine.build({
                name: 'dup',
                steps: [
                    { id: 'a', feature: 'add', target: 'MathComponent' },
                    { id: 'a', feature: 'add', target: 'MathComponent' },
                ],
            })).toThrow(A_WorkflowError);
        });
    });

    // =========================================================================
    // ======================== Sequential Execution ===========================
    // =========================================================================

    describe('Sequential execution', () => {

        it('Should run a single-step workflow to completion', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'one-step',
                steps: [{
                    id: 'sum',
                    feature: 'add',
                    target: 'MathComponent',
                    remap: { a: { from: 'params.a' }, b: { from: 'params.b' } },
                }],
            }, { a: 2, b: 3 });

            await engine.run(wf);

            expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
            expect(wf.isDone).toBe(true);
            expect(wf.steps.sum).toEqual({ sum: 5 });
            expect(wf.duration).toBeGreaterThanOrEqual(0);
        });

        it('Should thread one step result into the next via remap', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'chained',
                steps: [
                    {
                        id: 'sum',
                        feature: 'add',
                        target: 'MathComponent',
                        remap: { a: { from: 'params.a' }, b: { from: 'params.b' } },
                    },
                    {
                        id: 'twice',
                        feature: 'double',
                        target: 'MathComponent',
                        remap: { value: { from: 'steps.sum.sum' } },
                    },
                ],
            }, { a: 4, b: 6 });

            await engine.run(wf);

            expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
            expect(wf.steps.sum).toEqual({ sum: 10 });
            expect(wf.steps.twice).toEqual({ value: 20 });
        });

        it('Should preserve declared step order', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'ordered',
                steps: ['a', 'b', 'c'].map(id => ({
                    id,
                    feature: 'record',
                    target: 'TrackingComponent',
                    remap: { label: { value: id } },
                })),
            });

            await engine.run(wf);

            expect(executionLog).toEqual(['a', 'b', 'c']);
            expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
        });

        it('Should mirror a result to a custom output key', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'output',
                steps: [{
                    id: 'sum',
                    feature: 'add',
                    target: 'MathComponent',
                    remap: { a: { value: 10 }, b: { value: 5 } },
                    output: 'total',
                }],
            });

            await engine.run(wf);

            expect(wf.context.total).toEqual({ sum: 15 });
        });
    });

    // =========================================================================
    // ======================== Conditional Steps ==============================
    // =========================================================================

    describe('Conditional execution', () => {

        it('Should skip a step whose condition is falsy', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'conditional',
                steps: [
                    {
                        id: 'maybe',
                        feature: 'record',
                        target: 'TrackingComponent',
                        condition: { fn: 'equals', left: { from: 'params.run' }, right: { value: true } },
                        remap: { label: { value: 'maybe' } },
                    },
                    {
                        id: 'always',
                        feature: 'record',
                        target: 'TrackingComponent',
                        remap: { label: { value: 'always' } },
                    },
                ],
            }, { run: false });

            await engine.run(wf);

            expect(executionLog).toEqual(['always']);
            expect(wf.steps.maybe).toBeUndefined();
            expect(wf.steps.always).toBeDefined();
            expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
        });

        it('Should run a step whose condition is truthy', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'conditional-true',
                steps: [{
                    id: 'maybe',
                    feature: 'record',
                    target: 'TrackingComponent',
                    condition: { fn: 'truthy', left: { from: 'params.run' } },
                    remap: { label: { value: 'maybe' } },
                }],
            }, { run: 1 });

            await engine.run(wf);

            expect(executionLog).toEqual(['maybe']);
            expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
        });
    });

    // =========================================================================
    // ======================== Error Handling =================================
    // =========================================================================

    describe('Error handling', () => {

        it('Should fail the workflow by default when a step throws', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'failing',
                steps: [{ id: 'boom', feature: 'boom', target: 'MathComponent' }],
            });

            await engine.run(wf);

            expect(wf.status).toBe(A_Workflow_Status.FAILED);
            expect(wf.error).toBeInstanceOf(A_Error);
            expect(wf.isProcessed).toBe(true);
        });

        it('Should continue past a failing step when onError=continue', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'continue',
                steps: [
                    {
                        id: 'boom',
                        feature: 'boom',
                        target: 'MathComponent',
                        onError: A_WorkflowStepErrorBehavior.CONTINUE,
                    },
                    {
                        id: 'after',
                        feature: 'record',
                        target: 'TrackingComponent',
                        remap: { label: { value: 'after' } },
                    },
                ],
            });

            await engine.run(wf);

            expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
            expect(executionLog).toEqual(['after']);
            expect(wf.steps.boom.error).toBeDefined();
        });

        it('Should jump to onErrorGoto when onError=goto', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'goto',
                steps: [
                    {
                        id: 'boom',
                        feature: 'boom',
                        target: 'MathComponent',
                        onError: A_WorkflowStepErrorBehavior.GOTO,
                        onErrorGoto: 'recover',
                    },
                    {
                        id: 'never',
                        feature: 'record',
                        target: 'TrackingComponent',
                        remap: { label: { value: 'never' } },
                    },
                    {
                        id: 'recover',
                        feature: 'record',
                        target: 'TrackingComponent',
                        remap: { label: { value: 'recover' } },
                    },
                ],
            });

            await engine.run(wf);

            expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
            expect(executionLog).toEqual(['recover']);
        });
    });

    // =========================================================================
    // ======================== Events =========================================
    // =========================================================================

    describe('Lifecycle events', () => {

        it('Should emit start, step and complete events', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'events',
                steps: [{
                    id: 'sum',
                    feature: 'add',
                    target: 'MathComponent',
                    remap: { a: { value: 1 }, b: { value: 1 } },
                }],
            });

            const onStart = jest.fn();
            const onStep = jest.fn();
            const onComplete = jest.fn();

            wf.on(A_WorkflowEvent.onStart, onStart);
            wf.on(A_WorkflowEvent.onStep, onStep);
            wf.on(A_WorkflowEvent.onComplete, onComplete);

            await engine.run(wf);

            expect(onStart).toHaveBeenCalledTimes(1);
            expect(onStep).toHaveBeenCalledTimes(1);
            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it('Should emit a skip event for skipped steps', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'skip-event',
                steps: [{
                    id: 'maybe',
                    feature: 'record',
                    target: 'TrackingComponent',
                    condition: { fn: 'falsy', left: { value: 1 } },
                    remap: { label: { value: 'maybe' } },
                }],
            });

            const onSkip = jest.fn();
            wf.on(A_WorkflowEvent.onSkip, onSkip);

            await engine.run(wf);

            expect(onSkip).toHaveBeenCalledTimes(1);
        });
    });

    // =========================================================================
    // ======================== Distributed Pause / Resume =====================
    // =========================================================================

    describe('Distributed serialize / deserialize / resume', () => {

        it('Should pause at a transfer boundary, serialize, then resume on a fresh scope', async () => {
            // ---- Service A: start and run until the transfer boundary -------
            const engineA = bootstrap();
            const def: A_TYPES__WorkflowDefinition = {
                name: 'distributed',
                steps: [
                    {
                        id: 'sum',
                        feature: 'add',
                        target: 'MathComponent',
                        remap: { a: { from: 'params.a' }, b: { from: 'params.b' } },
                        transferAfter: true,
                    },
                    {
                        id: 'twice',
                        feature: 'double',
                        target: 'MathComponent',
                        remap: { value: { from: 'steps.sum.sum' } },
                    },
                ],
            };

            const wfA = engineA.build(def, { a: 3, b: 4 });
            await engineA.run(wfA);

            // Paused after the first step.
            expect(wfA.status).toBe(A_Workflow_Status.PAUSED);
            expect(wfA.cursor).toBe(1);
            expect(wfA.steps.sum).toEqual({ sum: 7 });

            // ---- Serialize for transfer -------------------------------------
            const wire: A_TYPES__Workflow_Serialized = JSON.parse(JSON.stringify(wfA.toJSON()));
            expect(wire.status).toBe(A_Workflow_Status.PAUSED);
            expect(wire.cursor).toBe(1);

            // ---- Service B: brand-new context with its own registrations ----
            A_Context.reset();
            const engineB = bootstrap();

            const wfB = new A_Workflow(wire);
            expect(wfB.status).toBe(A_Workflow_Status.PAUSED);
            expect(wfB.cursor).toBe(1);
            expect(wfB.steps.sum).toEqual({ sum: 7 });

            await engineB.resume(wfB);

            expect(wfB.status).toBe(A_Workflow_Status.COMPLETED);
            expect(wfB.steps.twice).toEqual({ value: 14 });
        });

        it('Should keep the same identity across serialize/deserialize', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'identity',
                steps: [
                    {
                        id: 'a',
                        feature: 'record',
                        target: 'TrackingComponent',
                        remap: { label: { value: 'a' } },
                        transferAfter: true,
                    },
                    {
                        id: 'b',
                        feature: 'record',
                        target: 'TrackingComponent',
                        remap: { label: { value: 'b' } },
                    },
                ],
            });

            await engine.run(wf);
            const id = wf.aseid.toString();

            const wire = JSON.parse(JSON.stringify(wf.toJSON()));
            const restored = new A_Workflow(wire);

            expect(restored.aseid.toString()).toBe(id);
        });
    });

    // =========================================================================
    // ======================== Feature Loader (template steps) ================
    // =========================================================================

    describe('A_FeatureLoader template steps', () => {

        it('Should execute a step defined entirely by an inline template', async () => {
            const engine = bootstrap();
            const wf = engine.build({
                name: 'templated',
                steps: [{
                    id: 'sum',
                    template: {
                        name: 'inline-add',
                        steps: [{ target: 'MathComponent', handler: 'add' }],
                    },
                    remap: { a: { value: 8 }, b: { value: 9 } },
                }],
            });

            await engine.run(wf);

            expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
            expect(wf.steps.sum).toEqual({ sum: 17 });
        });

        it('Should reject a template referencing an unregistered target', () => {
            const scope = new A_Scope({ name: 'loader-test', components: [A_FeatureLoader] });
            const loader = scope.resolve(A_FeatureLoader)!;

            expect(() => loader.load(
                { name: 'bad', steps: [{ target: 'NopeComponent', handler: 'x' }] },
                scope
            )).toThrow(A_WorkflowError);
        });
    });

    // =========================================================================
    // ======================== A_WorkflowFunctions unit =======================
    // =========================================================================

    describe('A_WorkflowFunctions', () => {

        const fns = new A_WorkflowFunctions();
        const ctx = {
            params: { id: 7, name: 'ada', tags: ['x', 'y'] },
            steps: { login: { token: 'abc' } },
        };

        it('Should resolve literal, path and function value sources', () => {
            expect(fns.resolveValue(ctx, { value: 42 })).toBe(42);
            expect(fns.resolveValue(ctx, { from: 'params.id' })).toBe(7);
            expect(fns.resolveValue(ctx, { from: 'steps.login.token' })).toBe('abc');
            expect(fns.resolveValue(ctx, { from: 'missing.path' })).toBeUndefined();
            expect(fns.resolveValue(ctx, {
                fn: 'concat',
                args: [{ value: 'user-' }, { from: 'params.id' }],
            })).toBe('user-7');
            expect(fns.resolveValue(ctx, { fn: 'uppercase', args: [{ from: 'params.name' }] })).toBe('ADA');
            expect(fns.resolveValue(ctx, { fn: 'sum', args: [{ value: 2 }, { value: 3 }] })).toBe(5);
        });

        it('Should build a remapped params object (with nested keys)', () => {
            const out = fns.remap(ctx, {
                userId: { from: 'params.id' },
                'auth.token': { from: 'steps.login.token' },
            });
            expect(out).toEqual({ userId: 7, auth: { token: 'abc' } });
        });

        it('Should evaluate comparison conditions', () => {
            expect(fns.evaluate(ctx, { fn: 'equals', left: { from: 'params.id' }, right: { value: 7 } })).toBe(true);
            expect(fns.evaluate(ctx, { fn: 'notEquals', left: { from: 'params.id' }, right: { value: 1 } })).toBe(true);
            expect(fns.evaluate(ctx, { fn: 'gt', left: { from: 'params.id' }, right: { value: 5 } })).toBe(true);
            expect(fns.evaluate(ctx, { fn: 'lte', left: { from: 'params.id' }, right: { value: 7 } })).toBe(true);
            expect(fns.evaluate(ctx, { fn: 'exists', left: { from: 'params.name' } })).toBe(true);
            expect(fns.evaluate(ctx, { fn: 'notExists', left: { from: 'params.missing' } })).toBe(true);
            expect(fns.evaluate(ctx, { fn: 'in', left: { value: 'x' }, right: { from: 'params.tags' } })).toBe(true);
        });

        it('Should evaluate logical combinators', () => {
            expect(fns.evaluate(ctx, {
                fn: 'and',
                conditions: [
                    { fn: 'equals', left: { from: 'params.id' }, right: { value: 7 } },
                    { fn: 'exists', left: { from: 'params.name' } },
                ],
            })).toBe(true);

            expect(fns.evaluate(ctx, {
                fn: 'or',
                conditions: [
                    { fn: 'equals', left: { from: 'params.id' }, right: { value: 1 } },
                    { fn: 'equals', left: { from: 'params.id' }, right: { value: 7 } },
                ],
            })).toBe(true);

            expect(fns.evaluate(ctx, {
                fn: 'not',
                conditions: [{ fn: 'equals', left: { from: 'params.id' }, right: { value: 1 } }],
            })).toBe(true);
        });

        it('Should treat a missing condition as truthy', () => {
            expect(fns.evaluate(ctx, undefined)).toBe(true);
        });

        it('Should throw on an unknown condition function', () => {
            expect(() => fns.evaluate(ctx, { fn: 'nope' as any })).toThrow(A_WorkflowError);
        });
    });
});


// =============================================================================
// ============== Inheritance-based workflows (the native pattern) =============
// =============================================================================

/**
 * The preferred A-Concept form: subclass A_Workflow, declare the recipe via
 * setup(), and implement steps as feature handlers ON the workflow itself.
 * Run it directly with `wf.run()` — no engine required.
 */
class DailyAggregationWorkflow extends A_Workflow {

    protected setup(): A_TYPES__WorkflowDefinition {
        return {
            name: 'Daily stats aggregation and storing to the temporary cache',
            steps: [
                {
                    id: 'aggregate',
                    feature: 'aggregate',
                    remap: { date: { from: 'params.date' } },
                    transferAfter: true,
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
    ) {
        // The handler resolves through the workflow's own scope.
        ctx.succeed({ count: 100, date: ctx.params.date });
    }

    @A_Feature.Extend()
    async store(
        @A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext
    ) {
        ctx.succeed({ stored: true, cachedCount: ctx.params.count });
    }
}

/** A subclass that only reads from its constructor params (no transfer). */
class GreetingWorkflow extends A_Workflow {
    protected setup(): A_TYPES__WorkflowDefinition {
        return {
            name: 'greeting',
            steps: [{
                id: 'greet',
                feature: 'greet',
                remap: { name: { from: 'params.name' } },
            }],
        };
    }

    @A_Feature.Extend()
    async greet(@A_Inject(A_WorkflowStepContext) ctx: A_WorkflowStepContext) {
        ctx.succeed({ message: `Hello, ${ctx.params.name}!` });
    }
}


describe('A-Workflows — inheritance form', () => {

    beforeEach(() => {
        A_Context.reset();
    });

    it('Should run a subclass directly via wf.run() with no engine', async () => {
        const wf = new GreetingWorkflow({ params: { name: 'Ada' } });
        A_Context.root.register(wf);

        await wf.run();

        expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
        expect(wf.steps.greet).toEqual({ message: 'Hello, Ada!' });
        expect(wf.code).toBe('greeting-workflow');
    });

    it('Should derive the recipe from setup() (no definition passed)', () => {
        const wf = new GreetingWorkflow({ params: { name: 'x' } });
        expect(wf.definition.name).toBe('greeting');
        expect(wf.definition.steps).toHaveLength(1);
    });

    it('Should support construction with no arguments at all', async () => {
        const wf = new GreetingWorkflow();
        A_Context.root.register(wf);

        await wf.run();

        // params.name is undefined → "Hello, undefined!" but still completes.
        expect(wf.status).toBe(A_Workflow_Status.COMPLETED);
        expect(wf.steps.greet.message).toContain('Hello,');
    });

    it('Should pause, serialize, transfer, and resume a SUBCLASS across services', async () => {
        // ---- Service A ---------------------------------------------------
        const wfA = new DailyAggregationWorkflow({ params: { date: '2026-06-09' } });
        A_Context.root.register(wfA);

        await wfA.run();

        // Paused after the aggregate step (transferAfter).
        expect(wfA.status).toBe(A_Workflow_Status.PAUSED);
        expect(wfA.cursor).toBe(1);
        expect(wfA.steps.aggregate).toEqual({ count: 100, date: '2026-06-09' });

        // ---- Transfer over the wire -------------------------------------
        const wire = JSON.parse(JSON.stringify(wfA.toJSON()));

        // ---- Service B: fresh context, reconstruct the SAME subclass ----
        A_Context.reset();
        const wfB = new DailyAggregationWorkflow(wire);
        A_Context.root.register(wfB);

        // Logic restored from the class; state restored from the wire.
        expect(wfB.status).toBe(A_Workflow_Status.PAUSED);
        expect(wfB.cursor).toBe(1);
        expect(wfB.steps.aggregate).toEqual({ count: 100, date: '2026-06-09' });
        expect(wfB.aseid.toString()).toBe(wfA.aseid.toString());

        await wfB.run(); // resumes a paused workflow

        expect(wfB.status).toBe(A_Workflow_Status.COMPLETED);
        expect(wfB.steps.store).toEqual({ stored: true, cachedCount: 100 });
    });

    it('Should let the class recipe win over a serialized definition', () => {
        const wfA = new DailyAggregationWorkflow({ params: {} });
        A_Context.root.register(wfA);

        // Tamper with the wire definition; the class setup() must take over.
        const wire = JSON.parse(JSON.stringify(wfA.toJSON()));
        wire.definition = { name: 'tampered', steps: [{ id: 'evil', feature: 'evil' }] };

        const wfB = new DailyAggregationWorkflow(wire);
        expect(wfB.definition.name).toBe('Daily stats aggregation and storing to the temporary cache');
        expect(wfB.definition.steps.map((s: any) => s.id)).toEqual(['aggregate', 'store']);
    });
});

