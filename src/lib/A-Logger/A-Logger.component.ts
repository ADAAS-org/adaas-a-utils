import { A_Component, A_Context, A_Error, A_Inject, A_Scope } from "@adaas/a-concept";

import { A_Config } from "@adaas/a-utils/a-config";
import { A_LoggerEnvVariablesType } from "./A-Logger.env";
import { A_LoggerLevel, A_LoggerColorName } from "./A-Logger.types";
import {
    A_LOGGER_DEFAULT_SCOPE_LENGTH,
    A_LOGGER_COLORS,
    A_LOGGER_ANSI,
    A_LOGGER_TIME_FORMAT,
    A_LOGGER_FORMAT,
    A_LOGGER_ENV_KEYS,
    A_LOGGER_SAFE_RANDOM_COLORS,
    A_LOGGER_TERMINAL
} from "./A-Logger.constants";
import { A_Frame } from "@adaas/a-frame";


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
 *     
 *     // Color overload methods with enum support
 *     this.logger.info('green', 'Success message'); // Green message, scope stays default
 *     this.logger.debug('gray', 'Verbose debug info'); // Gray message for less important info
 *     this.logger.info('brightBlue', 'Important notification');
 *     
 *     // Terminal width aware formatting - automatically wraps long lines
 *     this.logger.info('This is a very long message that will be automatically wrapped to fit within the terminal width while maintaining proper indentation and formatting');
 *     
 *     this.logger.warning('Something might be wrong');
 *     this.logger.error(new Error('Something failed'));
 *   }
 * }
 * 
 * // Same scope names will always get the same colors automatically
 * const logger1 = new A_Logger(new A_Scope({name: 'UserService'})); // Gets consistent colors
 * const logger2 = new A_Logger(new A_Scope({name: 'UserService'})); // Gets same colors as logger1
 * 
 * // Available color names (A_LoggerColorName enum):
 * // 'red', 'yellow', 'green', 'blue', 'cyan', 'magenta', 'gray',
 * // 'brightBlue', 'brightCyan', 'brightMagenta', 'darkGray', 'lightGray',
 * // 'indigo', 'violet', 'purple', 'lavender', 'skyBlue', 'steelBlue',
 * // 'slateBlue', 'deepBlue', 'lightBlue', 'periwinkle', 'cornflower',
 * // 'powder', 'charcoal', 'silver', 'smoke', 'slate'
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
@A_Frame.Component({
    namespace: 'A-Utils',
    name: 'A_Logger',
    description: 'Advanced Logging Component with Scope-based Output Formatting that provides color-coded console output, multi-type support, and configurable log levels for enhanced debugging and monitoring.'
})
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

    /**
     * Current terminal width for responsive formatting
     * Automatically detected or falls back to default values
     */
    private readonly TERMINAL_WIDTH: number;

    /**
     * Maximum content width based on terminal size
     * Used for word wrapping and line length calculations
     */
    private readonly MAX_CONTENT_WIDTH: number;

    // =============================================
    // Constructor and Initialization
    // =============================

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
            this.DEFAULT_LOG_COLOR = configLogColor || this.generateColorFromScopeName(this.scope.name);
        } else {
            // If no colors configured, generate complementary pair based on scope name
            const complementaryColors = this.generateComplementaryColorsFromScope(this.scope.name);
            this.DEFAULT_SCOPE_COLOR = complementaryColors.scopeColor;
            this.DEFAULT_LOG_COLOR = complementaryColors.logColor;
        }

        // Initialize terminal width detection
        this.TERMINAL_WIDTH = this.detectTerminalWidth();
        this.MAX_CONTENT_WIDTH = Math.floor(this.TERMINAL_WIDTH * A_LOGGER_TERMINAL.MAX_LINE_LENGTH_RATIO);
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
    // Terminal Width Detection
    // =============================================

    /**
     * Detect current terminal width based on environment
     * 
     * Returns appropriate width for different environments:
     * - Node.js: Uses process.stdout.columns if available
     * - Browser: Returns browser default width
     * - Fallback: Returns default terminal width
     * 
     * @returns Terminal width in characters
     */
    private detectTerminalWidth(): number {
        try {
            // Browser environment
            if (A_Context.environment === 'browser') {
                return A_LOGGER_TERMINAL.BROWSER_DEFAULT_WIDTH;
            }

            // Node.js environment - try to get actual terminal width
            if (typeof process !== 'undefined' && process.stdout && process.stdout.columns) {
                const cols = process.stdout.columns;
                // Ensure minimum width for readability
                return Math.max(cols, A_LOGGER_TERMINAL.MIN_WIDTH);
            }

            // Fallback to default width
            return A_LOGGER_TERMINAL.DEFAULT_WIDTH;
        } catch (error) {
            // If any error occurs, fall back to default width
            return A_LOGGER_TERMINAL.DEFAULT_WIDTH;
        }
    }

    /**
     * Wrap text to fit within terminal width while preserving formatting
     * 
     * @param text - Text to wrap
     * @param scopePadding - The scope padding string for alignment
     * @param isFirstLine - Whether this is the first line (affects available width calculation)
     * @returns Array of wrapped lines with proper indentation
     */
    private wrapText(text: string, scopePadding: string, isFirstLine: boolean = true): string[] {
        if (A_Context.environment === 'browser') {
            // In browser, don't wrap - let browser console handle it
            return [text];
        }

        // Calculate available width for text content
        // First line: terminal_width - scope_header_length (includes [scope] |time| part)
        // Continuation lines: terminal_width - scope_padding - pipe_length
        const scopeHeaderLength = this.formattedScope.length + 4 + this.getTime().length + 4; // [scope] |time| 
        const continuationIndent = `${scopePadding}${A_LOGGER_FORMAT.PIPE}`;

        const firstLineMaxWidth = Math.max(this.TERMINAL_WIDTH - scopeHeaderLength - 1, 20); // -1 for space
        const continuationMaxWidth = Math.max(this.TERMINAL_WIDTH - continuationIndent.length, 20);

        // If text fits on first line, return as is
        if (isFirstLine && text.length <= firstLineMaxWidth) {
            return [text];
        }

        const lines: string[] = [];
        const words = text.split(' ');
        let currentLine = '';
        let currentMaxWidth = isFirstLine ? firstLineMaxWidth : continuationMaxWidth;
        let isCurrentLineFirst = isFirstLine;

        for (const word of words) {
            const spaceNeeded = currentLine ? 1 : 0; // Space before word
            const totalLength = currentLine.length + spaceNeeded + word.length;

            // If adding this word would exceed current line's max width
            if (totalLength > currentMaxWidth) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                    // After first line, all subsequent lines use continuation width
                    currentMaxWidth = continuationMaxWidth;
                    isCurrentLineFirst = false;
                } else {
                    // Word itself is too long, split it
                    if (word.length > currentMaxWidth) {
                        const chunks = this.splitLongWord(word, currentMaxWidth);
                        lines.push(...chunks.slice(0, -1));
                        currentLine = chunks[chunks.length - 1];
                    } else {
                        currentLine = word;
                    }
                    currentMaxWidth = continuationMaxWidth;
                    isCurrentLineFirst = false;
                }
            } else {
                currentLine += (currentLine ? ' ' : '') + word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.length ? lines : [text];
    }

    /**
     * Split a long word that doesn't fit on a single line
     * 
     * @param word - Word to split
     * @param maxLength - Maximum length per chunk
     * @returns Array of word chunks
     */
    private splitLongWord(word: string, maxLength: number): string[] {
        const chunks: string[] = [];
        for (let i = 0; i < word.length; i += maxLength) {
            chunks.push(word.slice(i, i + maxLength));
        }
        return chunks;
    }

    // =============================================
    // Factory Methods
    // =============================



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
     * @returns Array of formatted strings and/or objects ready for console output
     */
    compile(
        messageColor: keyof typeof this.COLORS,
        ...args: any[]
    ): Array<any> {
        const timeString = this.getTime();
        // Calculate padding based on actual displayed scope width (STANDARD_SCOPE_LENGTH)
        // Plus 3 for the brackets and space: [scope] 
        const scopePadding = ' '.repeat(this.STANDARD_SCOPE_LENGTH + 3);
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
     * Format an object for display with proper JSON indentation and terminal width awareness
     * 
     * @param obj - The object to format
     * @param shouldAddNewline - Whether to add a newline prefix
     * @param scopePadding - The padding string for consistent alignment
     * @returns Formatted object string or the object itself for browser environments
     */
    private formatObject(obj: any, shouldAddNewline: boolean, scopePadding: string): any {

        // In case it's browser, return the object as is to use native console object rendering
        // This allows the browser console to display objects with its native interactive features
        if (A_Context.environment === 'browser') {
            return obj;
        }

        // Handle null and undefined values
        if (obj === null) {
            return shouldAddNewline ? `\n${scopePadding}${A_LOGGER_FORMAT.PIPE}null` : 'null';
        }
        if (obj === undefined) {
            return shouldAddNewline ? `\n${scopePadding}${A_LOGGER_FORMAT.PIPE}undefined` : 'undefined';
        }

        let jsonString: string;
        try {
            jsonString = JSON.stringify(obj, null, 2);
        } catch (error) {
            // Handle circular references and other JSON errors
            try {
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
            } catch (fallbackError) {
                // If all else fails, convert to string
                jsonString = String(obj);
            }
        }

        // Apply terminal width wrapping to long JSON string values
        const continuationIndent = `${scopePadding}${A_LOGGER_FORMAT.PIPE}`;
        const maxJsonLineWidth = this.TERMINAL_WIDTH - continuationIndent.length - 4; // -4 for JSON indentation

        // Split into lines and wrap long string values
        const lines = jsonString.split('\n').map(line => {
            // Check if this line contains a long string value
            const stringValueMatch = line.match(/^(\s*"[^"]+":\s*")([^"]+)(".*)?$/);
            if (stringValueMatch && stringValueMatch[2].length > maxJsonLineWidth - stringValueMatch[1].length - (stringValueMatch[3] || '').length) {
                const [, prefix, value, suffix = ''] = stringValueMatch;

                // Wrap the string value if it's too long
                if (value.length > maxJsonLineWidth - prefix.length - suffix.length) {
                    const wrappedValue = this.wrapJsonStringValue(value, maxJsonLineWidth - prefix.length - suffix.length);
                    return prefix + wrappedValue + suffix;
                }
            }
            return line;
        });

        const formatted = lines.join('\n' + continuationIndent);
        return shouldAddNewline ? '\n' + continuationIndent + formatted : formatted;
    }

    /**
     * Wrap a long JSON string value while preserving readability
     * 
     * @param value - The string value to wrap
     * @param maxWidth - Maximum width for the value
     * @returns Wrapped string value
     */
    private wrapJsonStringValue(value: string, maxWidth: number): string {
        if (value.length <= maxWidth) {
            return value;
        }

        // For JSON string values, truncate with ellipsis to maintain JSON validity
        // This prevents the JSON from becoming unreadable due to excessive wrapping
        // while still showing the most important part of the string
        if (maxWidth > 6) { // Ensure we have room for ellipsis
            return value.substring(0, maxWidth - 3) + '...';
        } else {
            // If maxWidth is very small, just return truncated value
            return value.substring(0, Math.max(1, maxWidth));
        }
    }

    /**
     * Format a string for display with proper indentation and terminal width wrapping
     * 
     * @param str - The string to format
     * @param shouldAddNewline - Whether to add a newline prefix
     * @param scopePadding - The padding string for consistent alignment
     * @returns Formatted string
     */
    private formatString(str: string, shouldAddNewline: boolean, scopePadding: string): string {
        // In browser environment, keep simple formatting
        if (A_Context.environment === 'browser') {
            const prefix = shouldAddNewline ? '\n' : '';
            return (prefix + str).replace(/\n/g, '\n' + `${scopePadding}${A_LOGGER_FORMAT.PIPE}`);
        }

        // For terminal, apply intelligent text wrapping
        const wrappedLines = this.wrapText(str, scopePadding, !shouldAddNewline);
        const continuationIndent = `${scopePadding}${A_LOGGER_FORMAT.PIPE}`;

        // Format the wrapped lines with proper indentation
        const formattedLines = wrappedLines.map((line, index) => {
            if (index === 0 && !shouldAddNewline) {
                // First line in inline mode (no newline prefix)
                return line;
            } else {
                // Continuation lines or first line with newline prefix
                return `${continuationIndent}${line}`;
            }
        });

        if (shouldAddNewline) {
            return '\n' + formattedLines.join('\n');
        } else {
            return formattedLines.join('\n');
        }
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
     * @param color - Optional color name from A_LoggerColorName enum or the first message argument
     * @param args - Additional arguments to log
     * 
     * @example
     * ```typescript
     * logger.debug('Debug information'); // Uses instance default colors
     * logger.debug('gray', 'Debug message'); // Gray message, scope stays instance color
     * logger.debug('Processing user:', { id: 1, name: 'John' });
     * ```
     */
    debug(color: A_LoggerColorName, ...args: any[]): void;
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
     * @param color - Optional color name from A_LoggerColorName enum or the first message argument
     * @param args - Additional arguments to log
     * 
     * @example
     * ```typescript
     * logger.info('Hello World'); // Uses instance default colors
     * logger.info('green', 'Success message'); // Green message, scope stays instance color
     * logger.info('Processing user:', { id: 1, name: 'John' });
     * ```
     */
    info(color: A_LoggerColorName, ...args: any[]): void;
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
     * @param color - Optional color name from A_LoggerColorName enum or the first message argument
     * @param args - Additional arguments to log
     */
    log(color: A_LoggerColorName, ...args: any[]): void;
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
        const scopePadding = ' '.repeat(this.STANDARD_SCOPE_LENGTH + 3);

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
     * Provides detailed formatting for A_Error objects with:
     * - Error code, message, and description
     * - Original error information FIRST (better UX for debugging)
     * - Stack traces with terminal width awareness
     * - Documentation links (if available)
     * - Consistent formatting with rest of logger
     * 
     * @param error - The A_Error instance to format
     * @returns Formatted string ready for display
     */
    protected compile_A_Error(error: A_Error): string {
        const continuationIndent = `${' '.repeat(this.STANDARD_SCOPE_LENGTH + 3)}${A_LOGGER_FORMAT.PIPE}`;
        const separator = `${continuationIndent}-------------------------------`;
        const lines: string[] = [];

        // Add error header
        lines.push('');
        lines.push(separator);
        lines.push(`${continuationIndent}A_ERROR: ${error.code}`);
        lines.push(separator);

        // Format and wrap error message and description
        const errorMessage = this.wrapText(`Message: ${error.message}`, continuationIndent, false);
        const errorDescription = this.wrapText(`Description: ${error.description}`, continuationIndent, false);

        lines.push(...errorMessage.map(line => `${continuationIndent}${line}`));
        lines.push(...errorDescription.map(line => `${continuationIndent}${line}`));

        // Show original error FIRST (more important for debugging)
        if (error.originalError) {
            lines.push(separator);
            lines.push(`${continuationIndent}ORIGINAL ERROR:`);
            lines.push(separator);

            const originalMessage = this.wrapText(`${error.originalError.name}: ${error.originalError.message}`, continuationIndent, false);
            lines.push(...originalMessage.map(line => `${continuationIndent}${line}`));

            if (error.originalError.stack) {
                lines.push(`${continuationIndent}Stack trace:`);
                const stackLines = this.formatStackTrace(error.originalError.stack, continuationIndent);
                lines.push(...stackLines);
            }
        }

        // Then show A_Error stack trace
        if (error.stack) {
            lines.push(separator);
            lines.push(`${continuationIndent}A_ERROR STACK:`);
            lines.push(separator);
            const stackLines = this.formatStackTrace(error.stack, continuationIndent);
            lines.push(...stackLines);
        }

        // Documentation link at the end
        if (error.link) {
            lines.push(separator);
            const linkText = this.wrapText(`Documentation: ${error.link}`, continuationIndent, false);
            lines.push(...linkText.map(line => `${continuationIndent}${line}`));
        }

        lines.push(separator);

        return lines.join('\n');
    }

    /**
     * Format stack trace with proper terminal width wrapping and indentation
     * 
     * @param stack - The stack trace string
     * @param baseIndent - Base indentation for continuation lines
     * @returns Array of formatted stack trace lines
     */
    private formatStackTrace(stack: string, baseIndent: string): string[] {
        const stackLines = stack.split('\n');
        const formatted: string[] = [];

        stackLines.forEach((line, index) => {
            if (line.trim()) {
                // Add extra indentation for stack trace lines
                const stackIndent = index === 0 ? baseIndent : `${baseIndent}  `;
                const wrappedLines = this.wrapText(line.trim(), stackIndent, false);
                formatted.push(...wrappedLines.map(wrappedLine =>
                    index === 0 && wrappedLine === wrappedLines[0]
                        ? `${baseIndent}${wrappedLine}`
                        : `${baseIndent}  ${wrappedLine}`
                ));
            }
        });

        return formatted;
    }

    /**
     * Format standard Error instances for inline display within compiled messages
     * 
     * Provides clean, readable formatting for standard JavaScript errors with:
     * - Terminal width aware message wrapping
     * - Properly formatted stack traces
     * - Consistent indentation with rest of logger
     * 
     * @param error - The Error instance to format
     * @returns Formatted string ready for display
     */
    protected compile_Error(error: Error): string {
        const continuationIndent = `${' '.repeat(this.STANDARD_SCOPE_LENGTH + 3)}${A_LOGGER_FORMAT.PIPE}`;
        const separator = `${continuationIndent}-------------------------------`;
        const lines: string[] = [];

        // Add error header
        lines.push('');
        lines.push(separator);
        lines.push(`${continuationIndent}ERROR: ${error.name}`);
        lines.push(separator);

        // Format and wrap error message
        const errorMessage = this.wrapText(`Message: ${error.message}`, continuationIndent, false);
        lines.push(...errorMessage.map(line => `${continuationIndent}${line}`));

        // Format stack trace if available
        if (error.stack) {
            lines.push(separator);
            lines.push(`${continuationIndent}STACK TRACE:`);
            lines.push(separator);
            const stackLines = this.formatStackTrace(error.stack, continuationIndent);
            lines.push(...stackLines);
        }

        lines.push(separator);

        return lines.join('\n');
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