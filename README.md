<img align="left" style="margin-right:40px; margin-bottom:80px;" width="180" height="80" src="./docs/a-logo-docs.png" alt="ADAAS Logo">

# A-Utils SDK 

This package is a set of common utilities that can be used across projects related or not related to ADAAS Ecosystem. 
In this package it is possible to find useful features to work with structures, objects, types, commands, configuration management, logging, scheduling, and more.  


| LTS | Latest | npm               |
|---------------|----------|---------------------------|
| v0.1.7      |   v0.1.7    |     [@adaas/a-utils](https://npm.com)    |


<!-- TABLE OF CONTENTS -->
## Table of Contents

- [About the Project](#overview)
- [Installation](#installation)
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

A communication channel component that provides messaging capabilities within the ADAAS ecosystem.

**Basic Usage:**
```typescript
import { A_Channel } from '@adaas/a-utils';

const channel = new A_Channel();
// Channel is ready for use
```

**Features:**
- Inter-component communication
- Message routing and handling
- Integration with A-Context

---

### A-Command

A powerful command execution system that provides structured command patterns with lifecycle management, status tracking, and serialization capabilities.

**Basic Usage:**
```typescript
import { A_Command } from '@adaas/a-utils';

// Create a command
const command = new A_Command({});

// Execute the command
await command.execute();

console.log(command.status); // 'COMPLETED'
console.log(command.duration); // Execution time in ms
```

**Advanced Usage:**
```typescript
// Command with custom logic
class CustomCommand extends A_Command {
    async execute() {
        // Your custom command logic here
        return await super.execute();
    }
}

// Serialization
const command = new A_Command({});
await command.execute();

const serialized = command.toJSON();
const deserializedCommand = new A_Command(serialized);
```

**Features:**
- Command execution with lifecycle management
- Status tracking (INITIALIZED, PROCESSING, COMPLETED, FAILED)
- Built-in timing and duration tracking
- JSON serialization/deserialization
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

A comprehensive logging system with color support, scope awareness, and configurable output formatting.

**Basic Usage:**
```typescript
import { A_Logger } from '@adaas/a-utils';
import { A_Scope } from '@adaas/a-concept';

const scope = new A_Scope({
    name: 'MyApp',
    components: [A_Logger]
});

const logger = scope.resolve(A_Logger);

logger.log('Hello World');
logger.error('Something went wrong');
logger.warning('This is a warning');
logger.success('Operation completed');
```

**Features:**
- Colored console output
- Scope-aware logging
- Multiple log levels (log, error, warning, success)
- Integration with A-Config for configuration
- Formatted output with timestamps and scope information

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

A type-safe memory management system for storing intermediate values and tracking errors during complex operations.

**Basic Usage:**
```typescript
import { A_Memory } from '@adaas/a-utils';

// Create memory instance
const memory = new A_Memory<{
    userId: string;
    userData: any;
    processedData: any;
}>({
    userId: '12345'
});

// Store values
memory.set('userData', { name: 'John', email: 'john@example.com' });
memory.set('processedData', processUserData(memory.get('userData')));

// Check prerequisites
const hasRequired = await memory.verifyPrerequisites(['userId', 'userData']);
console.log(hasRequired); // true

// Access values
const userId = memory.get('userId');
const allData = memory.toJSON();
```

**Error Tracking:**
```typescript
import { A_Error } from '@adaas/a-concept';

const memory = new A_Memory();

// Errors are automatically tracked
try {
    // Some operation that might fail
    throw new A_Error('Something went wrong');
} catch (error) {
    memory.addError(error);
}

// Check for errors
if (memory.Errors) {
    console.log('Errors occurred:', memory.Errors);
}
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
