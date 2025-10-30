import { A_Component, A_Error, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_Config } from "../A-Config/A-Config.context";
import { A_LoggerEnvVariablesType } from "./A-Logger.env";
import { A_LoggerLevel } from "./A-Logger.types";
import {
    A_LOGGER_DEFAULT_SCOPE_LENGTH,
    A_LOGGER_COLORS,
    A_LOGGER_ANSI,
    A_LOGGER_TIME_FORMAT,
    A_LOGGER_FORMAT,
    A_LOGGER_ENV_KEYS
} from "./A-Logger.constants";

/**
 * A_Logger - Advanced Logging Component with Scope-based Output Formatting
 * 
 * This component provides comprehensive logging capabilities with:
 * - Color-coded console output for different log levels
 * - Scope-based message formatting with consistent alignment
 * - Support for multiple data types (objects, errors, strings)
 * - Configurable log levels for filtering output
 * - Special handling for A_Error and native Error objects
 * - Timestamp inclusion for better debugging
 * 
 * Key Features:
 * - **Scope Integration**: Uses A_Scope for consistent message prefixing
 * - **Color Support**: Terminal color codes for visual distinction
 * - **Object Formatting**: Pretty-prints JSON objects with proper indentation
 * - **Error Handling**: Special formatting for A_Error and Error objects
 * - **Log Level Filtering**: Configurable filtering based on severity
 * - **Multi-line Support**: Proper alignment for multi-line messages
 * 
 * @example
 * ```typescript
 * // Basic usage with dependency injection
 * class MyService {
 *   constructor(@A_Inject(A_Logger) private logger: A_Logger) {}
 *   
 *   doSomething() {
 *     this.logger.log('Processing started');
 *     this.logger.log('blue', 'Custom color message');
 *     this.logger.warning('Something might be wrong');
 *     this.logger.error(new Error('Something failed'));
 *   }
 * }
 * 
 * // Advanced usage with objects
 * logger.log('green', 'User data:', { id: 1, name: 'John' });
 * logger.error(new A_Error('VALIDATION_FAILED', 'Invalid input data'));
 * ```
 */
export class A_Logger extends A_Component {

    // =============================================
    // Configuration and Constants
    // =============================================

    /**
     * Terminal color codes for different log levels and custom styling
     * These codes work with ANSI escape sequences for colored terminal output
     */
    readonly COLORS;

    /**
     * Standard scope length for consistent formatting
     * This ensures all log messages align properly regardless of scope name length
     */
    private readonly STANDARD_SCOPE_LENGTH;

    // =============================================
    // Constructor and Initialization
    // =============================================

    /**
     * Initialize A_Logger with dependency injection
     * 
     * @param scope - The current scope context for message prefixing
     * @param config - Optional configuration for log level filtering
     */
    constructor(
        @A_Inject(A_Scope) protected scope: A_Scope,
        @A_Inject(A_Config) protected config?: A_Config<A_LoggerEnvVariablesType>,
    ) {
        super();
        this.COLORS = A_LOGGER_COLORS;
        this.STANDARD_SCOPE_LENGTH = config?.get('A_LOGGER_DEFAULT_SCOPE_LENGTH') || A_LOGGER_DEFAULT_SCOPE_LENGTH;
    }

    // =============================================
    // Scope and Formatting Utilities
    // =============================================

    /**
     * Get the formatted scope length for consistent message alignment
     * Uses a standard length to ensure all messages align properly regardless of scope name
     * 
     * @returns The scope length to use for padding calculations
     */
    get scopeLength(): number {
        return Math.max(this.scope.name.length, this.STANDARD_SCOPE_LENGTH);
    }

    /**
     * Get the formatted scope name with proper padding
     * Ensures consistent width for all scope names in log output
     * 
     * @returns Padded scope name for consistent formatting
     */
    get formattedScope(): string {
        return this.scope.name.padEnd(this.STANDARD_SCOPE_LENGTH);
    }


    // =============================================
    // Message Compilation and Formatting
    // =============================================

