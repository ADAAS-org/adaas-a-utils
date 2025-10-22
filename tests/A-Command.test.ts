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
        expect(command.status).toBe(A_CONSTANTS__A_Command_Status.INITIALIZED);
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
});