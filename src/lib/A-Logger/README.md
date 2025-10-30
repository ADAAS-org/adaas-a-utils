# A-Logger Component

A sophisticated logging component for ADAAS applications with advanced formatting, scope-based organization, and configurable output levels.

## Overview

The A_Logger component provides comprehensive logging capabilities with:

- **Scope-based Formatting**: Consistent message alignment regardless of scope name length
- **Color-coded Output**: Terminal color support for visual distinction
- **Object Formatting**: Pretty-printing of JSON objects with proper indentation
- **Error Handling**: Special formatting for A_Error and standard Error objects
- **Log Level Filtering**: Configurable filtering based on severity levels
- **Performance Optimized**: Efficient handling of large objects and rapid logging

## Features

### 🎨 Visual Output
- **Terminal Colors**: Support for 9 different colors (green, blue, red, yellow, gray, magenta, cyan, white, pink)
- **Consistent Alignment**: All log messages align properly regardless of scope name length
- **Structured Formatting**: Multi-line messages with proper indentation and separators

### 📊 Data Types Support
- **Strings**: Simple text messages with optional color coding
- **Objects**: Pretty-printed JSON with nested structure support
- **Arrays**: Formatted array output with proper indentation
- **Errors**: Special handling for both A_Error and standard Error objects
- **Multi-arguments**: Support for logging multiple values in a single call

### 🔧 Configuration
- **Log Levels**: debug, info, warn, error, all
- **Environment Variables**: Configurable via A_LOGGER_LEVEL environment variable
- **Scope Integration**: Seamless integration with A_Scope for context

### ⚡ Performance
- **Efficient Formatting**: Optimized for large objects and rapid logging
- **Memory Conscious**: Minimal memory overhead for formatting operations
- **Non-blocking**: Asynchronous-friendly design

## Installation

```bash
npm install @adaas/a-utils
```

## Basic Usage

### Simple Logging

```typescript
import { A_Scope } from "@adaas/a-concept";
import { A_Logger } from "@adaas/a-utils";

// Create scope and logger
const scope = new A_Scope({ name: 'MyService' });
const logger = new A_Logger(scope);

// Basic logging
logger.log('Application started');
logger.log('green', 'Operation successful');
logger.warning('Resource usage high');
logger.error('Database connection failed');
```

### Object Logging

```typescript
// Log complex objects
const user = {
    id: 123,
    name: 'John Doe',
    preferences: {
        theme: 'dark',
        notifications: true
    }
};

logger.log('blue', 'User data:', user);

// Multi-argument logging
logger.log('green', 
    'Processing complete:',
    'Records:', 150,
    'Errors:', 2,
    'Success rate:', '98.7%'
);
```

### Error Handling

```typescript
// Standard JavaScript errors
try {
    throw new Error('Database timeout');
} catch (error) {
    logger.error('Database operation failed:', error);
}

// A_Error instances
const validationError = new A_Error('Validation failed');
logger.error('Request validation:', validationError);

// Error with context
logger.error(
    'Operation failed:',
    error,
    'Context:', { userId: '123', operation: 'update' },
    'Additional info:', 'User may need admin privileges'
);
```

## Advanced Usage

### Dependency Injection

```typescript
import { A_Inject, A_Component } from "@adaas/a-concept";

class UserService extends A_Component {
    constructor(
        @A_Inject(A_Logger) private logger: A_Logger
    ) {
        super();
    }

    async createUser(userData: any) {
        this.logger.log('green', 'Creating user:', userData);
        
        try {
            // User creation logic
            this.logger.log('User created successfully');
        } catch (error) {
            this.logger.error('User creation failed:', error);
            throw error;
        }
    }
}
```

### Log Level Configuration

```typescript
import { A_Config } from "@adaas/a-utils";

// Configure log level via environment variable
// A_LOGGER_LEVEL=warn

// Or via config injection
const config = new A_Config();
const logger = new A_Logger(scope, config);

// Different log levels:
// - 'debug': Shows all messages
// - 'info': Shows info, warning, and error messages  
// - 'warn': Shows warning and error messages only
// - 'error': Shows error messages only
// - 'all': Shows all messages (default)
```

### Scope Alignment Demonstration

```typescript
// Different scope lengths - all align consistently
const services = [
    new A_Logger(new A_Scope({ name: 'API' })),
    new A_Logger(new A_Scope({ name: 'Authentication' })),
    new A_Logger(new A_Scope({ name: 'DatabaseConnectionPool' })),
    new A_Logger(new A_Scope({ name: 'A' }))
];

services.forEach(logger => {
    logger.log('green', 'Service initialized');
    logger.warning('Configuration check needed');
});

// Output shows consistent alignment:
// [API                 ] |15:42:123| Service initialized
// [Authentication      ] |15:42:124| Service initialized  
// [DatabaseConnectionPool] |15:42:125| Service initialized
// [A                   ] |15:42:126| Service initialized
```

