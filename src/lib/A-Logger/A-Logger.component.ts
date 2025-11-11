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
    A_LOGGER_ENV_KEYS,
    A_LOGGER_SAFE_RANDOM_COLORS
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
 * // Basic usage with dependency injection (uses deterministic colors based on scope name)
 * class MyService {
 *   constructor(@A_Inject(A_Logger) private logger: A_Logger) {}
 *   
 *   doSomething() {
 *     this.logger.info('Processing started'); // Uses scope-name-based colors, always shows
 *     this.logger.debug('Debug information'); // Only shows when debug level enabled
 *     this.logger.info('green', 'Custom message color'); // Green message, scope stays default
 *     this.logger.warning('Something might be wrong');
 *     this.logger.error(new Error('Something failed'));
 *   }
 * }
 * 
 * // Same scope names will always get the same colors automatically
 * const logger1 = new A_Logger(new A_Scope({name: 'UserService'})); // Gets consistent colors
 * const logger2 = new A_Logger(new A_Scope({name: 'UserService'})); // Gets same colors as logger1
 * 
 * // Configuration via environment variables or A_Config (overrides automatic selection)
 * process.env.A_LOGGER_DEFAULT_SCOPE_COLOR = 'magenta';
 * process.env.A_LOGGER_DEFAULT_LOG_COLOR = 'green';
 * 
 * // Or through A_Config instance
 * const config = new A_Config({
 *   A_LOGGER_DEFAULT_SCOPE_COLOR: 'red',
 *   A_LOGGER_DEFAULT_LOG_COLOR: 'white'
 * });
 * const logger = new A_Logger(scope, config);
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

    /**
     * Default color for the scope portion of log messages
     * This color is used for the scope brackets and content, and remains consistent
     * for this logger instance regardless of message color overrides
     */
    private readonly DEFAULT_SCOPE_COLOR: keyof typeof A_LOGGER_COLORS;

    /**
     * Default color for log message content when no explicit color is provided
     * This color is used for the message body when logging without specifying a color
     */
    private readonly DEFAULT_LOG_COLOR: keyof typeof A_LOGGER_COLORS;

    // =============================================
    // Constructor and Initialization
    // =============================================

    /**
     * Initialize A_Logger with dependency injection
     * Colors are configured through A_Config or generated randomly if not provided
     * 
     * @param scope - The current scope context for message prefixing
     * @param config - Optional configuration for log level filtering and color settings
     */
    constructor(
        @A_Inject(A_Scope) protected scope: A_Scope,
        @A_Inject(A_Config) protected config?: A_Config<A_LoggerEnvVariablesType>
    ) {
        super();
        this.COLORS = A_LOGGER_COLORS;
        this.STANDARD_SCOPE_LENGTH = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_SCOPE_LENGTH) || A_LOGGER_DEFAULT_SCOPE_LENGTH;
        
        // Get colors from config or generate deterministic colors based on scope name
        const configScopeColor = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_SCOPE_COLOR) as keyof typeof A_LOGGER_COLORS;
        const configLogColor = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_LOG_COLOR) as keyof typeof A_LOGGER_COLORS;
        
        if (configScopeColor || configLogColor) {
            // If any color is configured, use config values or fallback to scope-based selection
            this.DEFAULT_SCOPE_COLOR = configScopeColor || this.generateColorFromScopeName(this.scope.name);
            this.DEFAULT_LOG_COLOR = configLogColor || this.generateColorFromScopeName(this.scope.name );
        } else {
            // If no colors configured, generate complementary pair based on scope name
            const complementaryColors = this.generateComplementaryColorsFromScope(this.scope.name);
            this.DEFAULT_SCOPE_COLOR = complementaryColors.scopeColor;
            this.DEFAULT_LOG_COLOR = complementaryColors.logColor;
        }
    }

    // =============================================
    // Color Generation Utilities
    // =============================================

    /**
     * Generate a simple hash from a string
     * Used to create deterministic color selection based on scope name
     * 
     * @param str - The string to hash
     * @returns A numeric hash value
     */
    private simpleHash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Generate a deterministic color based on scope name
     * Same scope names will always get the same color, but uses safe color palette
     * 
     * @param scopeName - The scope name to generate color for
     * @returns A color key from the safe colors palette
     */
    private generateColorFromScopeName(scopeName: string): keyof typeof A_LOGGER_COLORS {
        const safeColors = A_LOGGER_SAFE_RANDOM_COLORS;
        const hash = this.simpleHash(scopeName);
        const colorIndex = hash % safeColors.length;
        return safeColors[colorIndex];
    }

    /**
     * Generate a pair of complementary colors based on scope name
     * Ensures visual harmony between scope and message colors while being deterministic
     * 
     * @param scopeName - The scope name to base colors on
     * @returns Object with scopeColor and logColor that work well together
     */
    private generateComplementaryColorsFromScope(scopeName: string): { scopeColor: keyof typeof A_LOGGER_COLORS, logColor: keyof typeof A_LOGGER_COLORS } {
        // Define color groups that work well together
        const colorPairs = [
            { scopeColor: 'indigo' as const, logColor: 'lightBlue' as const },
            { scopeColor: 'deepBlue' as const, logColor: 'cyan' as const },
            { scopeColor: 'purple' as const, logColor: 'lavender' as const },
            { scopeColor: 'steelBlue' as const, logColor: 'skyBlue' as const },
            { scopeColor: 'slateBlue' as const, logColor: 'periwinkle' as const },
            { scopeColor: 'charcoal' as const, logColor: 'silver' as const },
            { scopeColor: 'violet' as const, logColor: 'brightMagenta' as const },
            { scopeColor: 'darkGray' as const, logColor: 'lightGray' as const },
            { scopeColor: 'cornflower' as const, logColor: 'powder' as const },
            { scopeColor: 'slate' as const, logColor: 'smoke' as const },
        ];
        
        const hash = this.simpleHash(scopeName);
        const pairIndex = hash % colorPairs.length;
        return colorPairs[pairIndex];
    }

    // =============================================
    // Factory Methods
    // =============================================



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
     * Get the formatted scope name with proper padding, centered within the container
     * Ensures consistent width for all scope names in log output with centered alignment
     * 
     * @returns Centered and padded scope name for consistent formatting
     */
    get formattedScope(): string {
        const scopeName = this.scope.name;
        const totalLength = this.STANDARD_SCOPE_LENGTH;
        
        // If scope name is longer than standard length, truncate it
        if (scopeName.length >= totalLength) {
            return scopeName.substring(0, totalLength);
        }
        
        // Calculate padding for centering
        const totalPadding = totalLength - scopeName.length;
        const leftPadding = Math.floor(totalPadding / 2);
        const rightPadding = totalPadding - leftPadding;
        
        return ' '.repeat(leftPadding) + scopeName + ' '.repeat(rightPadding);
    }


    // =============================================
    // Message Compilation and Formatting
    // =============================================

    /**
     * Compile log arguments into formatted console output with colors and proper alignment
     * 
     * This method handles the core formatting logic for all log messages:
     * - Applies separate colors for scope and message content
     * - Formats scope names with consistent padding
     * - Handles different data types appropriately
     * - Maintains proper indentation for multi-line content
     * 
     * @param messageColor - The color key to apply to the message content
     * @param args - Variable arguments to format and display
     * @returns Array of formatted strings ready for console output
     */
    compile(
        messageColor: keyof typeof this.COLORS,
        ...args: any[]
    ): Array<string> {
        const timeString = this.getTime();
        const scopePadding = ' '.repeat(this.scopeLength + 3);
        const isMultiArg = args.length > 1;

        return [
            // Header with separate colors for scope and message content
            `${A_LOGGER_ANSI.PREFIX}${this.COLORS[this.DEFAULT_SCOPE_COLOR]}${A_LOGGER_ANSI.SUFFIX}${A_LOGGER_FORMAT.SCOPE_OPEN}${this.formattedScope}${A_LOGGER_FORMAT.SCOPE_CLOSE}${A_LOGGER_ANSI.RESET} ${A_LOGGER_ANSI.PREFIX}${this.COLORS[messageColor]}${A_LOGGER_ANSI.SUFFIX}${A_LOGGER_FORMAT.TIME_OPEN}${timeString}${A_LOGGER_FORMAT.TIME_CLOSE}`,

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
     * - debug: Shows all messages (debug, info, warning, error)
     * - info: Shows info, warning, and error messages
     * - warn: Shows warning and error messages only
     * - error: Shows error messages only
     * - all: Shows all messages (alias for debug)
     * 
     * @param logMethod - The type of log method being called
     * @returns True if the message should be logged, false otherwise
     */
    protected shouldLog(logMethod: 'debug' | 'info' | 'warning' | 'error'): boolean {
        const shouldLog: A_LoggerLevel = this.config?.get(A_LOGGER_ENV_KEYS.LOG_LEVEL) || 'info';

        switch (shouldLog) {
            case 'debug':
                return true;
            case 'info':
                return logMethod === 'info' || logMethod === 'warning' || logMethod === 'error';
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
     * Debug logging method with optional color specification
     * Only logs when debug level is enabled
     * 
     * Supports two usage patterns:
     * 1. debug(message, ...args) - Uses instance's default log color
     * 2. debug(color, message, ...args) - Uses specified color for message content only
     * 
     * Note: The scope color always remains the instance's default scope color,
     * only the message content color changes when explicitly specified.
     * 
     * @param color - Optional color key or the first message argument
     * @param args - Additional arguments to log
     * 
     * @example
     * ```typescript
     * logger.debug('Debug information'); // Uses instance default colors
     * logger.debug('gray', 'Debug message'); // Gray message, scope stays instance color
     * logger.debug('Processing user:', { id: 1, name: 'John' });
     * ```
     */
    debug(color: keyof typeof this.COLORS, ...args: any[]): void;
    debug(...args: any[]): void;
    debug(param1: any, ...args: any[]): void {
        if (!this.shouldLog('debug')) return;

        // Check if first parameter is a valid color key
        if (typeof param1 === 'string' && this.COLORS[param1 as keyof typeof this.COLORS]) {
            console.log(...this.compile(param1 as keyof typeof this.COLORS, ...args));
        } else {
            // Use instance's default log color and treat param1 as first message argument
            console.log(...this.compile(this.DEFAULT_LOG_COLOR, param1, ...args));
        }
    }

    /**
     * Info logging method with optional color specification
     * Logs without any restrictions (always shows regardless of log level)
     * 
     * Supports two usage patterns:
     * 1. info(message, ...args) - Uses instance's default log color
     * 2. info(color, message, ...args) - Uses specified color for message content only
     * 
     * Note: The scope color always remains the instance's default scope color,
     * only the message content color changes when explicitly specified.
     * 
     * @param color - Optional color key or the first message argument
     * @param args - Additional arguments to log
     * 
     * @example
     * ```typescript
     * logger.info('Hello World'); // Uses instance default colors
     * logger.info('green', 'Success message'); // Green message, scope stays instance color
     * logger.info('Processing user:', { id: 1, name: 'John' });
     * ```
     */
    info(color: keyof typeof this.COLORS, ...args: any[]): void;
    info(...args: any[]): void;
    info(param1: any, ...args: any[]): void {
        if (!this.shouldLog('info')) return;

        // Check if first parameter is a valid color key
        if (typeof param1 === 'string' && this.COLORS[param1 as keyof typeof this.COLORS]) {
            console.log(...this.compile(param1 as keyof typeof this.COLORS, ...args));
        } else {
            // Use instance's default log color and treat param1 as first message argument
            console.log(...this.compile(this.DEFAULT_LOG_COLOR, param1, ...args));
        }
    }

    /**
     * Legacy log method (kept for backward compatibility)
     * @deprecated Use info() method instead
     * 
     * @param color - Optional color key or the first message argument
     * @param args - Additional arguments to log
     */
    log(color: keyof typeof this.COLORS, ...args: any[]): void;
    log(...args: any[]): void;
    log(param1: any, ...args: any[]): void {
        // Delegate to info method for backward compatibility
        this.info(param1, ...args);
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