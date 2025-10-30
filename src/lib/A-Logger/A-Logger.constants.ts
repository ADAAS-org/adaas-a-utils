/**
 * A-Logger Constants
 * 
 * Configuration constants and default values for the A_Logger component
 */

/**
 * Default scope length for consistent message alignment
 */
export const A_LOGGER_DEFAULT_SCOPE_LENGTH = 20;

/**
 * Default log level when none is specified
 */
export const A_LOGGER_DEFAULT_LEVEL = 'all';

/**
 * Terminal color codes mapping
 */
export const A_LOGGER_COLORS = {
    green: '32',    // Success, completion messages
    blue: '34',     // Info, general messages  
    red: '31',      // Errors, critical issues
    yellow: '33',   // Warnings, caution messages
    gray: '90',     // Debug, less important info
    magenta: '35',  // Special highlighting
    cyan: '36',     // Headers, titles
    white: '37',    // Default text
    pink: '95',     // Custom highlighting
} as const;

/**
 * ANSI escape codes
 */
export const A_LOGGER_ANSI = {
    RESET: '\x1b[0m',
    PREFIX: '\x1b[',
    SUFFIX: 'm'
} as const;

/**
 * Timestamp format configuration
 */
export const A_LOGGER_TIME_FORMAT = {
    MINUTES_PAD: 2,
    SECONDS_PAD: 2,
    MILLISECONDS_PAD: 3,
    SEPARATOR: ':'
} as const;

/**
 * Log message structure constants
 */
export const A_LOGGER_FORMAT = {
    SCOPE_OPEN: '[',
    SCOPE_CLOSE: ']',
    TIME_OPEN: '|',
    TIME_CLOSE: '|',
    SEPARATOR: '-------------------------------',
    INDENT_BASE: 3,
    PIPE: '| '
} as const;

/**
 * Environment variable keys
 */
export const A_LOGGER_ENV_KEYS = {
    LOG_LEVEL: 'A_LOGGER_LEVEL'
} as const;