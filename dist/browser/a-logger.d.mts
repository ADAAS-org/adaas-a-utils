export { A as A_Logger, a as A_LoggerColorName, b as A_LoggerEnvVariables, c as A_LoggerEnvVariablesArray, d as A_LoggerEnvVariablesType, e as A_LoggerLevel } from './A-Logger.component-Be-LMV3I.mjs';
import '@adaas/a-concept';
import './a-execution.mjs';

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
declare const A_LOGGER_COLORS: {
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

export { A_LOGGER_ANSI, A_LOGGER_COLORS, A_LOGGER_DEFAULT_LEVEL, A_LOGGER_DEFAULT_SCOPE_LENGTH, A_LOGGER_ENV_KEYS, A_LOGGER_FORMAT, A_LOGGER_SAFE_RANDOM_COLORS, A_LOGGER_TERMINAL, A_LOGGER_TIME_FORMAT };
