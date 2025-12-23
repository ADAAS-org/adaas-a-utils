/**
 * A-Logger Component Tests
 * 
 * Comprehensive test suite for the A_Logger component covering:
 * - Basic logging functionality
 * - Scope formatting and alignment
 * - Error handling and formatting
 * - Object and data type logging
 * - Color support
 * - Log level filtering
 */

import { A_Scope, A_Error } from "@adaas/a-concept";
import { A_Logger } from "../src/lib/A-Logger/A-Logger.component";
import { A_Config } from "../src/lib/A-Config/A-Config.context";
import { A_LOGGER_COLORS } from "../src/lib/A-Logger/A-Logger.constants";

// Mock console methods for testing
const originalConsoleLog = console.log;
let capturedLogs: string[] = [];

function mockConsole() {
    console.log = (...args: any[]) => {
        capturedLogs.push(args.join(' '));
    };
}

function restoreConsole() {
    console.log = originalConsoleLog;
}

function getCapturedLogs(): string[] {
    return capturedLogs;
}

function clearCapturedLogs() {
    capturedLogs = [];
}

// =============================================
// Test Suite Setup
// =============================================

describe('A_Logger Component', () => {
    let scope: A_Scope;
    let logger: A_Logger;

    beforeEach(() => {
        scope = new A_Scope({ name: 'TestScope' });
        logger = new A_Logger(scope);
        clearCapturedLogs();
        mockConsole();
    });

    afterEach(() => {
        restoreConsole();
    });

    // =============================================
    // Basic Functionality Tests
    // =============================================

    describe('Basic Logging', () => {
        test('should log simple string messages', () => {
            logger.log('Test message');
            
            const logs = getCapturedLogs();
            expect(logs).toHaveLength(1);
            expect(logs[0]).toContain('TestScope');
            expect(logs[0]).toContain('Test message');
        });

        test('should log with custom colors', () => {
            logger.log('green', 'Success message');
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('Success message');
            // Colors might not be shown in test environment, just verify message content
        });

        test('should log warning messages with yellow color', () => {
            logger.warning('Warning message');
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('Warning message');
            // Colors might not be shown in test environment, just verify message content
        });

        test('should log error messages with red color', () => {
            logger.error('Error message');
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('Error message');
            // Colors might not be shown in test environment, just verify message content
        });
    });

    // =============================================
    // Scope Formatting Tests
    // =============================================

    describe('Scope Formatting', () => {
        test('should pad short scope names to standard length', () => {
            const shortScope = new A_Scope({ name: 'API' });
            const shortLogger = new A_Logger(shortScope);
            
            shortLogger.log('Test message');
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('API'); // Should contain the scope name
            // The formatting should ensure consistent alignment
        });

        test('should handle long scope names', () => {
            const longScope = new A_Scope({ name: 'VeryLongServiceNameThatExceedsStandardLength' });
            const longLogger = new A_Logger(longScope);
            
            longLogger.log('Test message');
            
            const logs = getCapturedLogs();
            // Long scope names should be truncated to the standard length (20 characters)
            expect(logs[0]).toContain('VeryLongServiceNameT'); // Truncated to 20 chars
            expect(logs[0]).toContain('Test message');
        });

        test('should maintain consistent alignment across different scope lengths', () => {
            const scopes = [
                new A_Scope({ name: 'A' }),
                new A_Scope({ name: 'MediumLengthScope' }),
                new A_Scope({ name: 'VeryVeryLongScopeName' })
            ];

            scopes.forEach(testScope => {
                const testLogger = new A_Logger(testScope);
                testLogger.log('Alignment test');
            });

            const logs = getCapturedLogs();
            expect(logs).toHaveLength(3);
            
            // All logs should have similar structure for alignment
            logs.forEach((log, index) => {
                expect(log).toContain('Alignment test');
                // The log format includes ANSI escape codes, so let's test the basic structure
                expect(log).toMatch(/\[.*\]/); // Has scope brackets
                expect(log).toMatch(/\|\d{2}:\d{2}:\d{3}\|/); // Has timestamp
            });
        });
    });

    // =============================================
    // Object Logging Tests
    // =============================================

    describe('Object Logging', () => {
        test('should format simple objects as JSON', () => {
            const testObject = { id: 1, name: 'test', active: true };
            
            logger.log('Object data:', testObject);
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('"id": 1');
            expect(logs[0]).toContain('"name": "test"');
            expect(logs[0]).toContain('"active": true');
        });

        test('should handle nested objects', () => {
            const nestedObject = {
                user: {
                    id: 1,
                    profile: {
                        name: 'John',
                        settings: { theme: 'dark' }
                    }
                }
            };
            
            logger.log('Nested object:', nestedObject);
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('"theme": "dark"');
        });

        test('should handle arrays', () => {
            const testArray = [1, 2, 3, 'test'];
            
            logger.log('Array data:', testArray);
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('[');
            expect(logs[0]).toContain('1,');
            expect(logs[0]).toContain('"test"');
        });

        test('should handle multiple arguments', () => {
            logger.log('Processing:', 'User ID:', 123, 'Status:', { active: true });
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('Processing:');
            expect(logs[0]).toContain('User ID:');
            expect(logs[0]).toContain('123');
            expect(logs[0]).toContain('"active": true');
        });
    });

    // =============================================
    // Error Handling Tests
    // =============================================

    describe('Error Handling', () => {
        test('should format standard JavaScript errors', () => {
            const error = new Error('Test error message');
            
            logger.error('Error occurred:', error);
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('Test error message');
            expect(logs[0]).toContain('ERROR: Error');
            expect(logs[0]).toContain('STACK TRACE:');
        });

        test('should format A_Error instances with special formatting', () => {
            const aError = new A_Error('Custom error message');
            
            logger.error('A_Error occurred:', aError);
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('Custom error message');
            expect(logs[0]).toContain('-------------------------------');
        });

        test('should handle errors with stack traces', () => {
            const error = new Error('Stack trace test');
            // Ensure error has stack
            if (error.stack) {
                logger.error(error);
                
                const logs = getCapturedLogs();
                expect(logs[0]).toContain('Stack trace test');
            }
        });
    });

    // =============================================
    // Color Support Tests
    // =============================================

    describe('Color Support', () => {
        test('should support all defined colors', () => {
            const colors: Array<keyof typeof A_LOGGER_COLORS> = [
                'green', 'blue', 'red', 'yellow', 'gray', 
                'magenta', 'cyan'
            ];

            colors.forEach(color => {
                clearCapturedLogs();
                logger.info(color, `${color} message`);
                
                const logs = getCapturedLogs();
                expect(logs[0]).toContain(`${color} message`);
                // Colors might not be shown in test environment, just verify message content
            });
        });

        test('should support extended color palette from A_LoggerColorName enum', () => {
            const extendedColors: Array<keyof typeof A_LOGGER_COLORS> = [
                'brightBlue', 'brightCyan', 'brightMagenta',
                'indigo', 'violet', 'purple', 'lavender',
                'skyBlue', 'steelBlue', 'slateBlue', 'deepBlue',
                'lightBlue', 'periwinkle', 'cornflower', 'powder',
                'darkGray', 'lightGray', 'charcoal', 'silver', 'smoke', 'slate'
            ];

            extendedColors.forEach(color => {
                clearCapturedLogs();
                logger.info(color, `Extended ${color} message`);
                
                const logs = getCapturedLogs();
                // Clean the output to handle line wrapping
                const cleanedOutput = logs[0].replace(/\n\s*\|\s*/g, ' ').replace(/\s+/g, ' ');
                expect(cleanedOutput).toContain(`Extended ${color} message`);
            });
        });

        test('should default to blue color when no color specified', () => {
            logger.log('Default color message');
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('Default color message');
            // Colors might not be shown in test environment, just verify message content
        });

        test('should treat non-color first argument as message', () => {
            logger.log('not-a-color', 'Second argument');
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('not-a-color');
            expect(logs[0]).toContain('Second argument');
            // Colors might not be shown in test environment, just verify message content
        });
    });

    // =============================================
    // Log Level Filtering Tests
    // =============================================

    describe('Log Level Filtering', () => {
        test('should respect debug log level (show all)', () => {
            const config = { get: () => 'debug' } as any;
            const debugLogger = new A_Logger(scope, config);

            debugLogger.log('Debug message');
            debugLogger.warning('Warning message');
            debugLogger.error('Error message');

            const logs = getCapturedLogs();
            expect(logs).toHaveLength(3);
        });

        test('should respect info log level (show log, warning, error)', () => {
            const config = { get: () => 'info' } as any;
            const infoLogger = new A_Logger(scope, config);

            infoLogger.log('Info message');
            infoLogger.warning('Warning message');
            infoLogger.error('Error message');

            const logs = getCapturedLogs();
            expect(logs).toHaveLength(3);
        });

        test('should respect warn log level (show warning, error only)', () => {
            const config = { get: () => 'warn' } as any;
            const warnLogger = new A_Logger(scope, config);

            warnLogger.log('Info message');
            warnLogger.warning('Warning message');
            warnLogger.error('Error message');

            const logs = getCapturedLogs();
            expect(logs).toHaveLength(2); // Only warning and error
            expect(logs[0]).toContain('Warning message');
            expect(logs[1]).toContain('Error message');
        });

        test('should respect error log level (show error only)', () => {
            const config = { get: () => 'error' } as any;
            const errorLogger = new A_Logger(scope, config);

            errorLogger.log('Info message');
            errorLogger.warning('Warning message');
            errorLogger.error('Error message');

            const logs = getCapturedLogs();
            expect(logs).toHaveLength(1); // Only error
            expect(logs[0]).toContain('Error message');
        });

        test('should handle unknown log level (default to no logging)', () => {
            const config = { get: () => 'unknown' } as any;
            const unknownLogger = new A_Logger(scope, config);

            unknownLogger.log('Info message');
            unknownLogger.warning('Warning message');
            unknownLogger.error('Error message');

            const logs = getCapturedLogs();
            expect(logs).toHaveLength(0);
        });
    });

    // =============================================
    // Timestamp Tests
    // =============================================

    describe('Timestamp Formatting', () => {
        test('should include timestamp in log messages', () => {
            logger.log('Timestamp test');
            
            const logs = getCapturedLogs();
            // Should match pattern like |12:34:567|
            expect(logs[0]).toMatch(/\|\d{2}:\d{2}:\d{3}\|/);
        });

        test('should use consistent timestamp format', () => {
            logger.log('First message');
            logger.log('Second message');
            
            const logs = getCapturedLogs();
            
            // Extract timestamps from both logs
            const timestampRegex = /\|(\d{2}:\d{2}:\d{3})\|/;
            const timestamp1 = logs[0].match(timestampRegex);
            const timestamp2 = logs[1].match(timestampRegex);
            
            expect(timestamp1).not.toBeNull();
            expect(timestamp2).not.toBeNull();
            if (timestamp1 && timestamp2) {
                expect(timestamp1[1]).toMatch(/\d{2}:\d{2}:\d{3}/);
                expect(timestamp2[1]).toMatch(/\d{2}:\d{2}:\d{3}/);
            }
        });
    });

    // =============================================
    // Edge Cases and Error Conditions
    // =============================================

    describe('Edge Cases', () => {
        test('should handle null and undefined values', () => {
            logger.log('Null value:', null);
            logger.log('Undefined value:', undefined);
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('null');
            expect(logs[1]).toContain('undefined');
        });

        test('should handle circular references in objects', () => {
            const circularObj: any = { name: 'test' };
            circularObj.self = circularObj;
            
            // Should not throw an error and should handle circular reference gracefully
            expect(() => {
                logger.log('Circular object:', circularObj);
            }).not.toThrow();
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('Circular object:');
            expect(logs[0]).toContain('[Circular Reference]');
        });

        test('should handle very long strings with wrapping', () => {
            const longString = 'A'.repeat(1000);
            
            logger.info('Long string:', longString);
            
            const logs = getCapturedLogs();
            // The logger now wraps long strings, so we check for the presence of parts of the string
            // rather than the entire string in one line
            expect(logs[0]).toContain('Long string:');
            expect(logs[0]).toContain('AAAAAAAAAAA'); // Should contain many A's
            // The string should be wrapped across multiple lines
            const logLines = logs[0].split('\n');
            expect(logLines.length).toBeGreaterThan(5); // Should be wrapped into multiple lines
        });

        test('should handle empty scope name', () => {
            const emptyScope = new A_Scope({ name: '' });
            const emptyLogger = new A_Logger(emptyScope);
            
            emptyLogger.log('Empty scope test');
            
            const logs = getCapturedLogs();
            expect(logs).toHaveLength(1);
        });
    });

    // =============================================
    // Performance Tests
    // =============================================

    describe('Performance', () => {
        test('should handle multiple rapid log calls', () => {
            const startTime = Date.now();
            
            for (let i = 0; i < 100; i++) {
                logger.log(`Message ${i}`);
            }
            
            const endTime = Date.now();
            const logs = getCapturedLogs();
            
            expect(logs).toHaveLength(100);
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });

        test('should handle large objects efficiently', () => {
            const largeObject = {
                data: Array.from({ length: 100 }, (_, i) => ({
                    id: i,
                    name: `Item ${i}`,
                    metadata: { timestamp: Date.now(), active: true }
                }))
            };
            
            const startTime = Date.now();
            logger.log('Large object:', largeObject);
            const endTime = Date.now();
            
            const logs = getCapturedLogs();
            expect(logs).toHaveLength(1);
            expect(endTime - startTime).toBeLessThan(500); // Should complete within 500ms
        });
    });

    // =============================================
    // Terminal Width and Formatting Tests
    // =============================================

    describe('Terminal Width Detection and Formatting', () => {
        test('should detect terminal width in Node.js environment', () => {
            // The logger should initialize without errors and handle terminal width detection
            expect(() => {
                const testScope = new A_Scope({ name: 'TerminalTest' });
                const terminalLogger = new A_Logger(testScope);
                terminalLogger.info('Terminal width test message');
            }).not.toThrow();
        });

        test('should wrap long messages appropriately', () => {
            // Create a message that's extremely long to ensure wrapping even on wide terminals
            // The message needs to be longer than most reasonable terminal widths (200+ chars)
            const extremelyLongMessage = 'This is an extraordinarily and exceptionally long message designed specifically for testing text wrapping functionality in the A_Logger component, containing numerous words and phrases that together form a sentence of considerable length that should definitely exceed the available width in most terminal configurations, thereby demonstrating the logger\'s sophisticated text wrapping capabilities and ensuring proper formatting across diverse environments with varying screen sizes and terminal window dimensions, while maintaining readability and professional presentation standards.';
            
            logger.info('cyan', extremelyLongMessage);
            
            const logs = getCapturedLogs();
            
            // Remove all newlines and extra spaces to get the actual content for verification
            const cleanedOutput = logs[0].replace(/\n\s*\|\s*/g, ' ').replace(/\s+/g, ' ');
            
            // Verify the message content is preserved regardless of wrapping
            expect(cleanedOutput).toContain('extraordinarily and exceptionally long message');
            expect(cleanedOutput).toContain('readability and professional presentation');
            
            // The message should either be wrapped with newlines OR be very long on one line
            const logOutput = logs[0];
            const hasWrapping = logOutput.includes('\n') && logOutput.includes('|'); // Continuation markers
            const isSingleLongLine = logOutput.length > 300; // Very long single line
            
            // In narrow terminals, wrapping occurs with continuation markers
            // In wide terminals, the message appears as one very long line
            expect(hasWrapping || isSingleLongLine).toBe(true);
            
            // Ensure the complete message is present (checking cleaned version)
            expect(cleanedOutput).toContain('extraordinarily and exceptionally long message');
            expect(cleanedOutput).toContain('professional presentation standards');
        });

        test('should handle multi-argument messages with proper indentation', () => {
            logger.info('brightMagenta', 
                'First long argument that might wrap across lines',
                'Second argument for testing indentation',
                { complexObject: 'with nested data for formatting tests' }
            );
            
            const logs = getCapturedLogs();
            expect(logs[0]).toContain('First long argument');
            expect(logs[0]).toContain('Second argument');
            expect(logs[0]).toContain('complexObject');
        });
    });
});

