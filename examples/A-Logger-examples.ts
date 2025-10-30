/**
 * A-Logger Component Examples
 * 
 * This file demonstrates various usage patterns and features of the A_Logger component.
 * These examples show the logging capabilities without complex dependency injection.
 */

import { A_Scope, A_Error } from "@adaas/a-concept";
import { A_Logger } from "../src/lib/A-Logger/A-Logger.component";

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

    // Different log types
    logger.log('Logger initialized successfully');
    logger.log('green', 'This is a success message');
    logger.log('blue', 'This is an info message');
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
 * Example 5: Different Colors and Formatting
 */
function colorDemo() {
    console.log('\n=== Example 5: Color Demonstration ===\n');

    const scope = new A_Scope({ name: 'ColorDemo' });
    const logger = new A_Logger(scope);

    // All available colors
    const colors = ['green', 'blue', 'red', 'yellow', 'gray', 'magenta', 'cyan', 'white', 'pink'] as const;

    colors.forEach(color => {
        logger.log(color, `This is a ${color} colored message`);
    });
}

/**
 * Example 6: Performance Logging Simulation
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

        logger.log(status, `${operation} completed:`, {
            operation,
            duration: `${duration}ms`,
            status: duration < 100 ? 'fast' : duration < 150 ? 'normal' : 'slow',
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Example 7: Real-world Service Logging
 */
async function serviceLogging() {
    console.log('\n=== Example 7: Service Logging Simulation ===\n');

    // Create different service loggers
    const services = {
        api: new A_Logger(new A_Scope({ name: 'API-Gateway' })),
        auth: new A_Logger(new A_Scope({ name: 'Auth' })),
        db: new A_Logger(new A_Scope({ name: 'DatabasePool' })),
        cache: new A_Logger(new A_Scope({ name: 'Redis-Cache' }))
    };

    // Simulate user registration flow
    const userId = 'user-' + Math.random().toString(36).substr(2, 9);

    services.api.log('green', 'Registration request received:', {
        endpoint: '/api/auth/register',
        userId,
        timestamp: new Date().toISOString()
    });

    services.auth.log('blue', 'Validating user credentials...');
    await new Promise(resolve => setTimeout(resolve, 50));
    services.auth.log('green', 'Credentials validated successfully');

    services.db.log('blue', 'Creating user record...');
    await new Promise(resolve => setTimeout(resolve, 100));
    services.db.log('green', 'User record created:', { userId, table: 'users' });

    services.cache.log('blue', 'Caching user session...');
    await new Promise(resolve => setTimeout(resolve, 30));
    services.cache.log('green', 'Session cached:', { userId, ttl: 3600 });

    services.api.log('green', 'Registration completed successfully:', {
        userId,
        totalTime: '180ms',
        status: 'success'
    });
}

/**
 * Example 8: Complex Object Logging
 */
function complexObjectLogging() {
    console.log('\n=== Example 8: Complex Object Logging ===\n');

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

    logger.log('blue', 'API Request Complete:', complexObject);
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
    performanceLogging,
    serviceLogging,
    complexObjectLogging,
    runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples();
}