    /**
     * Compile log arguments into formatted console output with colors and proper alignment
     * 
     * This method handles the core formatting logic for all log messages:
     * - Applies terminal color codes for visual distinction
     * - Formats scope names with consistent padding
     * - Handles different data types appropriately
     * - Maintains proper indentation for multi-line content
     * 
     * @param color - The color key to apply to the message
     * @param args - Variable arguments to format and display
     * @returns Array of formatted strings ready for console output
     */
    compile(
        color: keyof typeof this.COLORS,
        ...args: any[]
    ): Array<string> {
        const timeString = this.getTime();
        const scopePadding = ' '.repeat(this.scopeLength + 3);
        const isMultiArg = args.length > 1;

        return [
            // Header with color, scope, and timestamp
            `${A_LOGGER_ANSI.PREFIX}${this.COLORS[color]}${A_LOGGER_ANSI.SUFFIX}${A_LOGGER_FORMAT.SCOPE_OPEN}${this.formattedScope}${A_LOGGER_FORMAT.SCOPE_CLOSE} ${A_LOGGER_FORMAT.TIME_OPEN}${timeString}${A_LOGGER_FORMAT.TIME_CLOSE}`,

            // Top separator for multi-argument messages
            isMultiArg ? '\n' + `${scopePadding}${A_LOGGER_FORMAT.TIME_OPEN}${A_LOGGER_FORMAT.SEPARATOR}` : '',

            // Process each argument with appropriate formatting
            ...args.map((arg, i) => {
                const shouldAddNewline = i > 0 || isMultiArg;

                switch (true) {
                    case arg instanceof A_Error:
                        return this.compile_A_Error(arg);

                    case arg instanceof Error:
                        return this.compile_Error(arg);

                    case typeof arg === 'object' && arg !== null:
                        return this.formatObject(arg, shouldAddNewline, scopePadding);

                    default:
                        return this.formatString(String(arg), shouldAddNewline, scopePadding);
                }
            }),

            // Bottom separator and color reset
            isMultiArg
                ? '\n' + `${scopePadding}${A_LOGGER_FORMAT.TIME_OPEN}${A_LOGGER_FORMAT.SEPARATOR}${A_LOGGER_ANSI.RESET}`
                : A_LOGGER_ANSI.RESET
        ];
    }

