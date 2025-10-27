/**
 * A-Command Examples
 * 
 * This file contains practical examples of using A-Command for various scenarios.
 * Run with: npx ts-node examples/command-examples.ts
 */

import { A_Command } from '../src/lib/A-Command/A-Command.entity';
import { A_CONSTANTS_A_Command_Features } from '../src/lib/A-Command/A-Command.constants';
import { A_Memory } from '../src/lib/A-Memory/A-Memory.context';
import { A_Component, A_Context, A_Feature, A_Inject, A_Error } from '@adaas/a-concept';

// Example 1: Basic Command Usage
async function basicCommandExample() {
    console.log('\n=== Basic Command Example ===');
    
    const command = new A_Command({
        action: 'greet',
        name: 'World'
    });

    A_Context.root.register(command);

    // Add event listeners
    command.on('init', () => console.log('Command initializing...'));
    command.on('complete', () => console.log('Command completed!'));

    await command.execute();

    console.log(`Status: ${command.status}`);
    console.log(`Duration: ${command.duration}ms`);
    console.log(`Code: ${command.code}`);
}

// Example 2: Typed Command with Custom Logic
interface UserCreateParams {
    name: string;
    email: string;
    role: 'admin' | 'user';
}

interface UserCreateResult {
    userId: string;
    createdAt: string;
    profileCreated: boolean;
}

class CreateUserCommand extends A_Command<UserCreateParams, UserCreateResult> {}

class UserCreationService extends A_Component {
    
    @A_Feature.Extend({ scope: [CreateUserCommand] })
    async [A_CONSTANTS_A_Command_Features.EXECUTE](
        @A_Inject(A_Memory) memory: A_Memory<UserCreateResult>
    ) {
        const command = A_Context.scope(this).resolve(CreateUserCommand);
        const { name, email, role } = command.params;
        
        console.log(`Creating user: ${name} (${email}) with role: ${role}`);
        
        // Simulate user creation
        const userId = `user_${Date.now()}`;
        const createdAt = new Date().toISOString();
        
        // Store results in memory
        await memory.set('userId', userId);
        await memory.set('createdAt', createdAt);
        await memory.set('profileCreated', true);
        
        console.log(`User created with ID: ${userId}`);
    }
}

async function typedCommandExample() {
    console.log('\n=== Typed Command with Custom Logic Example ===');
    
    A_Context.reset();
    A_Context.root.register(UserCreationService);
    
    const command = new CreateUserCommand({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
    });

    A_Context.root.register(command);
    await command.execute();

    console.log('User creation result:', command.result);
}

// Example 3: Command Serialization and Persistence
async function serializationExample() {
    console.log('\n=== Command Serialization Example ===');
    
    A_Context.reset();
    A_Context.root.register(UserCreationService);
    
    // Create and execute original command
    const originalCommand = new CreateUserCommand({
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin'
    });

    A_Context.root.register(originalCommand);
    await originalCommand.execute();

    // Serialize command
    const serialized = originalCommand.toJSON();
    console.log('Command serialized for storage/transmission');

    // Simulate storage and retrieval
    const serializedJson = JSON.stringify(serialized);
    const parsedData = JSON.parse(serializedJson);

    // Restore command from serialized data
    const restoredCommand = new CreateUserCommand(parsedData);
    
    console.log('Command restored from serialization:');
    console.log(`- Status: ${restoredCommand.status}`);
    console.log(`- Duration: ${restoredCommand.duration}ms`);
    console.log(`- User ID: ${restoredCommand.result?.userId}`);
    console.log(`- Created At: ${restoredCommand.result?.createdAt}`);
}

// Example 4: Error Handling
class FailingCommand extends A_Command<{ shouldFail: boolean }, { success: boolean }> {}

class FailingService extends A_Component {
    
    @A_Feature.Extend({ scope: [FailingCommand] })
    async [A_CONSTANTS_A_Command_Features.EXECUTE](
        @A_Inject(A_Memory) memory: A_Memory<{ success: boolean }>
    ) {
        const command = A_Context.scope(this).resolve(FailingCommand);
        
        if (command.params.shouldFail) {
            // Add error to memory
            await memory.error(new A_Error({
                title: 'Intentional Failure',
                message: 'This command was designed to fail',
                code: 'INTENTIONAL_FAIL'
            }));
            
            throw new Error('Command failed as requested');
        }
        
        await memory.set('success', true);
    }
}

async function errorHandlingExample() {
    console.log('\n=== Error Handling Example ===');
    
    A_Context.reset();
    A_Context.root.register(FailingService);
    
    // Test successful command
    const successCommand = new FailingCommand({ shouldFail: false });
    A_Context.root.register(successCommand);
    await successCommand.execute();
    
    console.log(`Success command - Status: ${successCommand.status}`);
    console.log(`Success command - Result:`, successCommand.result);
    
    // Test failing command
    const failCommand = new FailingCommand({ shouldFail: true });
    A_Context.root.register(failCommand);
    await failCommand.execute();
    
    console.log(`Fail command - Status: ${failCommand.status}`);
    console.log(`Fail command - Is Failed: ${failCommand.isFailed}`);
    console.log(`Fail command - Errors:`, Array.from(failCommand.errors?.values() || []));
}

// Example 5: Custom Events
type FileProcessEvents = 'validation-started' | 'processing' | 'cleanup';

class FileProcessCommand extends A_Command<
    { filePath: string; operation: string },
    { outputPath: string; size: number },
    FileProcessEvents
> {}

class FileProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [FileProcessCommand] })
    async [A_CONSTANTS_A_Command_Features.EXECUTE](
        @A_Inject(A_Memory) memory: A_Memory<{ outputPath: string; size: number }>
    ) {
        const command = A_Context.scope(this).resolve(FileProcessCommand);
        const { filePath, operation } = command.params;
        
        // Emit custom events during processing
        command.emit('validation-started');
        console.log(`Validating file: ${filePath}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        command.emit('processing');
        console.log(`Processing file with operation: ${operation}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        command.emit('cleanup');
        console.log('Cleaning up temporary files');
        await new Promise(resolve => setTimeout(resolve, 50));
        
        await memory.set('outputPath', `processed_${filePath}`);
        await memory.set('size', 1024);
    }
}

async function customEventsExample() {
    console.log('\n=== Custom Events Example ===');
    
    A_Context.reset();
    A_Context.root.register(FileProcessor);
    
    const command = new FileProcessCommand({
        filePath: 'document.pdf',
        operation: 'compress'
    });

    // Subscribe to custom events
    command.on('validation-started', () => console.log('📋 Validation phase started'));
    command.on('processing', () => console.log('⚙️  Processing phase started'));
    command.on('cleanup', () => console.log('🧹 Cleanup phase started'));
    
    // Subscribe to lifecycle events
    command.on('complete', () => console.log('✅ File processing completed'));

    A_Context.root.register(command);
    await command.execute();

    console.log('Final result:', command.result);
}

// Run all examples
async function runAllExamples() {
    console.log('🚀 Running A-Command Examples\n');
    
    try {
        await basicCommandExample();
        await typedCommandExample();
        await serializationExample();
        await errorHandlingExample();
        await customEventsExample();
        
        console.log('\n✅ All examples completed successfully!');
    } catch (error) {
        console.error('\n❌ Example failed:', error);
    }
}

// Export for use as module or run directly
export {
    basicCommandExample,
    typedCommandExample,
    serializationExample,
    errorHandlingExample,
    customEventsExample,
    runAllExamples
};

// Run if this file is executed directly
if (require.main === module) {
    runAllExamples();
}