/**
 * A-Logger Component Examples
 * 
 * This file demonstrates various usage patterns and features of the A_Logger component.
 * These examples show the logging capabilities without complex dependency injection.
 * 
 * New Features Demonstrated:
 * - Terminal width detection and automatic text wrapping
 * - Enhanced color palette with A_LoggerColorName enum support
 * - Responsive formatting for different terminal sizes
 * - Browser console compatibility
 */

import { A_Scope, A_Error } from "@adaas/a-concept";
import { A_Logger } from "../src/lib/A-Logger/A-Logger.component";
import { A_LoggerColorName } from "../src/lib/A-Logger/A-Logger.types";

// =============================================
// Basic Logging Examples
// =============================================

/**
 * Example 1: Basic Logger Usage
 */
function basicLogging() {
    console.log('\n=== Example 1: Basic Logger Usage ===\n');

    const scope = new A_Scope({ name: 'API-Service' });
    const logger = new A_Logger(scope);

    // Different log types with color enum support
    logger.info('Logger initialized successfully');
    logger.info('green', 'This is a success message');
    logger.info('brightBlue', 'This is a bright blue info message');
    logger.debug('gray', 'This is a debug message (may not show depending on log level)');
    logger.warning('This is a warning message');
    logger.error('This is an error message');
}

/**
 * Example 2: Scope Length Alignment Demonstration
 */
function scopeLengthDemo() {
    console.log('\n=== Example 2: Scope Length Alignment ===\n');

    const scopes = [
        { name: 'DB' },
        { name: 'Authentication' },
        { name: 'WebSocketManager' },
        { name: 'A' },
        { name: 'VeryLongServiceNameExample' }
    ];

    scopes.forEach(scopeConfig => {
        const scope = new A_Scope(scopeConfig);
        const logger = new A_Logger(scope);
        logger.log('green', `Message from ${scopeConfig.name}`);
        logger.warning('Warning message to show alignment');
    });
}

/**
 * Example 3: Object and Data Logging
 */
function objectLogging() {
    console.log('\n=== Example 3: Object and Data Logging ===\n');

    const scope = new A_Scope({ name: 'DataLogger' });
    const logger = new A_Logger(scope);

    // Simple object
    const userObject = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
            theme: 'dark',
            notifications: true
        }
    };
    logger.log('blue', 'User object:', userObject);

    // Array logging
    const dataArray = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
    ];
    logger.log('magenta', 'Data array:', dataArray);

    // Multi-argument logging
    logger.log('green',
        'Processing complete:',
        'Records processed:', 150,
        'Errors:', 2,
        'Success rate:', '98.7%'
    );
}

/**
 * Example 4: Error Logging
 */
function errorLogging() {
    console.log('\n=== Example 4: Error Logging ===\n');

    const scope = new A_Scope({ name: 'ErrorHandler' });
    const logger = new A_Logger(scope);

    // Standard JavaScript Error
    try {
        throw new Error('Database connection timeout');
    } catch (error) {
        logger.error('Database error occurred:', error);
    }

    // Simple A_Error
    const validationError = new A_Error('User input validation failed');
    logger.error('Validation error:', validationError);

    // Error with context
    const operationContext = {
        userId: 'user-12345',
        operation: 'profile-update',
        timestamp: new Date().toISOString(),
        requestId: 'req-abc123'
    };

    try {
        throw new Error('Profile update failed: Invalid user permissions');
    } catch (error) {
        logger.error(
            'Operation failed with context:',
            error,
            'Context:', operationContext,
            'Additional info:', 'User may need admin privileges'
        );
    }
}

/**
 * Example 5: Color Demonstration with A_LoggerColorName Enum
 */
function colorDemo() {
    console.log('\n=== Example 5: Color Demonstration ===\n');

    const scope = new A_Scope({ name: 'ColorDemo' });
    const logger = new A_Logger(scope);

    // Basic colors
    const basicColors: A_LoggerColorName[] = ['green', 'blue', 'red', 'yellow', 'gray', 'magenta', 'cyan'];
    console.log('Basic Colors:');
    basicColors.forEach(color => {
        logger.info(color, `This is a ${color} colored message`);
    });

    // Extended color palette
    const extendedColors: A_LoggerColorName[] = [
        'brightBlue', 'brightCyan', 'brightMagenta',
        'indigo', 'violet', 'purple', 'lavender',
        'skyBlue', 'steelBlue', 'slateBlue', 'deepBlue',
        'lightBlue', 'periwinkle', 'cornflower', 'powder'
    ];
    console.log('\nExtended Color Palette:');
    extendedColors.forEach(color => {
        logger.info(color, `Extended color: ${color}`);
    });

    // Grayscale colors
    const grayscaleColors: A_LoggerColorName[] = ['darkGray', 'lightGray', 'charcoal', 'silver', 'smoke', 'slate'];
    console.log('\nGrayscale Colors:');
    grayscaleColors.forEach(color => {
        logger.info(color, `Grayscale: ${color}`);
    });
}

/**
 * Example 6: Terminal Width and Text Wrapping Demonstration
 */