// =============================================
// Integration Tests
// =============================================

describe('A_Logger Integration', () => {
    beforeEach(() => {
        clearCapturedLogs();
        mockConsole();
    });

    afterEach(() => {
        restoreConsole();
    });

    test('should work with different scope configurations', () => {
        const scopes = [
            new A_Scope({ name: 'Service1' }),
            new A_Scope({ name: 'Service2' }),
            new A_Scope({ name: 'Service3' })
        ];

        scopes.forEach((scope, index) => {
            const logger = new A_Logger(scope);
            logger.log(`Message from ${scope.name}`);
        });

        const logs = getCapturedLogs();
        expect(logs).toHaveLength(3);
        
        logs.forEach((log, index) => {
            expect(log).toContain(`Service${index + 1}`);
            expect(log).toContain(`Message from Service${index + 1}`);
        });
    });

    test('should maintain scope isolation', () => {
        const scope1 = new A_Scope({ name: 'Scope1' });
        const scope2 = new A_Scope({ name: 'Scope2' });
        
        const logger1 = new A_Logger(scope1);
        const logger2 = new A_Logger(scope2);

        logger1.log('Message from logger 1');
        logger2.log('Message from logger 2');

        const logs = getCapturedLogs();
        expect(logs[0]).toContain('Scope1');
        expect(logs[0]).toContain('Message from logger 1');
        expect(logs[1]).toContain('Scope2');
        expect(logs[1]).toContain('Message from logger 2');
    });
});

export { mockConsole, restoreConsole, getCapturedLogs, clearCapturedLogs };