## Color Reference

| Color   | Use Case | Code |
|---------|----------|------|
| `green` | Success, completion | 32 |
| `blue` | Info, general messages | 34 |
| `red` | Errors, critical issues | 31 |
| `yellow` | Warnings, caution | 33 |
| `gray` | Debug, less important | 90 |
| `magenta` | Special highlighting | 35 |
| `cyan` | Headers, titles | 36 |
| `white` | Default text | 37 |
| `pink` | Custom highlighting | 95 |

## Log Level Hierarchy

| Level | Shows |
|-------|-------|
| `debug` | All messages (debug, info, warning, error) |
| `info` | Info, warning, and error messages |
| `warn` | Warning and error messages only |
| `error` | Error messages only |
| `all` | All messages (alias for debug) |

## Output Format

### Standard Message Format
```
[ScopeName          ] |MM:SS:mmm| Message content
```

### Multi-line Object Format  
```
[ScopeName          ] |MM:SS:mmm|
                     |-------------------------------
                     | {
                     |   "key": "value",
                     |   "nested": {
                     |     "data": true
                     |   }
                     | }
                     |-------------------------------
```

### Error Format
```
[ScopeName          ] |MM:SS:mmm|
                     |-------------------------------
                     |  Error:  | ERROR_CODE
                     |-------------------------------
                     |          | Error message
                     |          | Error description
                     |-------------------------------
                     | Stack trace...
                     |-------------------------------
```

## Performance Considerations

- **Large Objects**: Efficiently handles objects with 100+ properties
- **Rapid Logging**: Supports 100+ log calls per second without performance degradation
- **Memory Usage**: Minimal memory overhead for formatting operations
- **String Processing**: Optimized string concatenation and replacement

## Testing

The component includes comprehensive tests covering:

- Basic logging functionality
- Scope formatting and alignment  
- Object and data type handling
- Error formatting
- Color support
- Log level filtering
- Performance characteristics
- Edge cases and error conditions

Run tests:
```bash
npm test A-Logger.test.ts
```

## Examples

See `examples/A-Logger-examples.ts` for comprehensive usage examples including:

- Basic logging patterns
- Scope alignment demonstration
- Object and data logging
- Error handling scenarios
- Color usage examples
- Performance logging simulation
- Real-world service logging

## API Reference

### Constructor

```typescript
constructor(
    scope: A_Scope,
    config?: A_Config<A_LoggerEnvVariablesType>
)
```

### Methods

#### `log(message: any, ...args: any[]): void`
#### `log(color: ColorKey, message: any, ...args: any[]): void`
Log general messages with optional color specification.

#### `warning(...args: any[]): void`
Log warning messages with yellow color coding.

#### `error(...args: any[]): void`  
Log error messages with red color coding.

### Properties

#### `colors: readonly object`
Available color codes for terminal output.

#### `scopeLength: number`
Calculated scope length for consistent formatting.

#### `formattedScope: string`
Padded scope name for consistent alignment.

## Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `A_LOGGER_LEVEL` | string | 'all' | Log level filter (debug, info, warn, error, all) |

## Best Practices

### 1. Use Appropriate Colors
```typescript
logger.log('green', 'Operation successful');    // Success
logger.log('blue', 'Processing data...');       // Info
logger.warning('Resource usage high');          // Warning  
logger.error('Operation failed');               // Error
```

### 2. Provide Context
```typescript
logger.log('blue', 'User operation:', {
    userId: user.id,
    operation: 'profile-update',
    timestamp: new Date().toISOString()
});
```

### 3. Use Appropriate Log Levels
```typescript
// Development
A_LOGGER_LEVEL=debug

// Production  
A_LOGGER_LEVEL=warn
```

### 4. Structure Multi-argument Logs
```typescript
logger.log('green',
    'Operation completed:',
    'Duration:', `${duration}ms`,
    'Records processed:', count,
    'Status:', 'success'
);
```

## Troubleshooting

### Common Issues

**Q: Log messages not appearing**
A: Check the `A_LOGGER_LEVEL` environment variable. Set to 'debug' or 'all' to see all messages.

**Q: Scope names not aligning**  
A: This is handled automatically. The component uses a standard scope length (20 characters) for consistent alignment.

**Q: Colors not showing in terminal**
A: Ensure your terminal supports ANSI color codes. Most modern terminals do.

**Q: Performance issues with large objects**
A: The component is optimized for large objects. If issues persist, consider logging object summaries instead of full objects.

## Contributing

When contributing to the A-Logger component:

1. Add comprehensive tests for new features
2. Update documentation and examples
3. Ensure consistent formatting and alignment
4. Test with various scope name lengths
5. Verify color support across different terminals

## License

Part of the ADAAS ecosystem. See main project license for details.