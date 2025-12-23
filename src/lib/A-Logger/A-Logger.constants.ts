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
    // System colors (reserved for specific purposes)
    red: '31',          // Errors, critical issues
    yellow: '33',       // Warnings, caution messages
    green: '32',        // Success, completion messages
    
    // Safe palette for random selection (grey-blue-violet theme)
    blue: '34',         // Info, general messages
    cyan: '36',         // Headers, titles
    magenta: '35',      // Special highlighting
    gray: '90',         // Debug, less important info
    brightBlue: '94',   // Bright blue variant
    brightCyan: '96',   // Bright cyan variant
    brightMagenta: '95', // Bright magenta variant
    darkGray: '30',     // Dark gray
    lightGray: '37',    // Light gray (white)
    
    // Extended blue-violet palette
    indigo: '38;5;54',      // Deep indigo
    violet: '38;5;93',      // Violet
    purple: '38;5;129',     // Purple
    lavender: '38;5;183',   // Lavender
    skyBlue: '38;5;117',    // Sky blue
    steelBlue: '38;5;67',   // Steel blue
    slateBlue: '38;5;62',   // Slate blue
    deepBlue: '38;5;18',    // Deep blue
    lightBlue: '38;5;153',  // Light blue
    periwinkle: '38;5;111', // Periwinkle
    cornflower: '38;5;69',  // Cornflower blue
    powder: '38;5;152',     // Powder blue
    
    // Additional grays for variety
    charcoal: '38;5;236',   // Charcoal
    silver: '38;5;250',     // Silver
    smoke: '38;5;244',      // Smoke gray
    slate: '38;5;240',      // Slate gray
} as const;

/**
 * Safe colors for random selection - grey-blue-violet palette
 * Excludes system colors (red, yellow, green) to avoid confusion with warnings/errors
 */
export const A_LOGGER_SAFE_RANDOM_COLORS = [
    'blue', 'cyan', 'magenta', 'gray', 'brightBlue', 'brightCyan', 'brightMagenta',
    'darkGray', 'lightGray', 'indigo', 'violet', 'purple', 'lavender', 'skyBlue',
    'steelBlue', 'slateBlue', 'deepBlue', 'lightBlue', 'periwinkle', 'cornflower',
    'powder', 'charcoal', 'silver', 'smoke', 'slate'
] as const;

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
/**
 * Terminal width configuration
 */
export const A_LOGGER_TERMINAL = {
    DEFAULT_WIDTH: 80,        // Default terminal width when can't be detected
    MIN_WIDTH: 40,           // Minimum width for formatted output
    MAX_LINE_LENGTH_RATIO: 0.8, // Use 80% of terminal width for content
    BROWSER_DEFAULT_WIDTH: 120  // Default width for browser console
} as const;

/**
 * Environment variable keys
 */
export const A_LOGGER_ENV_KEYS = {
    LOG_LEVEL: 'A_LOGGER_LEVEL',
    DEFAULT_SCOPE_LENGTH: 'A_LOGGER_DEFAULT_SCOPE_LENGTH',
    DEFAULT_SCOPE_COLOR: 'A_LOGGER_DEFAULT_SCOPE_COLOR',
    DEFAULT_LOG_COLOR: 'A_LOGGER_DEFAULT_LOG_COLOR'
} as const;