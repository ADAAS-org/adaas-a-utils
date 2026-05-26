import { A_TYPES__ConceptENVVariables, A_TYPES__Fragment_Constructor, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_Component, A_Scope, A_Error } from '@adaas/a-concept';
import { A_ExecutionContext } from './a-execution.mjs';

declare enum A_TYPES__ConfigFeature {
}
type A_TYPES__ConfigContainerConstructor<T extends Array<string | A_TYPES__ConceptENVVariables[number]>> = {
    /**
     * If set to true, the SDK will throw an error if the variable is not defined OR not presented in the defaults
     */
    strict: boolean;
    /**
     * Allows to define the names of variable to be loaded
     */
    variables: T;
    /**
     * Allows to set the default values for the variables
     */
    defaults: {
        [key in T[number]]?: any;
    };
} & A_TYPES__Fragment_Constructor;

declare const A_CONSTANTS__CONFIG_ENV_VARIABLES: {};
type A_TYPES__ConfigENVVariables = (typeof A_CONSTANTS__CONFIG_ENV_VARIABLES)[keyof typeof A_CONSTANTS__CONFIG_ENV_VARIABLES][];
declare const A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY: readonly [];

declare class A_Config<T extends Array<string | A_TYPES__ConceptENVVariables[number]> = any[]> extends A_ExecutionContext<{
    [key in T[number]]: any;
} & {
    [key in typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY[number]]: any;
} & {
    [key in typeof A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY[number]]: any;
}> {
    protected _strict: boolean;
    protected _configProperties: T;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: ("A_CONCEPT_NAME" | "A_CONCEPT_ROOT_SCOPE" | "A_CONCEPT_ENVIRONMENT" | "A_CONCEPT_RUNTIME_ENVIRONMENT" | "A_CONCEPT_ROOT_FOLDER" | "A_ERROR_DEFAULT_DESCRIPTION")[];
    constructor(config: Partial<A_TYPES__ConfigContainerConstructor<T>>);
    get strict(): boolean;
    /**
      * This method is used to get the configuration property by name
      *
      * @param property
      * @returns
      */
    get<K extends T[number]>(property: K | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]): {
        [key in T[number]]: any;
    }[K] | undefined;
    /**
     *
     * This method is used to set the configuration property by name
     * OR set multiple properties at once by passing an array of objects
     *
     * @param variables
     */
    set(variables: Array<{
        property: T[number] | A_TYPES__ConceptENVVariables[number];
        value: any;
    }>): any;
    set(variables: Partial<Record<T[number] | A_TYPES__ConceptENVVariables[number], any>>): any;
    set(property: T[number] | A_TYPES__ConceptENVVariables[number], value: any): any;
}

declare const A_LoggerEnvVariables: {
    /**
     * Sets the log level for the logger
     *
     * @example 'debug', 'info', 'warn', 'error'
     */
    readonly A_LOGGER_LEVEL: "A_LOGGER_LEVEL";
    /**
     * Sets the default scope length for log messages
     *
     * @example 'A_LOGGER_DEFAULT_SCOPE_LENGTH'
     */
    readonly A_LOGGER_DEFAULT_SCOPE_LENGTH: "A_LOGGER_DEFAULT_SCOPE_LENGTH";
    /**
     * Sets the default color for scope display in log messages
     *
     * @example 'green', 'blue', 'red', 'yellow', 'gray', 'magenta', 'cyan', 'white', 'pink'
     */
    readonly A_LOGGER_DEFAULT_SCOPE_COLOR: "A_LOGGER_DEFAULT_SCOPE_COLOR";
    /**
     * Sets the default color for log message content
     *
     * @example 'green', 'blue', 'red', 'yellow', 'gray', 'magenta', 'cyan', 'white', 'pink'
     */
    readonly A_LOGGER_DEFAULT_LOG_COLOR: "A_LOGGER_DEFAULT_LOG_COLOR";
};
declare const A_LoggerEnvVariablesArray: readonly ["A_LOGGER_LEVEL", "A_LOGGER_DEFAULT_SCOPE_LENGTH", "A_LOGGER_DEFAULT_SCOPE_COLOR", "A_LOGGER_DEFAULT_LOG_COLOR"];
type A_LoggerEnvVariablesType = (typeof A_LoggerEnvVariables)[keyof typeof A_LoggerEnvVariables][];

/**
 * A-Logger Constants
 *
 * Configuration constants and default values for the A_Logger component
 */
/**
 * Default scope length for consistent message alignment
 */
declare const A_LOGGER_DEFAULT_SCOPE_LENGTH = 20;
/**
 * Default log level when none is specified
 */
