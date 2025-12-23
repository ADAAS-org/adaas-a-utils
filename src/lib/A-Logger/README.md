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
- **Extended Color Palette**: Support for 25+ colors including basic colors (red, green, blue) and extended palette (indigo, violet, cornflower, etc.)
- **Color Enum Support**: Type-safe color specification using A_LoggerColorName enum
- **Consistent Alignment**: All log messages align properly regardless of scope name length
- **Structured Formatting**: Multi-line messages with proper indentation and separators
- **Terminal Width Detection**: Automatic detection of terminal width for optimal formatting
- **Responsive Text Wrapping**: Intelligent text wrapping based on terminal size

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
- **Terminal Adaptation**: Automatic adaptation to different terminal widths and environments
- **Browser Compatibility**: Optimized formatting for both terminal and browser console environments

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
logger.info('Application started');
logger.info('green', 'Operation successful');
logger.warning('Resource usage high');
logger.error('Database connection failed');

// Enhanced color support with type safety
import { A_LoggerColorName } from "@adaas/a-utils";

logger.info('brightBlue', 'Enhanced blue message');
logger.info('indigo', 'Deep indigo notification');
logger.info('cornflower', 'Cornflower blue status');
logger.debug('gray', 'Debug information');
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

logger.info('deepBlue', 'User data:', user);

// Multi-argument logging
logger.info('green', 
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
        this.logger.info('brightBlue', 'Creating user:', userData);
        
        try {
            // User creation logic
            this.logger.info('green', 'User created successfully');
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
    logger.info('green', 'Service initialized');
    logger.warning('Configuration check needed');
});

// Output shows consistent alignment:
// [API                 ] |15:42:123| Service initialized
// [Authentication      ] |15:42:124| Service initialized  
// [DatabaseConnectionPool] |15:42:125| Service initialized
// [A                   ] |15:42:126| Service initialized
```

### Terminal Width and Text Wrapping

The A_Logger automatically detects your terminal width and wraps long messages for optimal readability:

```typescript
// Long messages are automatically wrapped
logger.info('cyan', 
    'This is a very long message that will be automatically wrapped based on your terminal width to ensure optimal readability while maintaining proper formatting and indentation throughout the entire message.'
);

// Multi-argument messages maintain proper indentation
logger.info('purple',
    'First argument that is quite long and demonstrates wrapping behavior',
    'Second argument with continued proper indentation',
    {
        configuration: {
            terminalWidth: 'auto-detected',
            wrapping: 'intelligent',
            fallbacks: ['80 chars', 'browser: 120 chars']
        }
    }
);

// Terminal information logging
logger.info('steelBlue', 'Terminal info:', {
    columns: process.stdout?.columns || 'Not detected',
    environment: process.stdout?.isTTY ? 'TTY' : 'Non-TTY',
    platform: process.platform
});
```

**Terminal Width Features:**
- **Auto-detection**: Automatically detects terminal width using `process.stdout.columns`
- **Smart Wrapping**: Wraps text at word boundaries when possible
- **Consistent Indentation**: Maintains proper indentation for wrapped lines
- **Environment Aware**: Different defaults for Node.js terminal vs browser console
- **Fallback Support**: Uses sensible defaults when width cannot be detected

## Color Reference

### Basic Colors
| Color   | Use Case | Code |
|---------|----------|------|
| `red` | Errors, critical issues | 31 |
| `yellow` | Warnings, cautions | 33 |
| `green` | Success, completion | 32 |
| `blue` | Information, general | 34 |
| `cyan` | Headers, highlights | 36 |
| `magenta` | Special emphasis | 35 |
| `gray` | Debug, less important | 90 |

### Extended Color Palette
| Color   | Description | Code |
|---------|-------------|------|
| `brightBlue` | Enhanced blue variant | 94 |
| `brightCyan` | Enhanced cyan variant | 96 |
| `brightMagenta` | Enhanced magenta variant | 95 |
| `indigo` | Deep indigo | 38;5;54 |
| `violet` | Violet | 38;5;93 |
| `purple` | Purple | 38;5;129 |
| `lavender` | Lavender | 38;5;183 |
| `skyBlue` | Sky blue | 38;5;117 |
| `steelBlue` | Steel blue | 38;5;67 |
| `slateBlue` | Slate blue | 38;5;62 |
| `deepBlue` | Deep blue | 38;5;18 |
| `lightBlue` | Light blue | 38;5;153 |
| `periwinkle` | Periwinkle | 38;5;111 |
| `cornflower` | Cornflower blue | 38;5;69 |
| `powder` | Powder blue | 38;5;152 |

### Grayscale Colors
| Color   | Description | Code |
|---------|-------------|------|
| `darkGray` | Dark gray | 30 |
| `lightGray` | Light gray | 37 |
| `charcoal` | Charcoal | 38;5;236 |
| `silver` | Silver | 38;5;250 |
| `smoke` | Smoke gray | 38;5;244 |
| `slate` | Slate gray | 38;5;240 |
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
logger.info('green', 'Operation successful');    // Success
logger.info('brightBlue', 'Processing data...');       // Info
logger.warning('Resource usage high');          // Warning  
logger.error('Operation failed');               // Error
```

### 2. Provide Context
```typescript
logger.info('steelBlue', 'User operation:', {
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
logger.info('green',
    'Operation completed:',
    'Duration:', `${duration}ms`,
    'Records processed:', count,
    'Status:', 'success'
);
```

### 5. Leverage Terminal Width Awareness
```typescript
// Long messages are automatically wrapped
logger.info('cyan', 'Very long status message that will automatically wrap based on terminal width while maintaining proper formatting');

// Use appropriate colors from the extended palette
logger.info('indigo', 'Service initialization complete');
logger.debug('charcoal', 'Detailed debug information');
logger.info('cornflower', 'Processing pipeline status');
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

**Q: Messages not wrapping correctly in terminal**
A: The logger automatically detects terminal width via `process.stdout.columns`. If detection fails, it uses defaults (80 chars for terminal, 120 for browser).

**Q: Text wrapping behavior inconsistent**
A: Terminal width detection depends on the environment. In non-TTY environments or when columns cannot be detected, the logger falls back to default widths.

## Contributing

When contributing to the A-Logger component:

1. Add comprehensive tests for new features
2. Update documentation and examples
3. Ensure consistent formatting and alignment
4. Test with various scope name lengths
5. Verify color support across different terminals

## License

Part of the ADAAS ecosystem. See main project license for details.