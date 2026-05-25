import '../../chunk-EQQGB2QZ.mjs';

const A_LOGGER_DEFAULT_SCOPE_LENGTH = 20;
const A_LOGGER_DEFAULT_LEVEL = "all";
const A_LOGGER_COLOR_CODES = {
  // System colors (reserved for specific purposes)
  red: "31",
  // Errors, critical issues
  yellow: "33",
  // Warnings, caution messages
  green: "32",
  // Success, completion messages
  // Safe palette for random selection (grey-blue-violet theme)
  blue: "34",
  // Info, general messages
  cyan: "36",
  // Headers, titles
  magenta: "35",
  // Special highlighting
  gray: "90",
  // Debug, less important info
  brightBlue: "94",
  // Bright blue variant
  brightCyan: "96",
  // Bright cyan variant
  brightMagenta: "95",
  // Bright magenta variant
  darkGray: "30",
  // Dark gray
  lightGray: "37",
  // Light gray (white)
  // Extended blue-violet palette
  indigo: "38;5;54",
  // Deep indigo
  violet: "38;5;93",
  // Violet
  purple: "38;5;129",
  // Purple
  lavender: "38;5;183",
  // Lavender
  skyBlue: "38;5;117",
  // Sky blue
  steelBlue: "38;5;67",
  // Steel blue
  slateBlue: "38;5;62",
  // Slate blue
  deepBlue: "38;5;18",
  // Deep blue
  lightBlue: "38;5;153",
  // Light blue
  periwinkle: "38;5;111",
  // Periwinkle
  cornflower: "38;5;69",
  // Cornflower blue
  powder: "38;5;152",
  // Powder blue
  // Additional grays for variety
  charcoal: "38;5;236",
  // Charcoal
  silver: "38;5;250",
  // Silver
  smoke: "38;5;244",
  // Smoke gray
  slate: "38;5;240"
  // Slate gray
};
const A_LOGGER_COLORS = {
  red: "red",
  yellow: "yellow",
  green: "green",
  blue: "blue",
  cyan: "cyan",
  magenta: "magenta",
  gray: "gray",
  brightBlue: "brightBlue",
  brightCyan: "brightCyan",
  brightMagenta: "brightMagenta",
  darkGray: "darkGray",
  lightGray: "lightGray",
  indigo: "indigo",
  violet: "violet",
  purple: "purple",
  lavender: "lavender",
  skyBlue: "skyBlue",
  steelBlue: "steelBlue",
  slateBlue: "slateBlue",
  deepBlue: "deepBlue",
  lightBlue: "lightBlue",
  periwinkle: "periwinkle",
  cornflower: "cornflower",
  powder: "powder",
  charcoal: "charcoal",
  silver: "silver",
  smoke: "smoke",
  slate: "slate"
};
const A_LOGGER_SAFE_RANDOM_COLORS = [
  "blue",
  "cyan",
  "magenta",
  "gray",
  "brightBlue",
  "brightCyan",
  "brightMagenta",
  "darkGray",
  "lightGray",
  "indigo",
  "violet",
  "purple",
  "lavender",
  "skyBlue",
  "steelBlue",
  "slateBlue",
  "deepBlue",
  "lightBlue",
  "periwinkle",
  "cornflower",
  "powder",
  "charcoal",
  "silver",
  "smoke",
  "slate"
];
const A_LOGGER_ANSI = {
  RESET: "\x1B[0m",
  PREFIX: "\x1B[",
  SUFFIX: "m"
};
const A_LOGGER_TIME_FORMAT = {
  MINUTES_PAD: 2,
  SECONDS_PAD: 2,
  MILLISECONDS_PAD: 3,
  SEPARATOR: ":"
};
const A_LOGGER_FORMAT = {
  SCOPE_OPEN: "[",
  SCOPE_CLOSE: "]",
  TIME_OPEN: "|",
  TIME_CLOSE: "|",
  SEPARATOR: "-------------------------------",
  INDENT_BASE: 3,
  PIPE: "| "
};
const A_LOGGER_TERMINAL = {
  DEFAULT_WIDTH: 80,
  // Default terminal width when can't be detected
  MIN_WIDTH: 40,
  // Minimum width for formatted output
  MAX_LINE_LENGTH_RATIO: 0.8,
  // Use 80% of terminal width for content
  BROWSER_DEFAULT_WIDTH: 120
  // Default width for browser console
};
const A_LOGGER_ENV_KEYS = {
  LOG_LEVEL: "A_LOGGER_LEVEL",
  DEFAULT_SCOPE_LENGTH: "A_LOGGER_DEFAULT_SCOPE_LENGTH",
  DEFAULT_SCOPE_COLOR: "A_LOGGER_DEFAULT_SCOPE_COLOR",
  DEFAULT_LOG_COLOR: "A_LOGGER_DEFAULT_LOG_COLOR"
};
const A_LOGGER_LEVELS = {
  debug: "debug",
  info: "info",
  log: "log",
  warning: "warning",
  error: "error",
  all: "all"
};
const A_LOGGER_FEATURES = {
  onLog: "A_Logger_onLog"
};
const A_LOGGER_ENV_VARIABLES = {
  /**
   * Sets the log level for the logger
   * 
   * @example 'debug', 'info', 'warn', 'error'
   */
  A_LOGGER_LEVEL: "A_LOGGER_LEVEL",
  /**     
   * Sets the default scope length for log messages
   * 
   * @example 'A_LOGGER_DEFAULT_SCOPE_LENGTH'
   */
  A_LOGGER_DEFAULT_SCOPE_LENGTH: "A_LOGGER_DEFAULT_SCOPE_LENGTH",
  /**
   * Sets the default color for scope display in log messages
   * 
   * @example 'green', 'blue', 'red', 'yellow', 'gray', 'magenta', 'cyan', 'white', 'pink'
   */
  A_LOGGER_DEFAULT_SCOPE_COLOR: "A_LOGGER_DEFAULT_SCOPE_COLOR",
  /**
   * Sets the default color for log message content
   * 
   * @example 'green', 'blue', 'red', 'yellow', 'gray', 'magenta', 'cyan', 'white', 'pink'
   */
  A_LOGGER_DEFAULT_LOG_COLOR: "A_LOGGER_DEFAULT_LOG_COLOR"
};

export { A_LOGGER_ANSI, A_LOGGER_COLORS, A_LOGGER_COLOR_CODES, A_LOGGER_DEFAULT_LEVEL, A_LOGGER_DEFAULT_SCOPE_LENGTH, A_LOGGER_ENV_KEYS, A_LOGGER_ENV_VARIABLES, A_LOGGER_FEATURES, A_LOGGER_FORMAT, A_LOGGER_LEVELS, A_LOGGER_SAFE_RANDOM_COLORS, A_LOGGER_TERMINAL, A_LOGGER_TIME_FORMAT };
//# sourceMappingURL=A-Logger.constants.mjs.map
//# sourceMappingURL=A-Logger.constants.mjs.map