declare const A_LOGGER_DEFAULT_LEVEL = "all";
/**
 * Terminal color codes mapping
 */
declare const A_LOGGER_COLOR_CODES: {
    readonly red: "31";
    readonly yellow: "33";
    readonly green: "32";
    readonly blue: "34";
    readonly cyan: "36";
    readonly magenta: "35";
    readonly gray: "90";
    readonly brightBlue: "94";
    readonly brightCyan: "96";
    readonly brightMagenta: "95";
    readonly darkGray: "30";
    readonly lightGray: "37";
    readonly indigo: "38;5;54";
    readonly violet: "38;5;93";
    readonly purple: "38;5;129";
    readonly lavender: "38;5;183";
    readonly skyBlue: "38;5;117";
    readonly steelBlue: "38;5;67";
    readonly slateBlue: "38;5;62";
    readonly deepBlue: "38;5;18";
    readonly lightBlue: "38;5;153";
    readonly periwinkle: "38;5;111";
    readonly cornflower: "38;5;69";
    readonly powder: "38;5;152";
    readonly charcoal: "38;5;236";
    readonly silver: "38;5;250";
    readonly smoke: "38;5;244";
    readonly slate: "38;5;240";
};
declare const A_LOGGER_COLORS: {
    readonly red: "red";
    readonly yellow: "yellow";
    readonly green: "green";
    readonly blue: "blue";
    readonly cyan: "cyan";
    readonly magenta: "magenta";
    readonly gray: "gray";
    readonly brightBlue: "brightBlue";
    readonly brightCyan: "brightCyan";
    readonly brightMagenta: "brightMagenta";
    readonly darkGray: "darkGray";
    readonly lightGray: "lightGray";
    readonly indigo: "indigo";
    readonly violet: "violet";
    readonly purple: "purple";
    readonly lavender: "lavender";
    readonly skyBlue: "skyBlue";
    readonly steelBlue: "steelBlue";
    readonly slateBlue: "slateBlue";
    readonly deepBlue: "deepBlue";
    readonly lightBlue: "lightBlue";
    readonly periwinkle: "periwinkle";
    readonly cornflower: "cornflower";
    readonly powder: "powder";
    readonly charcoal: "charcoal";
    readonly silver: "silver";
    readonly smoke: "smoke";
    readonly slate: "slate";
};
/**
 * Safe colors for random selection - grey-blue-violet palette
 * Excludes system colors (red, yellow, green) to avoid confusion with warnings/errors
 */
declare const A_LOGGER_SAFE_RANDOM_COLORS: readonly ["blue", "cyan", "magenta", "gray", "brightBlue", "brightCyan", "brightMagenta", "darkGray", "lightGray", "indigo", "violet", "purple", "lavender", "skyBlue", "steelBlue", "slateBlue", "deepBlue", "lightBlue", "periwinkle", "cornflower", "powder", "charcoal", "silver", "smoke", "slate"];
/**
 * ANSI escape codes
 */
declare const A_LOGGER_ANSI: {
    readonly RESET: "\u001B[0m";
    readonly PREFIX: "\u001B[";
    readonly SUFFIX: "m";
};
/**
 * Timestamp format configuration
 */
declare const A_LOGGER_TIME_FORMAT: {
    readonly MINUTES_PAD: 2;
    readonly SECONDS_PAD: 2;
    readonly MILLISECONDS_PAD: 3;
    readonly SEPARATOR: ":";
};
/**
 * Log message structure constants
 */
declare const A_LOGGER_FORMAT: {
    readonly SCOPE_OPEN: "[";
    readonly SCOPE_CLOSE: "]";
    readonly TIME_OPEN: "|";
    readonly TIME_CLOSE: "|";
    readonly SEPARATOR: "-------------------------------";
    readonly INDENT_BASE: 3;
    readonly PIPE: "| ";
};
/**
 * Environment variable keys
 */
/**
 * Terminal width configuration
 */
declare const A_LOGGER_TERMINAL: {
    readonly DEFAULT_WIDTH: 80;
    readonly MIN_WIDTH: 40;
    readonly MAX_LINE_LENGTH_RATIO: 0.8;
    readonly BROWSER_DEFAULT_WIDTH: 120;
};
/**
 * Environment variable keys
 */
