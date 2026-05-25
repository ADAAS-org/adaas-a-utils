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

export { A_LOGGER_ANSI, A_LOGGER_COLORS, A_LOGGER_COLOR_CODES, A_LOGGER_DEFAULT_LEVEL, A_LOGGER_DEFAULT_SCOPE_LENGTH, A_LOGGER_ENV_KEYS, A_LOGGER_ENV_VARIABLES, A_LOGGER_FEATURES, A_LOGGER_FORMAT, A_LOGGER_LEVELS, A_LOGGER_SAFE_RANDOM_COLORS, A_LOGGER_TERMINAL, A_LOGGER_TIME_FORMAT };
