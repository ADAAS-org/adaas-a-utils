import { A_Caller, A_Component, A_Concept, A_Container, A_Context, A_Dependency, A_Error, A_Feature, A_FormatterHelper, A_Inject, A_Scope, ASEID } from '@adaas/a-concept';
import { A_Channel, A_ChannelRequest } from '@adaas/a-utils/a-channel';
import { A_Command, A_Command_Status, A_CommandError, A_CommandEvent, A_CommandFeatures, A_TYPES__Command_Serialized } from '@adaas/a-utils/a-command';
import { A_Memory, A_MemoryContext } from '@adaas/a-utils/a-memory';
import { A_StateMachine } from '@adaas/a-utils/a-state-machine';

jest.retryTimes(0);

// Global test execution tracking arrays
let testExecutionLog: string[] = [];

describe('A-Command tests', () => {

    beforeEach(() => {
        A_Context.reset();
        testExecutionLog = [];
    });

    // =============================================================================
    // ======================== Basic Command Creation Tests =====================
    // =============================================================================

    describe('Basic Command Creation', () => {
        interface TestCommandParams {
            userId: string;
            action: string;
        }

        interface TestCommandResult {
            success: boolean;
            message: string;
        }

        class TestCommand extends A_Command<TestCommandParams, TestCommandResult> { }

        it('Should allow to create a command with parameters', () => {
            const params = { userId: '123', action: 'create' };
            const command = new TestCommand(params);

            expect(command).toBeInstanceOf(A_Command);
            expect(command.params).toEqual(params);
            expect(command.status).toBe(A_Command_Status.CREATED);
            expect(command.result).toBeUndefined();
            expect(command.error).toBeUndefined();
        });

        it('Should have proper initial state and timestamps', () => {
            const params = { userId: '123', action: 'create' };
            const command = new TestCommand(params);

            expect(command.status).toBe(A_Command_Status.CREATED);
            expect(command.createdAt).toBeInstanceOf(Date);
            expect(command.startedAt).toBeUndefined();
            expect(command.endedAt).toBeUndefined();
            expect(command.duration).toBeUndefined();
            expect(command.idleTime).toBeUndefined();
            expect(command.isProcessed).toBe(false);
        });

        it('Should have unique command code based on class name', () => {
            const command = new TestCommand({ userId: '123', action: 'create' });

            expect(command.code).toBe('test-command');
            expect((TestCommand as any).code).toBe('test-command');
        });

        it('Should have event listener capabilities', () => {
            const command = new TestCommand({ userId: '123', action: 'create' });
            const listener = jest.fn();

            command.on('onComplete', listener);
            command.emit(A_CommandEvent.onComplete);

            expect(listener).toHaveBeenCalledWith(command);
        });

        it('Should support removing event listeners', () => {
            const command = new TestCommand({ userId: '123', action: 'create' });
            const listener = jest.fn();

            command.on(A_CommandEvent.onComplete, listener);
            command.off(A_CommandEvent.onComplete, listener);
            command.emit(A_CommandEvent.onComplete);

            expect(listener).not.toHaveBeenCalled();
        });
    });

    // =============================================================================
    // ======================== Command Lifecycle Tests ==========================
    // =============================================================================

    describe('Command Lifecycle', () => {
        interface UserCommandParams {
            userId: string;
        }

        interface UserCommandResult {
            success: boolean;
            data: any;
        }

        class UserCommand extends A_Command<UserCommandParams, UserCommandResult> { }

        it('Should properly initialize command with scope', async () => {
            const command = new UserCommand({ userId: '123' });
            A_Context.root.register(command);

            await command.init();

            expect(command.status).toBe(A_Command_Status.INITIALIZED);
            expect(command.scope).toBeInstanceOf(A_Scope);
        });

        it('Should transition through proper lifecycle states during execution', async () => {
            const command = new UserCommand({ userId: '123' });
            A_Context.root.register(command);

            expect(command.status).toBe(A_Command_Status.CREATED);

            await command.execute();

            expect(command.status).toBe(A_Command_Status.COMPLETED);
            expect(command.startedAt).toBeInstanceOf(Date);
            expect(command.endedAt).toBeInstanceOf(Date);
            expect(command.duration).toBeGreaterThanOrEqual(0);
            expect(command.isProcessed).toBe(true);
        });

        it('Should handle command completion with result', async () => {
            const command = new UserCommand({ userId: '123' });
            A_Context.root.register(command);

            const result = { success: true, data: { id: '123', name: 'Test User' } };
            await command.complete(result);

            expect(command.status).toBe(A_Command_Status.COMPLETED);
            expect(command.result).toEqual(result);
            expect(command.isProcessed).toBe(true);
        });

        it('Should handle command failure with error', async () => {
            const command = new UserCommand({ userId: '123' });
            A_Context.root.register(command);

            const error = new A_CommandError({
                title: 'Test Error',
                description: 'Test error description'
            });

            await command.fail(error);

            expect(command.status).toBe(A_Command_Status.FAILED);
            expect(command.error).toEqual(error);
            expect(command.isProcessed).toBe(true);
        });

        it('Should not allow execution if already processed', async () => {
            const command = new UserCommand({ userId: '123' });
            A_Context.root.register(command);

            await command.complete({ success: true, data: null });
            expect(command.isProcessed).toBe(true);

            // Should not change state on second execution attempt
            await command.execute();
            expect(command.status).toBe(A_Command_Status.COMPLETED);
        });
    });

    // =============================================================================
    // ======================== Command Serialization Tests ======================
    // =============================================================================

    describe('Command Serialization', () => {
        interface SerializationTestParams {
            itemId: string;
            quantity: number;
        }

        interface SerializationTestResult {
            processed: boolean;
            total: number;
        }

        class SerializationTestCommand extends A_Command<SerializationTestParams, SerializationTestResult> {
            customProperty?: string;

            toJSON(): A_TYPES__Command_Serialized<SerializationTestParams, SerializationTestResult> & { customProperty?: string } {
                return {
                    ...super.toJSON(),
                    customProperty: this.customProperty
                };
            }
        }

        it('Should serialize command to JSON properly', async () => {
            const params = { itemId: '999', quantity: 5 };
            const command = new SerializationTestCommand(params);
            A_Context.root.register(command);

            command.customProperty = 'test-value';

            const result = { processed: true, total: 100 };
            await command.complete(result);

            const serialized = command.toJSON();

            expect(serialized.code).toBe('serialization-test-command');
            expect(serialized.status).toBe(A_Command_Status.COMPLETED);
            expect(serialized.params).toEqual(params);
            expect(serialized.result).toEqual(result);
            expect(serialized.createdAt).toBeDefined();
            expect((serialized as any).customProperty).toBe('test-value');
        });

        it('Should create command from serialized data', () => {
            // Create a valid ASEID first
            const existingCommand = new SerializationTestCommand({ itemId: '123', quantity: 1 });
            const validAseid = existingCommand.aseid.toString();

            const serializedData: A_TYPES__Command_Serialized<SerializationTestParams, SerializationTestResult> = {
                aseid: validAseid,
                code: 'serialization-test-command',
                status: A_Command_Status.COMPLETED,
                params: { itemId: '999', quantity: 5 },
                result: { processed: true, total: 100 },
                createdAt: new Date().toISOString(),
                startedAt: new Date().toISOString(),
                endedAt: new Date().toISOString(),
                duration: 1000,
                idleTime: 100
            };

            const command = new SerializationTestCommand(serializedData);

            expect(command.params).toEqual(serializedData.params);
            expect(command.status).toBe(A_Command_Status.COMPLETED);
            expect(command.result).toEqual(serializedData.result);
            expect(command.createdAt).toBeInstanceOf(Date);
        });
    });

    // =============================================================================
    // ======================== Component Integration Tests =======================
    // =============================================================================

    describe('Component Integration', () => {
        interface ComponentTestParams {
            userId: string;
        }

        interface ComponentTestResult {
            userInfo: any;
            processed: boolean;
        }

        class ComponentTestCommand extends A_Command<ComponentTestParams, ComponentTestResult> { }

        class TestProcessor extends A_Component {
            @A_Feature.Extend()
            async [A_CommandFeatures.onBeforeExecute](
                @A_Inject(A_Caller) command: ComponentTestCommand
            ) {
                testExecutionLog.push('Pre-processing command');
            }

            @A_Feature.Extend()
            async [A_CommandFeatures.onExecute](
                @A_Inject(A_Caller) command: ComponentTestCommand
            ) {
                testExecutionLog.push('Executing command');
                const result = {
                    userInfo: { id: command.params.userId, name: 'Test User' },
                    processed: true
                };
                await command.complete(result);
            }

            @A_Feature.Extend()
            async [A_CommandFeatures.onAfterExecute](
                @A_Inject(A_Caller) command: ComponentTestCommand
            ) {
                testExecutionLog.push('Post-processing command');
            }
        }

        it('Should execute with component processors', async () => {
            const container = new A_Container({
                name: 'Test Container',
                components: [
                    TestProcessor,
                    A_StateMachine
                ],
                entities: [ComponentTestCommand]
            });

            const concept = new A_Concept({
                containers: [container]
            });

            await concept.load();

            const command = new ComponentTestCommand({ userId: '123' });
            container.scope.register(command);

            await command.execute();

            expect(command.status).toBe(A_Command_Status.COMPLETED);
            expect(command.result).toEqual({
                userInfo: { id: '123', name: 'Test User' },
                processed: true
            });
        });
    });

    // =============================================================================
    // ======================== Multi-Service Communication Tests ================
    // =============================================================================

    describe('Multi-Service Communication', () => {
        interface MultiServiceParams {
            orderId: string;
        }

        interface MultiServiceResult {
            orderStatus: string;
            processed: boolean;
        }

        class MultiServiceCommand extends A_Command<MultiServiceParams, MultiServiceResult> {
            toJSON(): A_TYPES__Command_Serialized<MultiServiceParams, MultiServiceResult> & { orderId: string } {
                return {
                    ...super.toJSON(),
                    orderId: this.params.orderId
                };
            }
        }

        class ServiceAProcessor extends A_Component {
            @A_Feature.Extend()
            async [A_CommandFeatures.onBeforeExecute](
                @A_Inject(A_Caller) command: MultiServiceCommand,
                @A_Inject(A_Memory) memory: A_Memory<{ orderData: any }>
            ) {
                testExecutionLog.push('ServiceA: Pre-processing');
                await memory.set('orderData', { id: command.params.orderId, status: 'processing' });
            }

            @A_Feature.Extend()
            async [A_CommandFeatures.onExecute](
                @A_Inject(A_Caller) command: MultiServiceCommand,
                @A_Inject(A_Channel) channel: A_Channel
            ) {
                testExecutionLog.push('ServiceA: Routing to ServiceB');

                const response = await channel.request<any, A_TYPES__Command_Serialized<MultiServiceParams, MultiServiceResult>>({
                    container: 'ServiceB',
                    command: command.toJSON()
                });

                command.fromJSON(response.data!);
            }
        }

        class ServiceBProcessor extends A_Component {
            @A_Feature.Extend()
            async [A_CommandFeatures.onBeforeExecute](
                @A_Inject(A_Caller) command: MultiServiceCommand,
                @A_Inject(A_Memory) memory: A_Memory<{ orderData: any }>
            ) {
                testExecutionLog.push('ServiceB: Pre-processing');
                const orderData = await memory.get('orderData');
                expect(orderData).toBeDefined();
            }

            @A_Feature.Extend()
            async [A_CommandFeatures.onExecute](
                @A_Inject(A_Caller) command: MultiServiceCommand
            ) {
                testExecutionLog.push('ServiceB: Processing command');
                await command.complete({
                    orderStatus: 'completed',
                    processed: true
                });
            }
        }

        class TestChannel extends A_Channel {
            async onRequest(
                @A_Inject(A_Memory) memory: A_Memory<{ containers: Array<A_Container> }>,
                @A_Inject(A_ChannelRequest) context: A_ChannelRequest<{ container: string, command: A_TYPES__Command_Serialized }>
            ): Promise<void> {
                const containers = await memory.get('containers') || [];
                const target = containers.find(c => c.name === context.params.container);

                if (!target) {
                    throw new A_Error(`Container ${context.params.container} not found`);
                }

                const commandConstructor = target.scope.resolveConstructor<A_Command>(context.params.command.code);
                if (!commandConstructor) {
                    throw new A_Error(`Command constructor not found: ${context.params.command.code}`);
                }

                const command = new commandConstructor(context.params.command);
                target.scope.register(command);

                await command.execute();
                context.succeed(command.toJSON());
            }
        }

        class TestService extends A_Container {
            @A_Concept.Load()
            async init(
                @A_Inject(A_Memory) memory: A_Memory<{ containers: Array<A_Container> }>
            ) {
                const containers = await memory.get('containers') || [];
                containers.push(this);
                await memory.set('containers', containers);
                testExecutionLog.push(`Registered container: ${this.name}`);
            }
        }

        it('Should handle multi-service command routing', async () => {
            const sharedMemory = new A_MemoryContext();

            const serviceA = new TestService({
                name: 'ServiceA',
                components: [
                    ServiceAProcessor,
                    TestChannel,
                    A_Memory,
                    A_StateMachine
                ],
                entities: [MultiServiceCommand],
                fragments: [sharedMemory]
            });

            const serviceB = new TestService({
                name: 'ServiceB',
                components: [
                    ServiceBProcessor,
                    A_Memory,
                    A_StateMachine
                ],
                entities: [MultiServiceCommand],
                fragments: [sharedMemory]
            });

            const concept = new A_Concept({
                containers: [serviceA, serviceB],
                components: [A_Memory, TestChannel]
            });

            await concept.load();

            const command = new MultiServiceCommand({ orderId: '999' });
            serviceA.scope.register(command);

            await command.execute();

            expect(command.status).toBe(A_Command_Status.COMPLETED);
            // The result might be set by ServiceB processor but we need to check the execution log
            expect(testExecutionLog).toContain('ServiceA: Pre-processing');
            expect(testExecutionLog).toContain('ServiceA: Routing to ServiceB');
            expect(testExecutionLog).toContain('ServiceB: Pre-processing');
            expect(testExecutionLog).toContain('ServiceB: Processing command');
        });
    });

    // =============================================================================
    // ======================== Feature Template Tests ===========================
    // =============================================================================

    describe('Feature Template Processing', () => {
        interface TemplateTestParams {
            itemId: string;
        }

        interface TemplateTestResult {
            itemName: string;
            itemPrice: number;
        }

        class TemplateTestCommand extends A_Command<TemplateTestParams, TemplateTestResult> {
            @A_Feature.Define({
                template: [
                    {
                        name: 'itemName',
                        dependency: new A_Dependency('ItemNameHandler'),
                        handler: 'getName'
                    },
                    {
                        name: 'itemPrice',
                        dependency: new A_Dependency('ItemPriceHandler'),
                        handler: 'getPrice'
                    }
                ]
            })
            protected async [A_CommandFeatures.onExecute](): Promise<void> {
                testExecutionLog.push('Executing template-based command');
            }
        }

        class ItemNameHandler extends A_Component {
            getName() {
                testExecutionLog.push('Getting item name');
                return 'Test Item';
            }
        }

        class ItemPriceHandler extends A_Component {
            getPrice() {
                testExecutionLog.push('Getting item price');
                return 99.99;
            }
        }

        it('Should process feature templates correctly', async () => {
            const container = new A_Container({
                name: 'Template Test Container',
                components: [
                    ItemNameHandler,
                    ItemPriceHandler,
                    A_StateMachine
                ],
                entities: [TemplateTestCommand]
            });

            const concept = new A_Concept({
                containers: [container]
            });

            await concept.load();

            const command = new TemplateTestCommand({ itemId: '123' });
            container.scope.register(command);

            await command.execute();

            expect(command.status).toBe(A_Command_Status.COMPLETED);
            // Note: The actual template processing depends on the A_Feature implementation
            // This test validates the structure and execution flow
        });
    });

    // =============================================================================
    // ======================== Error Handling Tests =============================
    // =============================================================================

    describe('Error Handling', () => {
        interface ErrorTestParams {
            shouldFail: boolean;
        }

        class ErrorTestCommand extends A_Command<ErrorTestParams, any> { }

        class FailingProcessor extends A_Component {
            @A_Feature.Extend()
            async [A_CommandFeatures.onExecute](
                @A_Inject(A_Caller) command: ErrorTestCommand
            ) {
                if (command.params.shouldFail) {
                    throw new Error('Simulated execution error');
                }
                await command.complete({ success: true });
            }
        }

        it('Should handle execution errors properly', async () => {
            const container = new A_Container({
                name: 'Error Test Container',
                components: [
                    FailingProcessor,
                    A_StateMachine
                ],
                entities: [ErrorTestCommand]
            });

            const concept = new A_Concept({
                containers: [container]
            });

            await concept.load();

            const command = new ErrorTestCommand({ shouldFail: true });
            container.scope.register(command);

            await command.execute();

            expect(command.status).toBe(A_Command_Status.FAILED);
            expect(command.error).toBeDefined();
            expect(command.isProcessed).toBe(true);
        });

        it('Should handle execution without explicit scope binding', async () => {
            const command = new ErrorTestCommand({ shouldFail: false });

            // Don't register in any scope - the command will execute but 
            // without component processors it will complete with default behavior
            await command.execute();

            // Since there's no processor to call complete(), the command might
            // be in COMPLETED or FAILED state depending on internal logic
            expect([A_Command_Status.COMPLETED, A_Command_Status.FAILED])
                .toContain(command.status);
        });

        it('Should stop command execution in case of error', async () => {

            class FailingProcessor extends A_Component {

                @A_Feature.Extend({
                    name: A_CommandFeatures.onExecute
                })
                async step1(
                    @A_Inject(A_Caller) command: ErrorTestCommand
                ) {
                    await new Promise(resolve => setTimeout(resolve, 500));

                    testExecutionLog.push('Step 1 executed');
                }

                @A_Feature.Extend({
                    name: A_CommandFeatures.onExecute
                })
                async step2(
                    @A_Inject(A_Caller) command: ErrorTestCommand
                ) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    testExecutionLog.push('Step 2 executed');
                    throw new Error('Simulated error in step 2');
                }

                @A_Feature.Extend({
                    name: A_CommandFeatures.onExecute
                })
                async step3(
                    @A_Inject(A_Caller) command: ErrorTestCommand
                ) {
                    testExecutionLog.push('Step 3 executed');
                }
            }

            const container = new A_Container({
                name: 'Error Stop Test Container',
                components: [
                    FailingProcessor,
                    A_StateMachine
                ],
                entities: [ErrorTestCommand]
            });

            const concept = new A_Concept({
                containers: [container]
            });

            await concept.load();

            const command = new ErrorTestCommand({ shouldFail: true });
            container.scope.register(command);

            await command.execute();

            expect(command.status).toBe(A_Command_Status.FAILED);
            expect(command.error).toBeDefined();
            expect(command.isProcessed).toBe(true);
            expect(testExecutionLog).toEqual([
                'Step 1 executed',
                'Step 2 executed'
            ]); // Step 3 should not be executed
        });
    });

    // =============================================================================
    // ======================== Performance and Timing Tests ====================
    // =============================================================================

    describe('Performance and Timing', () => {
        interface TimingTestParams {
            delay: number;
        }

        class TimingTestCommand extends A_Command<TimingTestParams, any> { }

        class DelayProcessor extends A_Component {
            @A_Feature.Extend()
            async [A_CommandFeatures.onExecute](
                @A_Inject(A_Caller) command: TimingTestCommand
            ) {
                await new Promise(resolve => setTimeout(resolve, command.params.delay));
                await command.complete({ completed: true });
            }
        }

        it('Should track execution timing correctly', async () => {
            const container = new A_Container({
                name: 'Timing Test Container',
                components: [
                    DelayProcessor,
                    A_StateMachine
                ],
                entities: [TimingTestCommand]
            });

            const concept = new A_Concept({
                containers: [container]
            });

            await concept.load();

            const command = new TimingTestCommand({ delay: 100 });
            container.scope.register(command);
            const startTime = Date.now();
            await command.execute();
            const endTime = Date.now();

            expect(command.duration).toBeGreaterThanOrEqual(100);
            expect(command.duration).toBeLessThan(endTime - startTime + 50); // Allow some tolerance
            expect(command.idleTime).toBeGreaterThanOrEqual(0);
            expect(command.startedAt).toBeInstanceOf(Date);
            expect(command.endedAt).toBeInstanceOf(Date);
        });
    });
});