declare const A_LOGGER_ENV_KEYS: {
    readonly LOG_LEVEL: "A_LOGGER_LEVEL";
    readonly DEFAULT_SCOPE_LENGTH: "A_LOGGER_DEFAULT_SCOPE_LENGTH";
    readonly DEFAULT_SCOPE_COLOR: "A_LOGGER_DEFAULT_SCOPE_COLOR";
    readonly DEFAULT_LOG_COLOR: "A_LOGGER_DEFAULT_LOG_COLOR";
};
declare const A_LOGGER_LEVELS: {
    debug: string;
    info: string;
    log: string;
    warning: string;
    error: string;
    all: string;
};
declare const A_LOGGER_FEATURES: {
    readonly onLog: "A_Logger_onLog";
};
declare const A_LOGGER_ENV_VARIABLES: {
    /**
     * Sets the log level for the logger
     *
     * @example 'debug', 'info', 'warn', 'error'
     */
    readonly A_LOGGER_LEVEL: "A_LOGGER_LEVEL";
    /**
     * Sets the default scope length for log messages
     *
     * @example 'A_LOGGER_DEFAULT_SCOPE_LENGTH'
     */
    readonly A_LOGGER_DEFAULT_SCOPE_LENGTH: "A_LOGGER_DEFAULT_SCOPE_LENGTH";
    /**
     * Sets the default color for scope display in log messages
     *
     * @example 'green', 'blue', 'red', 'yellow', 'gray', 'magenta', 'cyan', 'white', 'pink'
     */
    readonly A_LOGGER_DEFAULT_SCOPE_COLOR: "A_LOGGER_DEFAULT_SCOPE_COLOR";
    /**
     * Sets the default color for log message content
     *
     * @example 'green', 'blue', 'red', 'yellow', 'gray', 'magenta', 'cyan', 'white', 'pink'
     */
    readonly A_LOGGER_DEFAULT_LOG_COLOR: "A_LOGGER_DEFAULT_LOG_COLOR";
};

type A_LoggerLevel = typeof A_LOGGER_LEVELS[keyof typeof A_LOGGER_LEVELS];
/**
 * Available color names for the logger
 * Can be used as first parameter in logging methods to specify message color
 */
