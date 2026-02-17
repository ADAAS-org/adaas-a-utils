import { A_Component, A_Context, A_Dependency, A_Error, A_Feature, A_Inject, A_Scope } from '@adaas/a-concept';
import { A_OperationContext } from '@adaas/a-utils/a-operation';
import { A_StateMachine, A_StateMachineError, A_StateMachineFeatures, A_StateMachineTransition } from '@adaas/a-utils/a-state-machine';

jest.retryTimes(0);

describe('A-StateMachine tests', () => {

    it('Should allow to create a state machine', async () => {
        interface SimpleStates {
            idle: { message: string };
            running: { message: string };
        }

        const stateMachine = new A_StateMachine<SimpleStates>();
        A_Context.root.register(stateMachine);

        expect(stateMachine).toBeInstanceOf(A_StateMachine);
        expect(stateMachine).toBeInstanceOf(A_Component);
    });

    it('Should allow to initialize a state machine', async () => {
        const stateMachine = new A_StateMachine();
        A_Context.root.register(stateMachine);

        await stateMachine.ready;

        expect(stateMachine.ready).toBeInstanceOf(Promise);
    });

    it('Should allow to create a state machine with custom generic types', async () => {
        interface OrderStates {
            pending: { orderId: string; amount: number };
            processing: { orderId: string; amount: number; processedBy: string };
            completed: { orderId: string; amount: number; completedAt: Date };
            cancelled: { orderId: string; amount: number; reason: string };
        }

        class OrderStateMachine extends A_StateMachine<OrderStates> { }

        const orderMachine = new OrderStateMachine();
        A_Context.root.register(orderMachine);

        expect(orderMachine).toBeInstanceOf(A_StateMachine);
        expect(orderMachine).toBeInstanceOf(A_Component);
    });

    it('Should allow to execute a basic transition', async () => {
        interface SimpleStates {
            idle: { timestamp: Date };
            running: { timestamp: Date };
        }

        const stateMachine = new A_StateMachine<SimpleStates>();
        A_Context.root.register(stateMachine);

        await stateMachine.ready;

        const transitionData = { timestamp: new Date() };
        await stateMachine.transition('idle', 'running', transitionData);

        // If we get here without throwing, the transition succeeded
        expect(true).toBe(true);
    });

    it('Should execute transition lifecycle hooks in correct order', async () => {
        const lifecycleOrder: string[] = [];

        interface TestStates {
            start: { value: string };
            end: { value: string };
        }

        class TestStateMachine extends A_StateMachine<TestStates> {
            @A_Feature.Extend()
            async [A_StateMachineFeatures.onInitialize](): Promise<void> {
                lifecycleOrder.push('initialize');
            }

            @A_Feature.Extend()
            async [A_StateMachineFeatures.onBeforeTransition](): Promise<void> {
                lifecycleOrder.push('beforeTransition');
            }

            @A_Feature.Extend()
            async [A_StateMachineFeatures.onAfterTransition](): Promise<void> {
                lifecycleOrder.push('afterTransition');
            }
        }

        const stateMachine = new TestStateMachine();
        A_Context.root.register(stateMachine);

        await stateMachine.ready;
        await stateMachine.transition('start', 'end', { value: 'test' });

        expect(lifecycleOrder).toEqual(['initialize', 'beforeTransition', 'afterTransition']);
    });

    it('Should allow custom transition logic', async () => {
        interface OrderStates {
            pending: { orderId: string; amount: number };
            validated: { orderId: string; amount: number; validatedAt: Date };
        }

        class OrderStateMachine extends A_StateMachine<OrderStates> {
            async pending_validated(scope: A_Scope): Promise<void> {
                const operation = scope.resolve(A_OperationContext)!;
                const orderData = operation.params.props;

                // Custom validation logic
                if (orderData.amount <= 0) {
                    throw new Error('Order amount must be positive');
                }

                operation.succeed({
                    ...orderData,
                    validatedAt: new Date()
                });
            }
        }

        const orderMachine = new OrderStateMachine();
        A_Context.root.register(orderMachine);

        await orderMachine.ready;

        // Should succeed with valid data
        await orderMachine.transition('pending', 'validated', {
            orderId: 'ORD-001',
            amount: 99.99
        });

        // Should fail with invalid data
        try {
            await orderMachine.transition('pending', 'validated', {
                orderId: 'ORD-002',
                amount: 0
            });
        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError.message).toBe('Order amount must be positive');
        }

    });

    it('Should handle transition errors correctly', async () => {
        interface ErrorStates {
            start: { value: string };
            end: { value: string };
        }

        class ErrorStateMachine extends A_StateMachine<ErrorStates> {
            async start_end(scope: A_Scope): Promise<void> {
                throw new Error('Custom transition error');
            }
        }

        const stateMachine = new ErrorStateMachine();
        A_Context.root.register(stateMachine);

        await stateMachine.ready;

        try {
            await stateMachine.transition('start', 'end', { value: 'test' });
        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError.message).toBe('Custom transition error');
        }
    });

    it('Should allow external components to extend transition behavior', async () => {
        A_Context.reset();

        interface TestStates {
            idle: { message: string };
            active: { message: string };
        }

        class TestStateMachine extends A_StateMachine<TestStates> { }

        class TestComponent extends A_Component {
            static called = false;

            @A_Feature.Extend({ scope: [TestStateMachine] })
            async [A_StateMachineFeatures.onBeforeTransition](
                @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
            ): Promise<void> {
                TestComponent.called = true;
                const { props } = transition.params;

                if (!props?.message) {
                    throw new Error('Message is required');
                }
            }
        }

        A_Context.root.register(TestComponent);

        const stateMachine = new TestStateMachine();
        A_Context.root.register(stateMachine);

        await stateMachine.ready;

        // Should fail without message
        try {
            await stateMachine.transition('idle', 'active', { message: '' })
        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError.message).toBe('Message is required');
        }


        // Should succeed with message
        await stateMachine.transition('idle', 'active', { message: 'Hello' });

        expect(TestComponent.called).toBe(true);
    });

    describe('State Machine Lifecycle Tests', () => {
        beforeEach(() => {
            A_Context.reset();
        });

        it('Should properly initialize state machine', async () => {
            let initializeCalled = false;

            class InitTestMachine extends A_StateMachine {
                @A_Feature.Extend()
                async [A_StateMachineFeatures.onInitialize](): Promise<void> {
                    initializeCalled = true;
                }
            }

            const machine = new InitTestMachine();
            A_Context.root.register(machine);

            expect(initializeCalled).toBe(false);

            await machine.ready;

            expect(initializeCalled).toBe(true);
        });

        it('Should call initialization only once', async () => {
            let initializeCallCount = 0;

            class OnceInitMachine extends A_StateMachine {
                @A_Feature.Extend()
                async [A_StateMachineFeatures.onInitialize](): Promise<void> {
                    initializeCallCount++;
                }
            }

            const machine = new OnceInitMachine();
            A_Context.root.register(machine);

            await machine.ready;
            await machine.ready;
            await machine.ready;

            expect(initializeCallCount).toBe(1);
        });

        it('Should handle initialization errors', async () => {
            class FailingInitMachine extends A_StateMachine {
                @A_Feature.Extend()
                async [A_StateMachineFeatures.onInitialize](): Promise<void> {
                    throw new Error('Initialization failed');
                }
            }

            const machine = new FailingInitMachine();
            A_Context.root.register(machine);

            try {
                await machine.ready;
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect((error as A_Error).originalError.message).toBe('Initialization failed');
            }
        });
    });

    describe('Transition Validation Tests', () => {
        beforeEach(() => {
            A_Context.reset();
        });

        it('Should validate transitions in beforeTransition hook', async () => {
            interface ValidatedStates {
                draft: { content: string };
                published: { content: string; publishedAt: Date };
            }

            class ValidatedMachine extends A_StateMachine<ValidatedStates> {

                @A_Feature.Extend()
                async [A_StateMachineFeatures.onBeforeTransition](
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
                ): Promise<void> {
                    const { props } = transition.params;

                    if (transition.to === 'published' && (!props?.content || props.content.length < 10)) {
                        throw new Error('Content must be at least 10 characters to publish');
                    }
                }
            }

            const machine = new ValidatedMachine();
            A_Context.root.register(machine);
            await machine.ready;

            // Should fail with short content
            try {
                await machine.transition('draft', 'published', { content: 'short' })
            } catch (error) {
                expect(error).toBeInstanceOf(A_Error);
                expect((error as A_Error).originalError.message).toBe('Content must be at least 10 characters to publish');
            }



            // Should succeed with long content
            await machine.transition('draft', 'published', {
                content: 'This is a long enough content for publishing',
                publishedAt: new Date()
            });
        });

        it('Should allow conditional transitions based on current state', async () => {
            interface ConditionalStates {
                pending: { orderId: string };
                approved: { orderId: string; approvedBy: string };
                rejected: { orderId: string; rejectedBy: string };
                completed: { orderId: string; completedAt: Date };
            }

            class ConditionalMachine extends A_StateMachine<ConditionalStates> {
                private currentState: keyof ConditionalStates = 'pending';

                @A_Feature.Extend()
                async [A_StateMachineFeatures.onBeforeTransition](
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition
                ): Promise<void> {

                    // Only approved orders can be completed
                    if (transition.to === 'completed' && transition.from !== 'approved') {
                        throw new A_Error(
                            'Only approved orders can be completed',
                            `Unable to transition from ${transition.from} to ${transition.to}`
                        );
                    }
                }

                @A_Feature.Extend()
                async [A_StateMachineFeatures.onAfterTransition](
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition
                ): Promise<void> {
                    this.currentState = transition.to as keyof ConditionalStates;
                }

                getCurrentState(): keyof ConditionalStates {
                    return this.currentState;
                }
            }

            const machine = new ConditionalMachine();
            A_Context.root.register(machine);
            await machine.ready;

            // Should fail to complete from pending

            try {
                await machine.transition('pending', 'completed', {
                    orderId: 'ORD-001',
                    completedAt: new Date()
                })
            } catch (error) {
                expect(error).toBeInstanceOf(A_Error);
                expect((error as A_Error).originalError.title).toBe('Only approved orders can be completed');

            }

            // Should succeed: pending -> approved -> completed
            await machine.transition('pending', 'approved', {
                orderId: 'ORD-001',
                approvedBy: 'manager'
            });

            expect(machine.getCurrentState()).toBe('approved');

            await machine.transition('approved', 'completed', {
                orderId: 'ORD-001',
                completedAt: new Date()
            });

            expect(machine.getCurrentState()).toBe('completed');
        });
    });

    describe('Error Handling Tests', () => {
        beforeEach(() => {
            A_Context.reset();
        });

        it('Should call onError hook when transition fails', async () => {
            let errorHandled = false;
            let capturedError: A_StateMachineError | undefined;

            interface ErrorStates {
                start: { value: string };
                end: { value: string };
            }

            class ErrorHandlingMachine extends A_StateMachine<ErrorStates> {
                @A_Feature.Extend()
                async [A_StateMachineFeatures.onError](): Promise<void> {
                    errorHandled = true;
                    // In real scenario, you might resolve the error from scope
                    // capturedError = scope.resolve(A_StateMachineError);
                }

                @A_Feature.Extend()
                async start_end(): Promise<void> {
                    throw new Error('Transition failed');
                }
            }

            const machine = new ErrorHandlingMachine();
            A_Context.root.register(machine);
            await machine.ready;

            await expect(
                machine.transition('start', 'end', { value: 'test' })
            ).rejects.toThrow(A_StateMachineError);

            expect(errorHandled).toBe(true);
        });

        it('Should wrap original errors in A_StateMachineError', async () => {
            interface ErrorStates {
                start: { value: string };
                end: { value: string };
            }

            class ErrorWrappingMachine extends A_StateMachine<ErrorStates> {
                async start_end(): Promise<void> {
                    throw new Error('Original error message');
                }
            }

            const machine = new ErrorWrappingMachine();
            A_Context.root.register(machine);
            await machine.ready;

            try {
                await machine.transition('start', 'end', { value: 'test' });
            } catch (error) {
                expect(error).toBeInstanceOf(A_StateMachineError);
                expect((error as A_StateMachineError).title).toBe(A_StateMachineError.TransitionError);
                expect((error as A_StateMachineError).originalError).toBeInstanceOf(Error);
                expect((error as A_StateMachineError).originalError.message).toBe('Original error message');
            }
        });

        it('Should handle errors in lifecycle hooks', async () => {
            interface HookErrorStates {
                start: { value: string };
                end: { value: string };
            }

            class HookErrorMachine extends A_StateMachine<HookErrorStates> {
                @A_Feature.Extend()
                async [A_StateMachineFeatures.onBeforeTransition](): Promise<void> {
                    throw new Error('Before transition error');
                }
            }

            const machine = new HookErrorMachine();
            A_Context.root.register(machine);
            await machine.ready;

            await expect(
                machine.transition('start', 'end', { value: 'test' })
            ).rejects.toThrow(A_StateMachineError);
        });
    });

    describe('Complex Workflow Tests', () => {
        beforeEach(() => {
            A_Context.reset();
        });

        it('Should handle multi-step workflow with state tracking', async () => {
            interface WorkflowStates {
                created: { docId: string; author: string };
                draft: { docId: string; author: string; content: string };
                review: { docId: string; author: string; content: string; reviewer: string };
                approved: { docId: string; author: string; content: string; approvedBy: string; approvedAt: Date };
                published: { docId: string; author: string; content: string; publishedAt: Date; version: number };
            }

            class DocumentWorkflow extends A_StateMachine<WorkflowStates> {
                private history: Array<{ from: string; to: string; timestamp: Date }> = [];

                @A_Feature.Extend()
                async [A_StateMachineFeatures.onAfterTransition](
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
                ): Promise<void> {

                    this.history.push({
                        from: transition.from,
                        to: transition.to,
                        timestamp: new Date()
                    });
                }

                @A_Feature.Extend()
                async created_draft(
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
                ): Promise<void> {
                    const data = transition.params.props;

                    transition.succeed({
                        ...data,
                        content: 'Initial draft content'
                    });
                }

                @A_Feature.Extend()
                async draft_review(
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
                ): Promise<void> {
                    const data = transition.params.props;

                    if (!data.content || data.content.length < 10) {
                        throw new Error('Content too short for review');
                    }

                    transition.succeed({
                        ...data,
                        reviewer: 'reviewer@example.com'
                    });
                }

                @A_Feature.Extend()
                async review_approved(
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
                ): Promise<void> {
                    const data = transition.params.props;

                    transition.succeed({
                        docId: data.docId,
                        author: data.author,
                        content: data.content,
                        approvedBy: data.reviewer,
                        approvedAt: new Date()
                    });
                }

                @A_Feature.Extend()
                async approved_published(
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
                ): Promise<void> {
                    const data = transition.params.props;

                    transition.succeed({
                        docId: data.docId,
                        author: data.author,
                        content: data.content,
                        publishedAt: new Date(),
                        version: 1
                    });
                }

                getHistory() {
                    return this.history;
                }
            }

            const workflow = new DocumentWorkflow();
            A_Context.root.register(workflow);
            await workflow.ready;

            const docData = {
                docId: 'DOC-001',
                author: 'author@example.com'
            };

            // Execute complete workflow
            await workflow.transition('created', 'draft', docData);

            await workflow.transition('draft', 'review', {
                ...docData,
                content: 'This is a comprehensive document with enough content for review'
            });

            await workflow.transition('review', 'approved', {
                ...docData,
                content: 'This is a comprehensive document with enough content for review',
                reviewer: 'reviewer@example.com'
            });

            await workflow.transition('approved', 'published', {
                docId: 'DOC-001',
                author: 'author@example.com',
                content: 'This is a comprehensive document with enough content for review',
                approvedBy: 'reviewer@example.com',
                approvedAt: new Date()
            });

            const history = workflow.getHistory();
            expect(history).toHaveLength(4);
            expect(history[0].from).toBe('created');
            expect(history[0].to).toBe('draft');
            expect(history[3].from).toBe('approved');
            expect(history[3].to).toBe('published');
        });

        it('Should handle parallel state machines with shared components', async () => {
            A_Context.reset();

            interface SharedStates {
                init: { id: string };
                processed: { id: string; processedAt: Date };
            }

            class SharedMachine extends A_StateMachine<SharedStates> { }

            class SharedLogger extends A_Component {
                static logs: string[] = [];

                @A_Feature.Extend({ scope: [SharedMachine] })
                async [A_StateMachineFeatures.onAfterTransition](
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition,
                ): Promise<void> {
                    const { from, to, props } = transition.params;
                    SharedLogger.logs.push(`${props.id}: ${String(from)} -> ${String(to)}`);
                }
            }

            A_Context.root.register(SharedLogger);

            const machine1 = new SharedMachine();
            const machine2 = new SharedMachine();

            A_Context.root.register(machine1);
            A_Context.root.register(machine2);

            await Promise.all([machine1.ready, machine2.ready]);

            await Promise.all([
                machine1.transition('init', 'processed', { id: 'machine1', processedAt: new Date() }),
                machine2.transition('init', 'processed', { id: 'machine2', processedAt: new Date() })
            ]);

            expect(SharedLogger.logs).toHaveLength(2);
            expect(SharedLogger.logs).toContain('machine1: init -> processed');
            expect(SharedLogger.logs).toContain('machine2: init -> processed');
        });
    });

    describe('Operation Context Tests', () => {
        beforeEach(() => {
            A_Context.reset();
        });

        it('Should provide correct operation context in transitions', async () => {
            interface ContextStates {
                start: { userId: string; action: string };
                end: { userId: string; action: string; result: string };
            }

            class ContextMachine extends A_StateMachine<ContextStates> {
                async start_end(scope: A_Scope): Promise<void> {
                    const operation = scope.resolve(A_OperationContext)!;

                    expect(operation).toBeDefined();
                    expect(operation.name).toBe('start_end');
                    expect(operation.params).toBeDefined();
                    expect(operation.params.from).toBe('start');
                    expect(operation.params.to).toBe('end');
                    expect(operation.params.props).toEqual({
                        userId: 'user123',
                        action: 'test'
                    });

                    operation.succeed({
                        userId: operation.params.props.userId,
                        action: operation.params.props.action,
                        result: 'success'
                    });
                }
            }

            const machine = new ContextMachine();
            A_Context.root.register(machine);
            await machine.ready;

            await machine.transition('start', 'end', {
                userId: 'user123',
                action: 'test'
            });
        });

        it('Should handle operation results correctly', async () => {
            interface ResultStates {
                input: { data: string };
                output: { data: string; processed: boolean };
            }

            let capturedResult: any;

            class ResultMachine extends A_StateMachine<ResultStates> {

                @A_Feature.Extend()
                async [A_StateMachineFeatures.onAfterTransition](
                    @A_Inject(A_Scope) scope: A_Scope,
                    @A_Dependency.Required()
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition
                ): Promise<void> {
                    capturedResult = transition.result;
                }

                @A_Feature.Extend()
                async  [A_StateMachineFeatures.onBeforeTransition](...args: any[]): Promise<void> {
                }

                @A_Feature.Extend()
                async input_output(
                    @A_Inject(A_Scope) scope: A_Scope,
                    @A_Inject(A_StateMachineTransition) transition: A_StateMachineTransition
                ): Promise<void> {
                    transition.succeed({
                        data: transition.params.props.data.toUpperCase(),
                        processed: true
                    });

                }
            }

            const scope = new A_Scope({
                components: [ResultMachine]
            });

            const machine = scope.resolve(ResultMachine)!;

            await machine.transition('input', 'output', { data: 'hello world' });

            expect(capturedResult).toEqual({
                data: 'HELLO WORLD',
                processed: true
            });
        });
    });
});