function terminalWidthDemo() {
    console.log('\n=== Example 6: Terminal Width Demonstration ===\n');

    const scope = new A_Scope({ name: 'TerminalWidth' });
    const logger = new A_Logger(scope);

    // Long single line that will wrap
    logger.info('cyan', 'This is a very long message that demonstrates automatic text wrapping based on terminal width detection. The logger automatically detects your terminal width and wraps text appropriately to ensure readable output without manual line breaks. This feature works in both Node.js terminal environments and browser consoles with appropriate defaults.');

    // Multiple long arguments
    logger.info('purple',
        'First argument with considerable length to demonstrate wrapping behavior across multiple arguments.',
        'Second argument that is also quite long and will be properly formatted with consistent indentation.',
        'Third argument to show how multiple wrapped arguments maintain visual hierarchy.'
    );

    // Object with long values
    const configObject = {
        databaseConnectionString: 'postgresql://user:password@localhost:5432/mydatabase?ssl=true&connection_timeout=30000&pool_min=5&pool_max=20',
        apiEndpoint: 'https://api.example.com/v2/users/profiles/detailed-information-endpoint-with-very-long-path-name',
        description: 'This is a configuration object with very long string values that will demonstrate how the logger handles wrapping within JSON formatted output',
        features: {
            enableAutoWrapping: true,
            terminalWidthDetection: 'automatic',
            fallbackWidth: 80,
            browserConsoleWidth: 120
        }
    };

    logger.info('brightMagenta', 'Configuration loaded:', configObject);

    // Show current terminal info
    logger.info('steelBlue', 'Terminal environment info:', {
        environment: process?.stdout?.isTTY ? 'TTY Terminal' : 'Non-TTY Environment',
        columns: process?.stdout?.columns || 'Not Available',
        rows: process?.stdout?.rows || 'Not Available',
        platform: process?.platform || 'Browser'
    });
}

/**
 * Example 7: Performance Logging Simulation
 */
async function performanceLogging() {
    console.log('\n=== Example 6: Performance Logging ===\n');

    const scope = new A_Scope({ name: 'PerformanceMonitor' });
    const logger = new A_Logger(scope);

    const operations = ['Database Query', 'API Call', 'File Processing', 'Data Validation'];

    for (const operation of operations) {
        const startTime = Date.now();

        // Simulate work with random delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));

        const duration = Date.now() - startTime;
        const status = duration < 100 ? 'green' : duration < 150 ? 'yellow' : 'red';

        logger.info(status as A_LoggerColorName, `${operation} completed:`, {
            operation,
            duration: `${duration}ms`,
            status: duration < 100 ? 'fast' : duration < 150 ? 'normal' : 'slow',
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Example 8: Real-world Service Logging
 */
async function serviceLogging() {
    console.log('\n=== Example 8: Service Logging Simulation ===\n');

    // Create different service loggers
    const services = {
        api: new A_Logger(new A_Scope({ name: 'API-Gateway' })),
        auth: new A_Logger(new A_Scope({ name: 'Auth' })),
        db: new A_Logger(new A_Scope({ name: 'DatabasePool' })),
        cache: new A_Logger(new A_Scope({ name: 'Redis-Cache' }))
    };

    // Simulate user registration flow
    const userId = 'user-' + Math.random().toString(36).substr(2, 9);

    services.api.info('brightBlue', 'Registration request received:', {
        endpoint: '/api/auth/register',
        userId,
        timestamp: new Date().toISOString()
    });

    services.auth.info('indigo', 'Validating user credentials...');
    await new Promise(resolve => setTimeout(resolve, 50));
    services.auth.info('green', 'Credentials validated successfully');

    services.db.info('violet', 'Creating user record...');
    await new Promise(resolve => setTimeout(resolve, 100));
    services.db.info('green', 'User record created:', { userId, table: 'users' });

    services.cache.info('cornflower', 'Caching user session...');
    await new Promise(resolve => setTimeout(resolve, 30));
    services.cache.info('green', 'Session cached:', { userId, ttl: 3600 });

    services.api.info('green', 'Registration completed successfully:', {
        userId,
        totalTime: '180ms',
        status: 'success'
    });
}

/**
 * Example 9: Complex Object Logging with Enhanced Formatting
 */
function complexObjectLogging() {
    console.log('\n=== Example 9: Complex Object Logging ===\n');

    const scope = new A_Scope({ name: 'ComplexLogger' });
    const logger = new A_Logger(scope);

    const complexObject = {
        request: {
            method: 'POST',
            url: '/api/users',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                'User-Agent': 'Mozilla/5.0 (compatible; ADAAS-Client/1.0)'
            },
            body: {
                name: 'Jane Smith',
                email: 'jane@example.com',
                metadata: {
                    source: 'web-form',
                    campaign: 'summer-2024'
                }
            }
        },
        response: {
            status: 201,
            data: {
                id: 'user-12345',
                created: '2024-10-29T10:30:00Z'
            }
        },
        timing: {
            start: 1698574200000,
            end: 1698574200250,
            duration: 250
        }
    };

    logger.info('deepBlue', 'API Request Complete:', complexObject);

    // Demonstrate terminal width with a very long single-line log
    const longMessage = 'This demonstrates how the logger handles extremely long single messages that exceed normal terminal width. The message will be automatically wrapped while maintaining proper indentation and visual hierarchy. This feature ensures readability across different terminal sizes and environments, from narrow mobile terminals to wide desktop displays.';
    
    logger.info('lavender', 'Long message demonstration:', longMessage);
}

// =============================================
// Main Execution
// =============================================

/**
 * Run all examples
 */
async function runAllExamples() {
    console.log('🚀 A-Logger Component Examples');
    console.log('==============================\n');

    try {
        basicLogging();
        scopeLengthDemo();
        objectLogging();
        errorLogging();
        colorDemo();
        terminalWidthDemo();
        await performanceLogging();
        await serviceLogging();
        complexObjectLogging();

        console.log('\n✅ All examples completed successfully!');

    } catch (error) {
        console.error('\n❌ Example execution failed:', error);
    }
}

// Export functions for individual testing
export {
    basicLogging,
    scopeLengthDemo,
    objectLogging,
    errorLogging,
    colorDemo,
    terminalWidthDemo,
    performanceLogging,
    serviceLogging,
    complexObjectLogging,
    runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples();
}