import { A_Command } from '@adaas/a-utils/lib/A-Command/A-Command.entity';
import { A_CONSTANTS__A_Command_Status, A_CONSTANTS_A_Command_Features } from '@adaas/a-utils/lib/A-Command/A-Command.constants';
import { A_Component, A_Context, A_Error, A_Feature, A_Inject, A_Scope } from '@adaas/a-concept';
import { A_Memory } from '@adaas/a-utils/lib/A-Memory/A-Memory.context';

jest.retryTimes(0);

describe('A-Command tests', () => {

    it('Should Allow to create a command', async () => {
        const command = new A_Command({});
        A_Context.root.register(command);


        expect(command).toBeInstanceOf(A_Command);
        expect(command.code).toBe('a-command');
        expect(command.id).toBeDefined();
        expect(command.aseid).toBeDefined();
        expect(command.status).toBe(A_CONSTANTS__A_Command_Status.CREATED);
        expect(command.scope).toBeInstanceOf(A_Scope);
        expect(command.scope.resolve(A_Memory)).toBeInstanceOf(A_Memory);
    });
    it('Should allow to execute a command', async () => {
        const command = new A_Command({});
        A_Context.root.register(command);

        await command.execute();

        expect(command.status).toBe(A_CONSTANTS__A_Command_Status.COMPLETED);
        expect(command.startedAt).toBeInstanceOf(Date);
        expect(command.endedAt).toBeInstanceOf(Date);
    });
    it('Should Allow to create a command with custom generic types', async () => {
        type LifecycleEvents = 'A_CUSTOM_EVENT_1' | 'A_CUSTOM_EVENT_2';

        class MyCommand extends A_Command<
            { foo: string },
            { bar: string },
            LifecycleEvents
        > { }

        const command = new MyCommand({ foo: 'baz' });

        A_Context.root.register(command);

        command.emit('A_CUSTOM_EVENT_1');
        command.emit('compile');

        expect(command).toBeInstanceOf(A_Command);
        expect(command.code).toBe('my-command');
        expect(command.id).toBeDefined();
        expect(command.aseid).toBeDefined();
        expect(command.status).toBe(A_CONSTANTS__A_Command_Status.CREATED);
        expect(command.scope).toBeInstanceOf(A_Scope);
        expect(command.scope.resolve(A_Memory)).toBeInstanceOf(A_Memory);
    });
    it('Should allow to serialize and deserialize a command', async () => {
        const command = new A_Command({});
        A_Context.root.register(command);

        await command.execute();

        const serialized = command.toJSON();
        expect(serialized).toBeDefined();
        expect(serialized.aseid).toBe(command.aseid.toString());
        expect(serialized.code).toBe(command.code);
        expect(serialized.status).toBe(command.status);
        expect(serialized.startedAt).toBe(command.startedAt?.toISOString());
        expect(serialized.duration).toBe(command.duration);


        const deserializedCommand = new A_Command(serialized);
        expect(deserializedCommand).toBeInstanceOf(A_Command);
        expect(deserializedCommand.aseid.toString()).toBe(command.aseid.toString());
        expect(deserializedCommand.code).toBe(command.code);
        expect(deserializedCommand.status).toBe(command.status);
        expect(deserializedCommand.startedAt?.toISOString()).toBe(command.startedAt?.toISOString());
        expect(deserializedCommand.duration).toBe(command.duration);
    });

    it('Should allow to execute a command with custom logic', async () => {

        // 1) create a scope 
        A_Context.reset();

        // 2) create a new command 
        type resultType = { bar: string };
        type invokeType = { foo: string };
        class MyCommand extends A_Command<invokeType, resultType> { }

        A_Context.root.register(MyCommand);

        // 3) create a custom component with custom logic
        class MyComponent extends A_Component {

            @A_Feature.Extend({ scope: [MyCommand] })
            async [A_CONSTANTS_A_Command_Features.EXECUTE](
                @A_Inject(A_Memory) context: A_Memory<resultType>
            ) {
                context.set('bar', 'baz');
            }
        }

        // 4) register component in the scope
        A_Context.root.register(MyComponent);

        // 5) create a new command instance within the scope
        const command = new MyCommand({ foo: 'bar' });
        A_Context.root.register(command);

        // 6) execute the command
        await command.execute();

        // 7) verify that command was executed with custom logic from MyComponent
        expect(command.status).toBe(A_CONSTANTS__A_Command_Status.COMPLETED);
        expect(command.result).toBeDefined();
        expect(command.result).toEqual({ bar: 'baz' });
    })
    it('Should allow to fail a command with custom logic', async () => {
        // 1) reset context to have a clean scope
        A_Context.reset();

        // 2) create a new command 
        type resultType = { bar: string };
        type invokeType = { foo: string };
        class MyCommand extends A_Command<invokeType, resultType> { }

        A_Context.root.register(MyCommand);

        // 3) create a custom component with custom logic
        class MyComponent extends A_Component {

            @A_Feature.Extend({ scope: [MyCommand] })
            async [A_CONSTANTS_A_Command_Features.EXECUTE](
                @A_Inject(A_Memory) context: A_Memory<resultType>
            ) {
                context.error(new A_Error({ title: 'Test error' }));
                //  it's optional to throw an error here, as the command may contain multiple errors that also can be a result of async operations
                throw new A_Error({ title: 'Test error thrown' });
            }
        }

        // 4) register component in the scope
        A_Context.root.register(MyComponent);
        // 5) create a new command instance within the scope
        const command = new MyCommand({ foo: 'bar' });
        A_Context.root.register(command);

        // 6) execute the command
        await command.execute();

        // 7) verify that command was executed with custom logic from MyComponent
        expect(command.status).toBe(A_CONSTANTS__A_Command_Status.FAILED);
        expect(command.errors).toBeDefined();
        expect(command.errors?.size).toBe(1);
        expect(Array.from(command.errors?.values() || [])[0].message).toBe('Test error');
    });

    describe('Command Lifecycle Tests', () => {
        beforeEach(() => {
            A_Context.reset();
        });

        it('Should follow correct lifecycle sequence during execution', async () => {
            const lifecycleOrder: string[] = [];
            
            class TestCommand extends A_Command<{ input: string }, { output: string }> {}
            
            const command = new TestCommand({ input: 'test' });
            A_Context.root.register(command);
            
            // Track lifecycle events
            command.on('init', () => lifecycleOrder.push('init'));
            command.on('compile', () => lifecycleOrder.push('compile'));
            command.on('execute', () => lifecycleOrder.push('execute'));
            command.on('complete', () => lifecycleOrder.push('complete'));
            command.on('fail', () => lifecycleOrder.push('fail'));

            await command.execute();

            expect(lifecycleOrder).toEqual(['init', 'compile', 'execute', 'complete']);
            expect(command.status).toBe(A_CONSTANTS__A_Command_Status.COMPLETED);
        });

        it('Should track status changes through lifecycle', async () => {
            const statusChanges: A_CONSTANTS__A_Command_Status[] = [];
            
            class TestCommand extends A_Command<{ input: string }, { output: string }> {}
            
            const command = new TestCommand({ input: 'test' });
            A_Context.root.register(command);

            // Initial status
            expect(command.status).toBe(A_CONSTANTS__A_Command_Status.CREATED);
            statusChanges.push(command.status);

            await command.init();
            expect(command.status).toBe(A_CONSTANTS__A_Command_Status.INITIALIZED);
            statusChanges.push(command.status);

            await command.compile();
            expect(command.status).toBe(A_CONSTANTS__A_Command_Status.COMPILED);
            statusChanges.push(command.status);

            await command.complete();
            expect(command.status).toBe(A_CONSTANTS__A_Command_Status.COMPLETED);
            statusChanges.push(command.status);

            expect(statusChanges).toEqual([
                A_CONSTANTS__A_Command_Status.CREATED,
                A_CONSTANTS__A_Command_Status.INITIALIZED,
                A_CONSTANTS__A_Command_Status.COMPILED,
                A_CONSTANTS__A_Command_Status.COMPLETED
            ]);
        });

        it('Should handle failed lifecycle correctly', async () => {
            A_Context.reset();
            
            class FailingCommand extends A_Command<{ input: string }, { output: string }> {}
            
            class FailingComponent extends A_Component {
                @A_Feature.Extend({ scope: [FailingCommand] })
                async [A_CONSTANTS_A_Command_Features.EXECUTE]() {
                    throw new A_Error({ title: 'Execution failed' });
                }
            }

            A_Context.root.register(FailingComponent);
            
            const command = new FailingCommand({ input: 'test' });
            A_Context.root.register(command);

            const lifecycleOrder: string[] = [];
            command.on('init', () => lifecycleOrder.push('init'));
            command.on('compile', () => lifecycleOrder.push('compile'));
            command.on('execute', () => lifecycleOrder.push('execute'));
            command.on('complete', () => lifecycleOrder.push('complete'));
            command.on('fail', () => lifecycleOrder.push('fail'));

            await command.execute();

            expect(lifecycleOrder).toEqual(['init', 'compile', 'execute', 'fail']);
            expect(command.status).toBe(A_CONSTANTS__A_Command_Status.FAILED);
            expect(command.isFailed).toBe(true);
            expect(command.isCompleted).toBe(false);
        });

        it('Should track execution timing correctly', async () => {
            const command = new A_Command({});
            A_Context.root.register(command);

            expect(command.startedAt).toBeUndefined();
            expect(command.endedAt).toBeUndefined();
            expect(command.duration).toBeUndefined();

            const startTime = Date.now();
            await command.execute();
            const endTime = Date.now();

            expect(command.startedAt).toBeInstanceOf(Date);
            expect(command.endedAt).toBeInstanceOf(Date);
            expect(command.duration).toBeGreaterThanOrEqual(0);
            expect(command.startedAt!.getTime()).toBeGreaterThanOrEqual(startTime);
            expect(command.endedAt!.getTime()).toBeLessThanOrEqual(endTime);
            expect(command.duration).toBe(command.endedAt!.getTime() - command.startedAt!.getTime());
        });
    });

    describe('Command Subscribers/Event Listeners Tests', () => {
        beforeEach(() => {
            A_Context.reset();
        });

        it('Should allow multiple listeners for the same event', async () => {
            const command = new A_Command({});
            A_Context.root.register(command);

            const listener1Calls: number[] = [];
            const listener2Calls: number[] = [];

            command.on('init', () => listener1Calls.push(1));
            command.on('init', () => listener2Calls.push(2));

            await command.init();

            expect(listener1Calls).toEqual([1]);
            expect(listener2Calls).toEqual([2]);
        });

        it('Should support custom lifecycle events', async () => {
            type CustomEvents = 'custom-event-1' | 'custom-event-2';
            
            class CustomCommand extends A_Command<{}, {}, CustomEvents> {}
            
            const command = new CustomCommand({});
            A_Context.root.register(command);

            const customEvent1Calls: number[] = [];
            const customEvent2Calls: number[] = [];

            command.on('custom-event-1', () => customEvent1Calls.push(1));
            command.on('custom-event-2', () => customEvent2Calls.push(2));

            command.emit('custom-event-1');
            command.emit('custom-event-2');
            command.emit('custom-event-1');

            expect(customEvent1Calls).toEqual([1, 1]);
            expect(customEvent2Calls).toEqual([2]);
        });

        it('Should allow removing event listeners', async () => {
            const command = new A_Command({});
            A_Context.root.register(command);

            const listenerCalls: number[] = [];
            const listener = () => listenerCalls.push(1);

            command.on('init', listener);
            await command.init();
            expect(listenerCalls).toEqual([1]);

            // Remove listener and verify it's not called again
            command.off('init', listener);
            
            // Reset to call init again
            (command as any)._status = A_CONSTANTS__A_Command_Status.CREATED;
            await command.init();
            expect(listenerCalls).toEqual([1]); // Should still be 1, not 2
        });

        it('Should pass command instance to event listeners', async () => {
            const command = new A_Command({ testParam: 'value' });
            A_Context.root.register(command);

            let receivedCommand: A_Command<any, any, any> | undefined = undefined;

            command.on('init', (cmd) => {
                receivedCommand = cmd;
            });

            await command.init();

            expect(receivedCommand).toBe(command);
            expect((receivedCommand as any)?.params).toEqual({ testParam: 'value' });
        });

        it('Should propagate listener errors during event emission', async () => {
            const command = new A_Command({});
            A_Context.root.register(command);

            const successfulCalls: number[] = [];

            command.on('init', () => {
                throw new Error('Listener error');
            });
            command.on('init', () => successfulCalls.push(1));

            // Listener errors are propagated and will cause the command to fail
            await expect(command.init()).rejects.toThrow('Listener error');
            // The second listener may not be called due to the error
        });
    });

    describe('Parameter Serialization and Transmission Tests', () => {
        beforeEach(() => {
            A_Context.reset();
        });

        it('Should preserve complex parameter types during serialization', async () => {
            interface ComplexParams {
                stringParam: string;
                numberParam: number;
                booleanParam: boolean;
                objectParam: {
                    nested: string;
                    array: number[];
                };
                arrayParam: string[];
                dateParam: string; // ISO string representation
                nullParam: null;
                undefinedParam?: undefined;
            }

            const complexParams: ComplexParams = {
                stringParam: 'test string',
                numberParam: 42,
                booleanParam: true,
                objectParam: {
                    nested: 'nested value',
                    array: [1, 2, 3]
                },
                arrayParam: ['a', 'b', 'c'],
                dateParam: new Date('2023-01-01').toISOString(),
                nullParam: null
            };

            class ComplexCommand extends A_Command<ComplexParams, { result: string }> {}
            
            const command = new ComplexCommand(complexParams);
            A_Context.root.register(command);
            
            await command.execute();

            const serialized = command.toJSON();
            expect(serialized.params).toEqual(complexParams);

            // Test deserialization
            const deserializedCommand = new ComplexCommand(serialized);
            expect(deserializedCommand.params).toEqual(complexParams);
            expect(deserializedCommand.params.objectParam.nested).toBe('nested value');
            expect(deserializedCommand.params.arrayParam).toEqual(['a', 'b', 'c']);
        });

        it('Should handle result serialization correctly', async () => {
            A_Context.reset();

            interface TestResult {
                processedData: string;
                count: number;
                metadata: {
                    timestamp: string;
                    version: number;
                };
            }

            class ResultCommand extends A_Command<{ input: string }, TestResult> {}

            class ResultProcessor extends A_Component {
                @A_Feature.Extend({ scope: [ResultCommand] })
                async [A_CONSTANTS_A_Command_Features.EXECUTE](
                    @A_Inject(A_Memory) memory: A_Memory<TestResult>
                ) {
                    memory.set('processedData', 'processed-input');
                    memory.set('count', 100);
                    memory.set('metadata', {
                        timestamp: new Date().toISOString(),
                        version: 1
                    });
                }
            }

            A_Context.root.register(ResultProcessor);
            
            const command = new ResultCommand({ input: 'test-input' });
            A_Context.root.register(command);
            
            await command.execute();

            const serialized = command.toJSON();
            expect(serialized.result).toBeDefined();
            expect(serialized.result?.processedData).toBe('processed-input');
            expect(serialized.result?.count).toBe(100);
            expect(serialized.result?.metadata).toBeDefined();
            expect(serialized.result?.metadata.version).toBe(1);

            // Test deserialization - result is restored to memory and accessible through get method
            const deserializedCommand = new ResultCommand(serialized);
            const deserializedMemory = deserializedCommand.scope.resolve(A_Memory);
            expect(deserializedMemory.get('processedData')).toBe('processed-input');
            expect(deserializedMemory.get('count')).toBe(100);
            expect(deserializedMemory.get('metadata')).toEqual(serialized.result?.metadata);
        });

        it('Should handle error serialization correctly', async () => {
            A_Context.reset();

            class ErrorCommand extends A_Command<{ input: string }, { output: string }> {}

            class ErrorComponent extends A_Component {
                @A_Feature.Extend({ scope: [ErrorCommand] })
                async [A_CONSTANTS_A_Command_Features.EXECUTE](
                    @A_Inject(A_Memory) memory: A_Memory<{ output: string }>
                ) {
                    memory.error(new A_Error({ 
                        title: 'First error',
                        message: 'First error message'
                    }));
                    memory.error(new A_Error({ 
                        title: 'Second error',
                        message: 'Second error message'
                    }));
                    throw new A_Error({ title: 'Thrown error' });
                }
            }

            A_Context.root.register(ErrorComponent);
            
            const command = new ErrorCommand({ input: 'test' });
            A_Context.root.register(command);
            
            await command.execute();

            expect(command.isFailed).toBe(true);
            expect(command.errors?.size).toBe(2);

            const serialized = command.toJSON();
            expect(serialized.errors).toBeDefined();
            expect(serialized.errors?.length).toBe(2);
            expect(serialized.errors?.[0].title).toBe('First error');
            expect(serialized.errors?.[1].title).toBe('Second error');

            // Test deserialization - errors are restored to memory
            const deserializedCommand = new ErrorCommand(serialized);
            const deserializedMemory = deserializedCommand.scope.resolve(A_Memory);
            expect(deserializedMemory.Errors?.size).toBe(2);
            const errorArray = Array.from(deserializedMemory.Errors?.values() || []);
            expect(errorArray[0].title).toBe('First error');
            expect(errorArray[1].title).toBe('Second error');
        });

        it('Should maintain parameter integrity across command transmission', async () => {
            // Simulate command transmission across network/storage
            const originalParams = {
                userId: '12345',
                action: 'update',
                data: {
                    email: 'test@example.com',
                    preferences: {
                        theme: 'dark',
                        notifications: true
                    }
                },
                timestamp: new Date().toISOString()
            };

            class TransmissionCommand extends A_Command<typeof originalParams, { success: boolean }> {}
            
            // Step 1: Create and execute original command
            const originalCommand = new TransmissionCommand(originalParams);
            A_Context.root.register(originalCommand);
            await originalCommand.execute();

            // Step 2: Serialize for transmission
            const serializedForTransmission = JSON.stringify(originalCommand.toJSON());

            // Step 3: Deserialize from transmission
            const deserializedData = JSON.parse(serializedForTransmission);
            const restoredCommand = new TransmissionCommand(deserializedData);

            // Step 4: Verify parameter integrity
            expect(restoredCommand.params).toEqual(originalParams);
            expect(restoredCommand.params.data.email).toBe('test@example.com');
            expect(restoredCommand.params.data.preferences.theme).toBe('dark');
            expect(restoredCommand.aseid.toString()).toBe(originalCommand.aseid.toString());
            expect(restoredCommand.code).toBe(originalCommand.code);
        });

        it('Should handle empty and edge case parameters', async () => {
            const edgeCaseParams = {
                emptyString: '',
                emptyArray: [],
                emptyObject: {},
                zeroNumber: 0,
                falseBoolean: false,
                nullValue: null
            };

            class EdgeCaseCommand extends A_Command<typeof edgeCaseParams, {}> {}
            
            const command = new EdgeCaseCommand(edgeCaseParams);
            A_Context.root.register(command);
            await command.execute();

            const serialized = command.toJSON();
            expect(serialized.params).toEqual(edgeCaseParams);

            const deserializedCommand = new EdgeCaseCommand(serialized);
            expect(deserializedCommand.params).toEqual(edgeCaseParams);
            expect(deserializedCommand.params.emptyString).toBe('');
            expect(deserializedCommand.params.emptyArray).toEqual([]);
            expect(deserializedCommand.params.emptyObject).toEqual({});
            expect(deserializedCommand.params.zeroNumber).toBe(0);
            expect(deserializedCommand.params.falseBoolean).toBe(false);
            expect(deserializedCommand.params.nullValue).toBe(null);
        });
    });
});