    /**
     * Format an object for display with proper JSON indentation
     * 
     * @param obj - The object to format
     * @param shouldAddNewline - Whether to add a newline prefix
     * @param scopePadding - The padding string for consistent alignment
     * @returns Formatted object string
     */
    private formatObject(obj: any, shouldAddNewline: boolean, scopePadding: string): string {
        let jsonString: string;
        try {
            jsonString = JSON.stringify(obj, null, 2);
        } catch (error) {
            // Handle circular references
            const seen = new WeakSet();
            jsonString = JSON.stringify(obj, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return '[Circular Reference]';
                    }
                    seen.add(value);
                }
                return value;
            }, 2);
        }
        const formatted = jsonString.replace(/\n/g, '\n' + `${scopePadding}${A_LOGGER_FORMAT.PIPE}`);
        return shouldAddNewline ? '\n' + `${scopePadding}${A_LOGGER_FORMAT.PIPE}` + formatted : formatted;
    }

    /**
     * Format a string for display with proper indentation
     * 
     * @param str - The string to format
     * @param shouldAddNewline - Whether to add a newline prefix
     * @param scopePadding - The padding string for consistent alignment
     * @returns Formatted string
     */
    private formatString(str: string, shouldAddNewline: boolean, scopePadding: string): string {
        const prefix = shouldAddNewline ? '\n' : '';
        return (prefix + str).replace(/\n/g, '\n' + `${scopePadding}${A_LOGGER_FORMAT.PIPE}`);
    }

    // =============================================
    // Log Level Management
    // =============================================

    /**
     * Determine if a log message should be output based on configured log level
     * 
     * Log level hierarchy:
     * - debug: Shows all messages
     * - info: Shows info, warning, and error messages
     * - warn: Shows warning and error messages only
     * - error: Shows error messages only
     * - all: Shows all messages (alias for debug)
     * 
     * @param logMethod - The type of log method being called
     * @returns True if the message should be logged, false otherwise
     */
    protected shouldLog(logMethod: 'log' | 'warning' | 'error'): boolean {
        const shouldLog: A_LoggerLevel = this.config?.get(A_LOGGER_ENV_KEYS.LOG_LEVEL) || 'all';

        switch (shouldLog) {
            case 'debug':
                return true;
            case 'info':
                return logMethod === 'log' || logMethod === 'warning' || logMethod === 'error';
            case 'warn':
                return logMethod === 'warning' || logMethod === 'error';
            case 'error':
                return logMethod === 'error';
            case 'all':
                return true;
            default:
                return false;
        }
    }


    // =============================================
    // Public Logging Methods
    // =============================================

    /**
     * General purpose logging method with optional color specification
     * 
     * Supports two usage patterns:
     * 1. log(message, ...args) - Uses default blue color
     * 2. log(color, message, ...args) - Uses specified color
     * 
     * @param color - Optional color key or the first message argument
     * @param args - Additional arguments to log
     * 
     * @example
     * ```typescript
     * logger.log('Hello World');
     * logger.log('green', 'Success message');
     * logger.log('Processing user:', { id: 1, name: 'John' });
     * ```
     */
    log(color: keyof typeof this.COLORS, ...args: any[]): void;
    log(...args: any[]): void;
    log(param1: any, ...args: any[]): void {
        if (!this.shouldLog('log')) return;

        // Check if first parameter is a valid color key
        if (typeof param1 === 'string' && this.COLORS[param1 as keyof typeof this.COLORS]) {
            console.log(...this.compile(param1 as keyof typeof this.COLORS, ...args));
        } else {
            // Use default blue color and treat param1 as first message argument
            console.log(...this.compile('blue', param1, ...args));
        }
    }

    /**
     * Log warning messages with yellow color coding
     * 
     * Use for non-critical issues that should be brought to attention
     * but don't prevent normal operation
     * 
     * @param args - Arguments to log as warnings
     * 
     * @example
     * ```typescript
     * logger.warning('Deprecated method used');
     * logger.warning('Rate limit approaching:', { current: 95, limit: 100 });
     * ```
     */
    warning(...args: any[]): void {
        if (!this.shouldLog('warning')) return;
        console.log(...this.compile('yellow', ...args));
    }

    /**
     * Log error messages with red color coding
     * 
     * Use for critical issues, exceptions, and failures that need immediate attention
     * 
     * @param args - Arguments to log as errors
     * @returns void (for compatibility with console.log)
     * 
     * @example
     * ```typescript
     * logger.error('Database connection failed');
     * logger.error(new Error('Validation failed'));
     * logger.error('Critical error:', error, { context: 'user-registration' });
     * ```
     */
    error(...args: any[]): void {
        if (!this.shouldLog('error')) return;
        console.log(...this.compile('red', ...args));
    }

    // =============================================
    // Specialized Error Formatting
    // =============================================

    /**
     * Legacy method for A_Error logging (kept for backward compatibility)
     * 
     * @deprecated Use error() method instead which handles A_Error automatically
     * @param error - The A_Error instance to log
     */
    protected log_A_Error(error: A_Error): void {
        const time = this.getTime();
        const scopePadding = ' '.repeat(this.scopeLength + 3);

        console.log(`\x1b[31m[${this.formattedScope}] |${time}| ERROR ${error.code}
${scopePadding}| ${error.message}
${scopePadding}| ${error.description} 
${scopePadding}|-------------------------------
${scopePadding}| ${error.stack?.split('\n').map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join('\n') || 'No stack trace'}
${scopePadding}|-------------------------------
\x1b[0m`
            + (error.originalError ? `\x1b[31m${scopePadding}| Wrapped From  ${error.originalError.message}
${scopePadding}|-------------------------------
${scopePadding}| ${error.originalError.stack?.split('\n').map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join('\n') || 'No stack trace'}
${scopePadding}|-------------------------------
\x1b[0m`: '')
            + (error.link ? `\x1b[31m${scopePadding}| Read in docs: ${error.link}
${scopePadding}|-------------------------------
\x1b[0m`: ''));
    }

    /**
     * Format A_Error instances for inline display within compiled messages
     * 
     * Provides detailed formatting for A_Error objects including:
     * - Error code and message
     * - Description and stack trace
     * - Original error information (if wrapped)
     * - Documentation links (if available)
     * 
     * @param error - The A_Error instance to format
     * @returns Formatted string ready for display
     */
    protected compile_A_Error(error: A_Error): string {
        const scopePadding = ' '.repeat(this.scopeLength + 3);

        return '\n' +
            `${scopePadding}|-------------------------------` +
            '\n' +
            `${scopePadding}|  Error:  | ${error.code}
${scopePadding}|-------------------------------
${scopePadding}|${' '.repeat(10)}| ${error.message}
${scopePadding}|${' '.repeat(10)}| ${error.description} 
${scopePadding}|-------------------------------
${scopePadding}| ${error.stack?.split('\n').map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join('\n') || 'No stack trace'}
${scopePadding}|-------------------------------`
            +
            (error.originalError ? `${scopePadding}| Wrapped From  ${error.originalError.message}
${scopePadding}|-------------------------------
${scopePadding}| ${error.originalError.stack?.split('\n').map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join('\n') || 'No stack trace'}
${scopePadding}|-------------------------------` : '')
            +
            (error.link ? `${scopePadding}| Read in docs: ${error.link}
${scopePadding}|-------------------------------` : '');
    }

    /**
     * Format standard Error instances for inline display within compiled messages
     * 
     * Converts standard JavaScript Error objects into a readable JSON format
     * with proper indentation and stack trace formatting
     * 
     * @param error - The Error instance to format
     * @returns Formatted string ready for display
     */
    protected compile_Error(error: Error): string {
        const scopePadding = ' '.repeat(this.scopeLength + 3);

        return JSON.stringify({
            name: error.name,
            message: error.message,
            stack: error.stack?.split('\n')
                .map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`)
                .join('\n')
        }, null, 2)
            .replace(/\n/g, '\n' + `${scopePadding}| `)
            .replace(/\\n/g, '\n');
    }

    // =============================================
    // Utility Methods
    // =============================================

    /**
     * Generate timestamp string for log messages
     * 
     * Format: MM:SS:mmm (minutes:seconds:milliseconds)
     * This provides sufficient precision for debugging while remaining readable
     * 
     * @returns Formatted timestamp string
     * 
     * @example
     * Returns: "15:42:137" for 3:42:15 PM and 137 milliseconds
     */
    protected getTime(): string {
        const now = new Date();
        const minutes = String(now.getMinutes()).padStart(A_LOGGER_TIME_FORMAT.MINUTES_PAD, '0');
        const seconds = String(now.getSeconds()).padStart(A_LOGGER_TIME_FORMAT.SECONDS_PAD, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(A_LOGGER_TIME_FORMAT.MILLISECONDS_PAD, '0');
        return `${minutes}${A_LOGGER_TIME_FORMAT.SEPARATOR}${seconds}${A_LOGGER_TIME_FORMAT.SEPARATOR}${milliseconds}`;
    }
}