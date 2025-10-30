<img align="left" style="margin-right:40px; margin-bottom:80px;" width="180" height="80" src="./docs/a-logo-docs.png" alt="ADAAS Logo">

# A-Utils SDK 

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Version](https://img.shields.io/npm/v/@adaas/a-utils)
![Downloads](https://img.shields.io/npm/dm/@adaas/a-utils)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

This package is a set of common utilities that can be used across projects related or not related to ADAAS Ecosystem. 
In this package it is possible to find useful features to work with structures, objects, types, commands, configuration management, logging, scheduling, and more.  


| LTS | Latest | npm               |
|---------------|----------|---------------------------|
| v0.1.14      |   v0.1.14    |     [@adaas/a-utils](https://www.npmjs.com/package/@adaas/a-utils)    |


## ✨ Key Features

🚀 **Communication Channels** - Structured messaging with lifecycle management  
⚡ **Command Pattern** - Event-driven command execution with serialization  
🔧 **Configuration Management** - Multi-source config with type safety  
📝 **Smart Logging** - Scope-aware logging with color support  
🛡️ **Access Control** - Regex-based permission management  
💾 **Memory Management** - Type-safe intermediate value storage  
📅 **Task Scheduling** - Promise-based scheduling with cancellation  
🔌 **Polyfills** - Cross-environment compatibility  
🏗️ **Component Architecture** - Extensible dependency injection system


<!-- TABLE OF CONTENTS -->
## Table of Contents

- [About the Project](#overview)
- [Installation](#installation)
- [Key Features](#-key-features)
- [Components](#components)
  - [A-Channel](#a-channel)
  - [A-Command](#a-command)
  - [A-Config](#a-config)
  - [A-Logger](#a-logger)
  - [A-Manifest](#a-manifest)
  - [A-Memory](#a-memory)
  - [A-Polyfill](#a-polyfill)
  - [A-Schedule](#a-schedule)
- [Environment Variables](#environment-variables)
- [Links](#links)


## Installation

```bash
cd /your/project/location
npm i @adaas/a-utils
```

## Components

### A-Channel

A powerful, extensible communication channel component that provides structured messaging patterns with lifecycle management, error handling, and type safety.

> 📚 **[Complete A-Channel Documentation](./src/lib/A-Channel/README.md)** - Comprehensive guide with examples, API reference, and advanced usage patterns.

**Quick Start:**
```typescript
import { A_Channel } from '@adaas/a-utils';
import { A_Context } from '@adaas/a-concept';

// Create and initialize a channel
const channel = new A_Channel();
A_Context.root.register(channel);

// Request/Response pattern
const response = await channel.request({ action: 'getData', id: 123 });
console.log('Response:', response.data);

// Fire-and-forget pattern
await channel.send({ type: 'notification', message: 'Hello World' });
```

**Advanced Example:**
```typescript
// Custom HTTP channel
class HttpChannel extends A_Channel {}

class HttpProcessor extends A_Component {
    @A_Feature.Extend({ scope: [HttpChannel] })
    async [A_ChannelFeatures.onRequest](
        @A_Inject(A_ChannelRequest) context: A_ChannelRequest
    ) {
        const response = await fetch(context.params.url);
        (context as any)._result = await response.json();
    }
}

A_Context.root.register(HttpProcessor);

const httpChannel = new HttpChannel();
A_Context.root.register(httpChannel);

const apiResponse = await httpChannel.request({
    url: 'https://api.example.com/users'
});
```

**Key Features:**
- ✅ **Lifecycle Management** - Complete connection and processing lifecycle with hooks
- ✅ **Multiple Patterns** - Request/Response and Fire-and-Forget messaging
- ✅ **Error Handling** - Comprehensive error capture and management
- ✅ **Type Safety** - Full TypeScript support with generic types
- ✅ **Extensible** - Component-based architecture for custom behavior
- ✅ **Concurrent Processing** - Handle multiple requests simultaneously

---

### A-Command

A powerful command execution system that provides structured command patterns with lifecycle management, event handling, status tracking, and serialization capabilities.

> 📚 **[Complete A-Command Documentation](./src/lib/A-Command/README.md)** - Comprehensive guide with examples, API reference, and advanced usage patterns.

**Quick Start:**
```typescript
import { A_Command } from '@adaas/a-utils';
import { A_Context } from '@adaas/a-concept';

// Create and execute a simple command
const command = new A_Command({ action: 'greet', name: 'World' });
A_Context.root.register(command);

await command.execute();

console.log(command.status); // 'COMPLETED'
console.log(command.duration); // Execution time in ms
```

**Advanced Example:**
```typescript
// Typed command with custom logic
interface UserCreateParams {
    name: string;
    email: string;
}

interface UserCreateResult {
    userId: string;
    createdAt: string;
}

class CreateUserCommand extends A_Command<UserCreateParams, UserCreateResult> {}

// Custom execution logic using components
class UserProcessor extends A_Component {
    @A_Feature.Extend({ scope: [CreateUserCommand] })
    async execute(@A_Inject(A_Memory) memory: A_Memory<UserCreateResult>) {
        // Your business logic here
        await memory.set('userId', 'user-123');
        await memory.set('createdAt', new Date().toISOString());
    }
}

// Execute with event handling
const command = new CreateUserCommand({
    name: 'John Doe',
    email: 'john@example.com'
});

command.on('complete', (cmd) => {
    console.log('User created:', cmd.result);
});

A_Context.root.register(UserProcessor);
A_Context.root.register(command);
await command.execute();
```

**Key Features:**
- ✅ **Complete Lifecycle Management** - Automatic progression through init → compile → execute → complete/fail
- ✅ **Event-Driven Architecture** - Subscribe to lifecycle events and custom events  
- ✅ **State Persistence** - Full serialization/deserialization support
- ✅ **Type Safety** - Full TypeScript support with generic types
- ✅ **Error Handling** - Comprehensive error capture and management
- ✅ **Execution Tracking** - Built-in timing and duration tracking
- ✅ **Component Integration** - Extensible through A-Component architecture
- Scope integration with dependency injection
- Memory management integration

**Command Status:**
- `INITIALIZED` - Command created but not started
- `PROCESSING` - Command is currently executing
- `COMPLETED` - Command finished successfully
- `FAILED` - Command execution failed

---

### A-Config

A flexible configuration management system that supports multiple sources (environment variables, files) with type safety and validation.

**Basic Usage:**
```typescript
import { A_Config } from '@adaas/a-utils';

// Simple configuration
const config = new A_Config({
    variables: ['API_URL', 'PORT'] as const,
    defaults: {
        PORT: '3000'
    }
});

console.log(config.get('PORT')); // '3000' or ENV value
console.log(config.get('API_URL')); // ENV value or undefined
```

**Advanced Usage with File Loading:**
```typescript
import { A_Config, A_ConfigLoader, ENVConfigReader, FileConfigReader } from '@adaas/a-utils';

// Configuration with multiple sources
const config = new A_Config({
    variables: ['DATABASE_URL', 'JWT_SECRET', 'LOG_LEVEL'] as const,
    defaults: {
        LOG_LEVEL: 'info'
    }
});

// Use with config loader for file support
const configLoader = new A_ConfigLoader();
// Automatically loads from .env files and environment variables
```

**Features:**
- Type-safe configuration management
- Multiple data sources (ENV, files)
- Default value support
- Automatic environment variable loading
- Integration with ADAAS concept system
- Validation and error handling

---

### A-Logger

A sophisticated logging component with advanced formatting, scope-based organization, and configurable output levels for ADAAS applications.

**Basic Usage:**
```typescript
import { A_Logger } from '@adaas/a-utils';
import { A_Scope } from '@adaas/a-concept';

const scope = new A_Scope({ name: 'MyService' });
const logger = new A_Logger(scope);

// Basic logging with colors
logger.log('Application started');
logger.log('green', 'Operation successful');
logger.warning('Resource usage high');
logger.error('Database connection failed');

// Object logging with formatting
const user = { id: 1, name: 'John', active: true };
logger.log('blue', 'User data:', user);

// Multi-argument logging
logger.log('green', 
    'Processing complete:',
    'Records:', 150,
    'Errors:', 2,
    'Success rate:', '98.7%'
);
```

**Advanced Features:**
```typescript
// Error handling with context
try {
    throw new Error('Database timeout');
} catch (error) {
    logger.error('Operation failed:', error, 'Context:', { 
        userId: '123', 
        operation: 'update' 
    });
}

// Log level filtering (via A_LOGGER_LEVEL env var)
// Levels: debug, info, warn, error, all
process.env.A_LOGGER_LEVEL = 'warn'; // Only warnings and errors

// Scope alignment - all messages align consistently
const services = [
    new A_Logger(new A_Scope({ name: 'API' })),
    new A_Logger(new A_Scope({ name: 'DatabaseConnectionPool' })),
    new A_Logger(new A_Scope({ name: 'Auth' }))
];
```

**Key Features:**
- ✅ **Scope-based Formatting** - Consistent message alignment regardless of scope name length
- ✅ **9 Terminal Colors** - green, blue, red, yellow, gray, magenta, cyan, white, pink
- ✅ **Object Pretty-printing** - JSON formatting with proper indentation
- ✅ **Error Handling** - Special formatting for A_Error and standard Error objects
- ✅ **Log Level Filtering** - Configurable filtering (debug, info, warn, error, all)
- ✅ **Performance Optimized** - Efficient handling of large objects and rapid logging
- ✅ **Multi-line Support** - Proper alignment for complex multi-argument logs
- ✅ **Timestamp Integration** - High-precision timestamps (MM:SS:mmm format)

**Output Examples:**
```
[API                 ] |15:42:123| Operation successful
[DatabaseConnectionPool] |15:42:124| Connection established
[Auth                ] |15:42:125| User authenticated: {"id":1,"name":"John"}
```

**Log Levels:**
- `debug` - Shows all messages
- `info` - Shows info, warning, and error messages  
- `warn` - Shows warning and error messages only
- `error` - Shows error messages only
- `all` - Shows all messages (default)

---

### A-Manifest

A powerful access control and permission management system that allows fine-grained control over component and method access using regex patterns and rule-based configurations.

**Basic Usage:**
```typescript
import { A_Manifest } from '@adaas/a-utils';
import { A_Component } from '@adaas/a-concept';

class UserController extends A_Component {
    get() { return 'users'; }
    post() { return 'create user'; }
    delete() { return 'delete user'; }
}

class GuestUser extends A_Component {}
class AdminUser extends A_Component {}

// Component-level access control
const manifest = new A_Manifest([
    {
        component: UserController,
        exclude: [GuestUser] // Guests cannot access UserController
    }
]);

// Check permissions
const canAccess = manifest.isAllowed(UserController, 'get').for(GuestUser); // false
const adminAccess = manifest.isAllowed(UserController, 'get').for(AdminUser); // true
```

**Method-Level Control:**
```typescript
const manifest = new A_Manifest([
    {
        component: UserController,
        methods: [
            {
                method: 'delete',
                apply: [AdminUser] // Only admins can delete
            },
            {
                method: 'post',
                exclude: [GuestUser] // Guests cannot create
            }
        ]
    }
]);
```

**Regex Pattern Support:**
```typescript
const manifest = new A_Manifest([
    {
        component: UserController,
        methods: [
            {
                method: /^(post|put|delete)$/, // All mutating operations
                exclude: [GuestUser]
            }
        ]
    }
]);
```

**Complex Scenarios:**
```typescript
const manifest = new A_Manifest([
    {
        component: UserController,
        exclude: [GuestUser], // Base rule: guests excluded
        methods: [
            {
                method: 'get',
                apply: [GuestUser, AdminUser] // Override: guests can read
            }
        ]
    }
]);

// Results:
// UserController.get for GuestUser -> true (method override)
// UserController.post for GuestUser -> false (component exclusion)
```

**Features:**
- Component-level and method-level access control
- Regex pattern matching for flexible rules
- Rule precedence (method-level overrides component-level)
- Fluent API for permission checking
- Support for inclusion (`apply`) and exclusion (`exclude`) rules
- Type-safe configuration with TypeScript

---

### A-Memory

A type-safe memory management system for storing intermediate values and tracking errors during complex operations. Fully integrated with A-Command for state management.

> 💡 **Note:** A-Memory is automatically used by A-Command for result and error storage. See [A-Command Documentation](./src/lib/A-Command/README.md) for integration examples.

**Basic Usage:**
```typescript
import { A_Memory } from '@adaas/a-utils';

// Create typed memory instance
const memory = new A_Memory<{
    userId: string;
    userData: any;
    processedData: any;
}>({
    userId: '12345'
});

// Store and retrieve values
await memory.set('userData', { name: 'John', email: 'john@example.com' });
await memory.set('processedData', processUserData(memory.get('userData')));

// Access values with type safety
const userId = memory.get('userId'); // string | undefined
const userData = memory.get('userData'); // any | undefined

// Check prerequisites
const hasRequired = await memory.verifyPrerequisites(['userId', 'userData']);
console.log(hasRequired); // true

// Serialize all data
const allData = memory.toJSON();
```

**Error Tracking:**
```typescript
import { A_Error } from '@adaas/a-concept';

const memory = new A_Memory();

// Add errors during processing
try {
    // Some operation that might fail
    throw new Error('Something went wrong');
} catch (error) {
    await memory.error(new A_Error({ 
        title: 'Operation Failed',
        message: error.message 
    }));
}

// Check for errors
if (memory.Errors) {
    console.log('Errors occurred:', Array.from(memory.Errors));
}
```

**Integration with A-Command:**
```typescript
// A-Memory is automatically used by A-Command
class DataProcessor extends A_Component {
    @A_Feature.Extend({ scope: [MyCommand] })
    async execute(@A_Inject(A_Memory) memory: A_Memory<ResultType>) {
        // Store intermediate results
        await memory.set('step1', 'completed');
        await memory.set('step2', { data: 'processed' });
        
        // Access stored values
        const step1Result = memory.get('step1');
        
        // Results automatically become command.result
    }
}
```
```

**Features:**
- Type-safe value storage
- Prerequisite verification
- Error tracking and management
- JSON serialization
- Generic type support for custom data structures

---

### A-Polyfill

A polyfill management system that provides consistent API support across different environments.

**Basic Usage:**
```typescript
import { A_Polyfill } from '@adaas/a-utils';

const polyfill = new A_Polyfill();
// Polyfill ensures consistent API availability
```

**Features:**
- Cross-environment compatibility
- Automatic polyfill detection and application
- Integration with A-Component system

---

### A-Schedule

A comprehensive scheduling and task management system with support for delays, cancellation, and promise-based operations.

**Basic Usage:**
```typescript
import { A_Schedule } from '@adaas/a-utils';
import { A_Scope } from '@adaas/a-concept';

const scope = new A_Scope({
    components: [A_Schedule]
});

const schedule = scope.resolve(A_Schedule);

// Schedule a delayed operation
const scheduler = await schedule.delay(3000, async () => {
    return 'Task completed after 3 seconds';
});

const result = await scheduler.promise; // 'Task completed after 3 seconds'
```

**Cancellation Support:**
```typescript
const scheduler = await schedule.delay(5000, async () => {
    return 'This might be cancelled';
});

// Cancel the scheduled task
scheduler.cancel();

try {
    await scheduler.promise;
} catch (error) {
    console.log('Task was cancelled');
}
```

**Advanced Scheduling:**
```typescript
// Schedule multiple tasks
const tasks = await Promise.all([
    schedule.delay(1000, () => 'Task 1'),
    schedule.delay(2000, () => 'Task 2'),
    schedule.delay(3000, () => 'Task 3')
]);

const results = await Promise.all(tasks.map(t => t.promise));
console.log(results); // ['Task 1', 'Task 2', 'Task 3']
```

**Features:**
- Promise-based task scheduling
- Configurable delays
- Task cancellation support
- Multiple concurrent task management
- Integration with A-Component dependency injection
- Type-safe task execution

## Environment Variables

| Variable Name | Required | Description               |
|---------------|----------|---------------------------|
| A_NAMESPACE      |    YES    |      Your desired Namespace for the project     |

Additional environment variables may be required by specific components like A-Config depending on your configuration setup.

## Links

- [ADAAS Website](https://adaas.org)
- [Report Issues](https://github.com/ADAAS-org/adaas-a-utils/issues)
- [Become Future Creator](https://sso.adaas.org)
---

## License

This project is licensed under the [Apache License 2.0](LICENSE).

© 2025 ADAAS YAZILIM LİMİTED ŞİRKETİ All rights reserved.  
All original code and concepts are the intellectual property of ADAAS YAZILIM LİMİTED ŞİRKETİ