type A_LoggerColorName = typeof A_LOGGER_COLORS[keyof typeof A_LOGGER_COLORS];
type A_LoggerFeatureName = typeof A_LOGGER_FEATURES[keyof typeof A_LOGGER_FEATURES];

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
 *   constructor(@A_Inject(A_Logger) protected logger: A_Logger) {}
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
declare class A_Logger extends A_Component {
    protected scope: A_Scope;
    protected config?: A_Config<A_LoggerEnvVariablesType> | undefined;
    static get onLog(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;
    /**
     * Terminal color codes for different log levels and custom styling
     * These codes work with ANSI escape sequences for colored terminal output
     */
    readonly COLORS: any;
    /**
     * Standard scope length for consistent formatting
     * This ensures all log messages align properly regardless of scope name length
     */
    protected readonly STANDARD_SCOPE_LENGTH: any;
    /**
     * Default color for the scope portion of log messages
     * This color is used for the scope brackets and content, and remains consistent
     * for this logger instance regardless of message color overrides
     */
    protected readonly DEFAULT_SCOPE_COLOR: keyof typeof A_LOGGER_COLOR_CODES;
    /**
     * Default color for log message content when no explicit color is provided
     * This color is used for the message body when logging without specifying a color
     */
    protected readonly DEFAULT_LOG_COLOR: keyof typeof A_LOGGER_COLOR_CODES;
    /**
     * Current terminal width for responsive formatting
     * Automatically detected or falls back to default values
     */
    protected readonly TERMINAL_WIDTH: number;
    /**
     * Maximum content width based on terminal size
     * Used for word wrapping and line length calculations
     */
    protected readonly MAX_CONTENT_WIDTH: number;
    /**
     * Initialize A_Logger with dependency injection
     * Colors are configured through A_Config or generated randomly if not provided
     *
     * @param scope - The current scope context for message prefixing
     * @param config - Optional configuration for log level filtering and color settings
     */
    constructor(scope: A_Scope, config?: A_Config<A_LoggerEnvVariablesType> | undefined);
    /**
     * Generate a simple hash from a string
     * Used to create deterministic color selection based on scope name
     *
     * @param str - The string to hash
     * @returns A numeric hash value
     */
    protected simpleHash(str: string): number;
    /**
     * Generate a deterministic color based on scope name
     * Same scope names will always get the same color, but uses safe color palette
     *
     * @param scopeName - The scope name to generate color for
     * @returns A color key from the safe colors palette
     */
    protected generateColorFromScopeName(scopeName: string): keyof typeof A_LOGGER_COLOR_CODES;
    /**
     * Generate a pair of complementary colors based on scope name
     * Ensures visual harmony between scope and message colors while being deterministic
     *
     * @param scopeName - The scope name to base colors on
     * @returns Object with scopeColor and logColor that work well together
     */
    protected generateComplementaryColorsFromScope(scopeName: string): {
        scopeColor: keyof typeof A_LOGGER_COLOR_CODES;
        logColor: keyof typeof A_LOGGER_COLOR_CODES;
    };
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
    protected detectTerminalWidth(): number;
    /**
     * Wrap text to fit within terminal width while preserving formatting
     *
     * @param text - Text to wrap
     * @param scopePadding - The scope padding string for alignment
     * @param isFirstLine - Whether this is the first line (affects available width calculation)
     * @returns Array of wrapped lines with proper indentation
     */
    protected wrapText(text: string, scopePadding: string, isFirstLine?: boolean): string[];
    /**
     * Split a long word that doesn't fit on a single line
     *
     * @param word - Word to split
     * @param maxLength - Maximum length per chunk
     * @returns Array of word chunks
     */
    protected splitLongWord(word: string, maxLength: number): string[];
    /**
     * Get the formatted scope length for consistent message alignment
     * Uses a standard length to ensure all messages align properly regardless of scope name
     *
     * @returns The scope length to use for padding calculations
     */
    get scopeLength(): number;
    /**
     * Get the formatted scope name with proper padding, centered within the container
     * Ensures consistent width for all scope names in log output with centered alignment
     *
     * @returns Centered and padded scope name for consistent formatting
     */
    get formattedScope(): string;
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
    compile(messageColor: keyof typeof this.COLORS, ...args: any[]): Array<any>;
    /**
     * Format an object for display with proper JSON indentation and terminal width awareness
     *
     * @param obj - The object to format
     * @param shouldAddNewline - Whether to add a newline prefix
     * @param scopePadding - The padding string for consistent alignment
     * @returns Formatted object string or the object itself for browser environments
     */
    protected formatObject(obj: any, shouldAddNewline: boolean, scopePadding: string): any;
    /**
     * Wrap a long JSON string value while preserving readability
     *
     * @param value - The string value to wrap
     * @param maxWidth - Maximum width for the value
     * @returns Wrapped string value
     */
    protected wrapJsonStringValue(value: string, maxWidth: number): string;
    /**
     * Format a string for display with proper indentation and terminal width wrapping
     *
     * @param str - The string to format
     * @param shouldAddNewline - Whether to add a newline prefix
     * @param scopePadding - The padding string for consistent alignment
     * @returns Formatted string
     */
    protected formatString(str: string, shouldAddNewline: boolean, scopePadding: string): string;
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
    protected shouldLog(logMethod: 'debug' | 'info' | 'warning' | 'error'): boolean;
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
    /**
     * Legacy log method (kept for backward compatibility)
     * @deprecated Use info() method instead
     *
     * @param color - Optional color name from A_LoggerColorName enum or the first message argument
     * @param args - Additional arguments to log
     */
    log(color: A_LoggerColorName, ...args: any[]): void;
    log(...args: any[]): void;
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
    warning(...args: any[]): void;
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
    error(...args: any[]): void;
    /**
     * Legacy method for A_Error logging (kept for backward compatibility)
     *
     * @deprecated Use error() method instead which handles A_Error automatically
     * @param error - The A_Error instance to log
     */
    protected log_A_Error(error: A_Error): void;
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
    protected compile_A_Error(error: A_Error): string;
    /**
     * Format stack trace with proper terminal width wrapping and indentation
     *
     * @param stack - The stack trace string
     * @param baseIndent - Base indentation for continuation lines
     * @returns Array of formatted stack trace lines
     */
    protected formatStackTrace(stack: string, baseIndent: string): string[];
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
    protected compile_Error(error: Error): string;
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
    protected getTime(): string;
}

export { type A_LoggerLevel as A, A_LOGGER_ANSI as a, A_LOGGER_COLORS as b, A_LOGGER_COLOR_CODES as c, A_LOGGER_DEFAULT_LEVEL as d, A_LOGGER_DEFAULT_SCOPE_LENGTH as e, A_LOGGER_ENV_KEYS as f, A_LOGGER_ENV_VARIABLES as g, A_LOGGER_FEATURES as h, A_LOGGER_FORMAT as i, A_LOGGER_LEVELS as j, A_LOGGER_SAFE_RANDOM_COLORS as k, A_LOGGER_TERMINAL as l, A_LOGGER_TIME_FORMAT as m, A_Logger as n, type A_LoggerColorName as o, A_LoggerEnvVariables as p, A_LoggerEnvVariablesArray as q, type A_LoggerEnvVariablesType as r, type A_LoggerFeatureName as s, A_Config as t, A_CONSTANTS__CONFIG_ENV_VARIABLES as u, A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY as v, type A_TYPES__ConfigContainerConstructor as w, type A_TYPES__ConfigENVVariables as x, A_TYPES__ConfigFeature as y };
