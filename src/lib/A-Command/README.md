# A-Command

A powerful command pattern implementation that provides structured execution, lifecycle management, event handling, and state persistence for TypeScript applications.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Lifecycle Management](#lifecycle-management)
- [Event System](#event-system)
- [Serialization & Persistence](#serialization--persistence)
- [Error Handling](#error-handling)
- [API Reference](#api-reference)
- [Examples](#examples)

## Overview

A-Command is an implementation of the Command Pattern that allows you to encapsulate requests as objects, thereby letting you parameterize clients with different requests, queue operations, and support undo operations. It provides a structured approach to handling complex business logic with full lifecycle management and event-driven architecture.

## Key Features

- 🔄 **Complete Lifecycle Management** - Automatic progression through init → compile → execute → complete/fail phases
- 📡 **Event-Driven Architecture** - Subscribe to lifecycle events and custom events
- 💾 **State Persistence** - Full serialization/deserialization support for command state
- 🎯 **Type Safety** - Full TypeScript support with generic types for parameters and results
- 🔧 **Extensible** - Component-based architecture for custom execution logic
- 🛡️ **Error Handling** - Comprehensive error capture and management
- ⏱️ **Execution Tracking** - Built-in timing and duration tracking
- 🏗️ **Dependency Injection** - Integration with A-Context for scope management

## Installation

```bash
npm install @adaas/a-utils
```

## Basic Usage

### Simple Command Creation and Execution

```typescript
import { A_Command } from '@adaas/a-utils/lib/A-Command/A-Command.entity';
import { A_Context } from '@adaas/a-concept';

// Create a basic command
const command = new A_Command({
    action: 'greet',
    name: 'World'
});

// Register command in context
A_Context.root.register(command);

// Execute the command
await command.execute();

console.log(`Command status: ${command.status}`);
console.log(`Execution duration: ${command.duration}ms`);
```

### Typed Command with Custom Parameters and Result

```typescript
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

const command = new CreateUserCommand({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
});

A_Context.root.register(command);
await command.execute();

// Access typed result
const result = command.result;
console.log(`Created user: ${result?.userId}`);
```

## Advanced Usage

### Custom Command Logic with Components

```typescript
import { A_Component, A_Feature, A_Inject } from '@adaas/a-concept';
import { A_Memory } from '@adaas/a-utils/lib/A-Memory/A-Memory.context';
import { A_CONSTANTS_A_Command_Features } from '@adaas/a-utils/lib/A-Command/A-Command.constants';

// Define command types
interface OrderProcessParams {
    orderId: string;
    items: Array<{ productId: string; quantity: number }>;
    customerId: string;
}

interface OrderProcessResult {
    orderNumber: string;
    totalAmount: number;
    estimatedDelivery: string;
    paymentProcessed: boolean;
}

class ProcessOrderCommand extends A_Command<OrderProcessParams, OrderProcessResult> {}

// Create a component with custom execution logic
class OrderProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [ProcessOrderCommand] })
    async [A_CONSTANTS_A_Command_Features.EXECUTE](
        @A_Inject(A_Memory) memory: A_Memory<OrderProcessResult>
    ) {
        // Access command parameters through the command instance
        const command = A_Context.scope(this).resolve(ProcessOrderCommand);
        const { orderId, items, customerId } = command.params;
        
        // Process the order
        const orderNumber = `ORD-${Date.now()}`;
        const totalAmount = items.reduce((sum, item) => sum + (item.quantity * 10), 0);
        const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        // Store results in memory
        await memory.set('orderNumber', orderNumber);
        await memory.set('totalAmount', totalAmount);
        await memory.set('estimatedDelivery', estimatedDelivery);
        await memory.set('paymentProcessed', true);
        
        console.log(`Processed order ${orderNumber} for customer ${customerId}`);
    }
}

// Usage
A_Context.reset();
A_Context.root.register(OrderProcessor);

const command = new ProcessOrderCommand({
    orderId: 'order-123',
    customerId: 'customer-456',
    items: [
        { productId: 'prod-1', quantity: 2 },
        { productId: 'prod-2', quantity: 1 }
    ]
});

A_Context.root.register(command);
await command.execute();

console.log('Order processed:', command.result);
```

## Lifecycle Management

A-Command follows a structured lifecycle with automatic progression through defined phases:

```typescript
class LifecycleCommand extends A_Command<{}, {}> {}

const command = new LifecycleCommand({});
A_Context.root.register(command);

// Track each lifecycle phase
console.log('Initial status:', command.status); // CREATED

await command.init();
console.log('After init:', command.status); // INITIALIZED

await command.compile();
console.log('After compile:', command.status); // COMPILED

// Execute runs all phases automatically
await command.execute();
console.log('After execute:', command.status); // COMPLETED

// Access timing information
console.log('Started at:', command.startedAt);
console.log('Ended at:', command.endedAt);
console.log('Duration:', command.duration, 'ms');
```

### Lifecycle Phases

1. **CREATED** - Initial state when command is instantiated
2. **INITIALIZATION** - Setting up execution scope and dependencies
3. **INITIALIZED** - Ready for compilation
4. **COMPILATION** - Preparing execution environment
5. **COMPILED** - Ready for execution
6. **COMPLETED** - Successfully finished execution
7. **FAILED** - Execution failed with errors

## Event System

### Lifecycle Events

```typescript
const command = new A_Command({});
A_Context.root.register(command);

// Subscribe to lifecycle events
command.on('init', (cmd) => {
    console.log('Command initializing:', cmd?.code);
});

command.on('compile', (cmd) => {
    console.log('Command compiling:', cmd?.code);
});

command.on('execute', (cmd) => {
    console.log('Command executing:', cmd?.code);
});

command.on('complete', (cmd) => {
    console.log('Command completed:', cmd?.code);
});

command.on('fail', (cmd) => {
    console.log('Command failed:', cmd?.code);
});

await command.execute();
```

### Custom Events

```typescript
type CustomEvents = 'validation-started' | 'data-processed' | 'notification-sent';

class CustomEventCommand extends A_Command<{}, {}, CustomEvents> {}

const command = new CustomEventCommand({});
A_Context.root.register(command);

// Subscribe to custom events
command.on('validation-started', (cmd) => {
    console.log('Validation phase started');
});

command.on('data-processed', (cmd) => {
    console.log('Data processing completed');
});

// Emit custom events during execution
command.emit('validation-started');
command.emit('data-processed');
```

### Managing Event Listeners

```typescript
const command = new A_Command({});
A_Context.root.register(command);

// Add listener
const listener = (cmd) => console.log('Event triggered');
command.on('execute', listener);

// Remove listener
command.off('execute', listener);
```

## Serialization & Persistence

### Basic Serialization

```typescript
const command = new A_Command({
    userId: '12345',
    action: 'update-profile',
    data: { name: 'John Doe', email: 'john@example.com' }
});

A_Context.root.register(command);
await command.execute();

// Serialize command state
const serialized = command.toJSON();
console.log('Serialized:', JSON.stringify(serialized, null, 2));

// Deserialize and restore command
const restoredCommand = new A_Command(serialized);
console.log('Restored params:', restoredCommand.params);
console.log('Restored status:', restoredCommand.status);
console.log('Restored result:', restoredCommand.result);
```

### Cross-Session Persistence

```typescript
// Simulate saving command state to database/storage
async function saveCommandState(command: A_Command) {
    const serialized = command.toJSON();
    // In real application, save to database
    localStorage.setItem('command-state', JSON.stringify(serialized));
    return serialized.aseid;
}

// Simulate loading command state from database/storage
async function loadCommandState(commandId: string) {
    // In real application, load from database
    const serialized = JSON.parse(localStorage.getItem('command-state') || '{}');
    return new A_Command(serialized);
}

// Usage
const command = new A_Command({ task: 'long-running-operation' });
A_Context.root.register(command);

await command.execute();
const commandId = await saveCommandState(command);

// Later, in different session...
const restoredCommand = await loadCommandState(commandId);
console.log('Restored command status:', restoredCommand.status);
```

## Error Handling

### Capturing and Managing Errors

```typescript
import { A_Error } from '@adaas/a-concept';

class ErrorHandlingCommand extends A_Command<{}, {}> {}

class ErrorHandler extends A_Component {
    
    @A_Feature.Extend({ scope: [ErrorHandlingCommand] })
    async [A_CONSTANTS_A_Command_Features.EXECUTE](
        @A_Inject(A_Memory) memory: A_Memory<{}>
    ) {
        try {
            // Simulate some operations that might fail
            throw new Error('Simulated error');
        } catch (error) {
            // Add error to memory
            await memory.error(new A_Error({
                title: 'Operation Failed',
                message: error.message,
                code: 'OP_FAILED'
            }));
            
            // Throw error to trigger failure state
            throw error;
        }
    }
}

A_Context.reset();
A_Context.root.register(ErrorHandler);

const command = new ErrorHandlingCommand({});
A_Context.root.register(command);

await command.execute();

console.log('Command failed:', command.isFailed);
console.log('Errors:', Array.from(command.errors?.values() || []));
```

### Error Serialization

```typescript
// Errors are automatically included in serialization
const serialized = command.toJSON();
console.log('Serialized errors:', serialized.errors);

// Errors are restored during deserialization
const restoredCommand = new ErrorHandlingCommand(serialized);
console.log('Restored errors:', restoredCommand.errors);
```

## API Reference

### A_Command Class

#### Constructor
```typescript
constructor(params: InvokeType | A_TYPES__Command_Serialized<InvokeType, ResultType> | string)
```

#### Properties
- `code: string` - Unique identifier for the command type
- `status: A_CONSTANTS__A_Command_Status` - Current execution status
- `params: InvokeType` - Command parameters
- `result: ResultType | undefined` - Execution result
- `errors: Set<A_Error> | undefined` - Execution errors
- `startedAt: Date | undefined` - Execution start time
- `endedAt: Date | undefined` - Execution end time
- `duration: number | undefined` - Execution duration in milliseconds
- `scope: A_Scope` - Execution scope for dependency injection
- `isFailed: boolean` - Whether command failed
- `isCompleted: boolean` - Whether command completed successfully

#### Methods
- `async execute(): Promise<any>` - Execute the complete command lifecycle
- `async init(): Promise<void>` - Initialize command
- `async compile(): Promise<void>` - Compile command
- `async complete(): Promise<void>` - Mark command as completed
- `async fail(): Promise<void>` - Mark command as failed
- `on(event, listener)` - Add event listener
- `off(event, listener)` - Remove event listener
- `emit(event)` - Emit event
- `toJSON()` - Serialize command state
- `fromJSON(serialized)` - Deserialize command state

### Command Status Constants
```typescript
enum A_CONSTANTS__A_Command_Status {
    CREATED = 'CREATED',
    INITIALIZATION = 'INITIALIZATION',
    INITIALIZED = 'INITIALIZED',
    COMPILATION = 'COMPILATION',
    COMPILED = 'COMPILED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}
```

### Lifecycle Features for Components
```typescript
enum A_CONSTANTS_A_Command_Features {
    INIT = 'init',
    COMPLIED = 'complied',
    EXECUTE = 'execute',
    COMPLETE = 'complete',
    FAIL = 'fail'
}
```

## Examples

### File Processing Command

```typescript
interface FileProcessParams {
    filePath: string;
    operation: 'compress' | 'encrypt' | 'convert';
    options: Record<string, any>;
}

interface FileProcessResult {
    outputPath: string;
    originalSize: number;
    processedSize: number;
    processingTime: number;
}

class FileProcessCommand extends A_Command<FileProcessParams, FileProcessResult> {}

class FileProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [FileProcessCommand] })
    async [A_CONSTANTS_A_Command_Features.EXECUTE](
        @A_Inject(A_Memory) memory: A_Memory<FileProcessResult>
    ) {
        const command = A_Context.scope(this).resolve(FileProcessCommand);
        const { filePath, operation, options } = command.params;
        
        const startTime = Date.now();
        
        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const endTime = Date.now();
        
        await memory.set('outputPath', `processed_${filePath}`);
        await memory.set('originalSize', 1024);
        await memory.set('processedSize', 512);
        await memory.set('processingTime', endTime - startTime);
    }
}

// Usage
A_Context.reset();
A_Context.root.register(FileProcessor);

const command = new FileProcessCommand({
    filePath: '/path/to/file.txt',
    operation: 'compress',
    options: { quality: 0.8 }
});

A_Context.root.register(command);
await command.execute();

console.log('File processed:', command.result);
```

### Batch Processing with Progress Tracking

```typescript
type BatchEvents = 'item-processed' | 'progress-update' | 'batch-complete';

interface BatchProcessParams {
    items: Array<{ id: string; data: any }>;
    batchSize: number;
}

interface BatchProcessResult {
    processedCount: number;
    failedCount: number;
    totalTime: number;
    results: Array<{ id: string; success: boolean; result?: any; error?: string }>;
}

class BatchProcessCommand extends A_Command<BatchProcessParams, BatchProcessResult, BatchEvents> {}

class BatchProcessor extends A_Component {
    
    @A_Feature.Extend({ scope: [BatchProcessCommand] })
    async [A_CONSTANTS_A_Command_Features.EXECUTE](
        @A_Inject(A_Memory) memory: A_Memory<BatchProcessResult>
    ) {
        const command = A_Context.scope(this).resolve(BatchProcessCommand);
        const { items, batchSize } = command.params;
        
        const results: Array<{ id: string; success: boolean; result?: any; error?: string }> = [];
        let processedCount = 0;
        let failedCount = 0;
        
        // Process items in batches
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            
            for (const item of batch) {
                try {
                    // Simulate processing
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    results.push({
                        id: item.id,
                        success: true,
                        result: `processed-${item.id}`
                    });
                    processedCount++;
                    
                    command.emit('item-processed');
                } catch (error) {
                    results.push({
                        id: item.id,
                        success: false,
                        error: error.message
                    });
                    failedCount++;
                }
            }
            
            command.emit('progress-update');
        }
        
        await memory.set('processedCount', processedCount);
        await memory.set('failedCount', failedCount);
        await memory.set('totalTime', command.duration || 0);
        await memory.set('results', results);
        
        command.emit('batch-complete');
    }
}

// Usage with progress tracking
A_Context.reset();
A_Context.root.register(BatchProcessor);

const command = new BatchProcessCommand({
    items: Array.from({ length: 10 }, (_, i) => ({ id: `item-${i}`, data: {} })),
    batchSize: 3
});

// Track progress
command.on('item-processed', () => {
    console.log('Item processed');
});

command.on('progress-update', () => {
    console.log('Batch completed');
});

command.on('batch-complete', () => {
    console.log('All batches completed');
});

A_Context.root.register(command);
await command.execute();

console.log('Batch results:', command.result);
```

## Integration with A-Memory

A-Command automatically integrates with A-Memory for result and error storage:

```typescript
// Access memory during execution
class MemoryIntegrationCommand extends A_Command<{}, { step1: string; step2: number }> {}

class MemoryUser extends A_Component {
    
    @A_Feature.Extend({ scope: [MemoryIntegrationCommand] })
    async [A_CONSTANTS_A_Command_Features.EXECUTE](
        @A_Inject(A_Memory) memory: A_Memory<{ step1: string; step2: number }>
    ) {
        // Store intermediate results
        await memory.set('step1', 'completed');
        await memory.set('step2', 42);
        
        // Access stored values
        const step1Result = memory.get('step1');
        console.log('Step 1 result:', step1Result);
        
        // Verify prerequisites
        const hasRequiredData = await memory.verifyPrerequisites(['step1', 'step2']);
        console.log('Has required data:', hasRequiredData);
    }
}
```

---

## Contributing

When extending A-Command functionality, please ensure:

1. All new features include comprehensive tests
2. TypeScript types are properly defined and exported
3. Documentation is updated for new APIs
4. Examples are provided for complex features
5. Backward compatibility is maintained

## License

This project is licensed under the MIT License - see the LICENSE file for details.