import { A_Config } from './chunk-SJU7LRGF.mjs';
import { __decorateClass, __decorateParam } from './chunk-EQQGB2QZ.mjs';
import { A_Inject, A_Scope, A_Component, A_Feature, A_Context, A_Error, A_Fragment } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';

// src/lib/A-Logger/A-Logger.constants.ts
var A_LOGGER_DEFAULT_SCOPE_LENGTH = 20;
var A_LOGGER_DEFAULT_LEVEL = "all";
var A_LOGGER_COLOR_CODES = {
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
var A_LOGGER_COLORS = {
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
var A_LOGGER_SAFE_RANDOM_COLORS = [
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
var A_LOGGER_ANSI = {
  RESET: "\x1B[0m",
  PREFIX: "\x1B[",
  SUFFIX: "m"
};
var A_LOGGER_TIME_FORMAT = {
  MINUTES_PAD: 2,
  SECONDS_PAD: 2,
  MILLISECONDS_PAD: 3,
  SEPARATOR: ":"
};
var A_LOGGER_FORMAT = {
  SCOPE_OPEN: "[",
  SCOPE_CLOSE: "]",
  TIME_OPEN: "|",
  TIME_CLOSE: "|",
  SEPARATOR: "-------------------------------",
  INDENT_BASE: 3,
  PIPE: "| "
};
var A_LOGGER_TERMINAL = {
  DEFAULT_WIDTH: 80,
  // Default terminal width when can't be detected
  MIN_WIDTH: 40,
  // Minimum width for formatted output
  MAX_LINE_LENGTH_RATIO: 0.8,
  // Use 80% of terminal width for content
  BROWSER_DEFAULT_WIDTH: 120
  // Default width for browser console
};
var A_LOGGER_ENV_KEYS = {
  LOG_LEVEL: "A_LOGGER_LEVEL",
  DEFAULT_SCOPE_LENGTH: "A_LOGGER_DEFAULT_SCOPE_LENGTH",
  DEFAULT_SCOPE_COLOR: "A_LOGGER_DEFAULT_SCOPE_COLOR",
  DEFAULT_LOG_COLOR: "A_LOGGER_DEFAULT_LOG_COLOR"
};
var A_LOGGER_LEVELS = {
  debug: "debug",
  info: "info",
  log: "log",
  warning: "warning",
  error: "error",
  all: "all"
};
var A_LOGGER_FEATURES = {
  onLog: "A_Logger_onLog"
};
var A_LOGGER_ENV_VARIABLES = {
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
var A_LoggerLogContext = class extends A_Fragment {
  constructor(level, ...args) {
    super();
    this.level = level;
    this.args = args;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      level: this.level,
      args: this.args
    };
  }
};

// src/lib/A-Logger/A-Logger.component.ts
var A_Logger = class extends A_Component {
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
  constructor(scope, config) {
    super();
    this.scope = scope;
    this.config = config;
    this.COLORS = A_LOGGER_COLOR_CODES;
    this.STANDARD_SCOPE_LENGTH = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_SCOPE_LENGTH) || A_LOGGER_DEFAULT_SCOPE_LENGTH;
    const configScopeColor = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_SCOPE_COLOR);
    const configLogColor = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_LOG_COLOR);
    if (configScopeColor || configLogColor) {
      this.DEFAULT_SCOPE_COLOR = configScopeColor || this.generateColorFromScopeName(this.scope.name);
      this.DEFAULT_LOG_COLOR = configLogColor || this.generateColorFromScopeName(this.scope.name);
    } else {
      const complementaryColors = this.generateComplementaryColorsFromScope(this.scope.name);
      this.DEFAULT_SCOPE_COLOR = complementaryColors.scopeColor;
      this.DEFAULT_LOG_COLOR = complementaryColors.logColor;
    }
    this.TERMINAL_WIDTH = this.detectTerminalWidth();
    this.MAX_CONTENT_WIDTH = Math.floor(this.TERMINAL_WIDTH * A_LOGGER_TERMINAL.MAX_LINE_LENGTH_RATIO);
  }
  static get onLog() {
    return (target, propertyKey, descriptor) => {
      return A_Feature.Extend({
        name: A_LOGGER_FEATURES.onLog,
        scope: [A_Logger]
      })(target, propertyKey, descriptor);
    };
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
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
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
  generateColorFromScopeName(scopeName) {
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
  generateComplementaryColorsFromScope(scopeName) {
    const colorPairs = [
      { scopeColor: "indigo", logColor: "lightBlue" },
      { scopeColor: "deepBlue", logColor: "cyan" },
      { scopeColor: "purple", logColor: "lavender" },
      { scopeColor: "steelBlue", logColor: "skyBlue" },
      { scopeColor: "slateBlue", logColor: "periwinkle" },
      { scopeColor: "charcoal", logColor: "silver" },
      { scopeColor: "violet", logColor: "brightMagenta" },
      { scopeColor: "darkGray", logColor: "lightGray" },
      { scopeColor: "cornflower", logColor: "powder" },
      { scopeColor: "slate", logColor: "smoke" }
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
  detectTerminalWidth() {
    try {
      if (A_Context.environment === "browser") {
        return A_LOGGER_TERMINAL.BROWSER_DEFAULT_WIDTH;
      }
      if (typeof process !== "undefined" && process.stdout && process.stdout.columns) {
        const cols = process.stdout.columns;
        return Math.max(cols, A_LOGGER_TERMINAL.MIN_WIDTH);
      }
      return A_LOGGER_TERMINAL.DEFAULT_WIDTH;
    } catch (error) {
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
  wrapText(text, scopePadding, isFirstLine = true) {
    if (A_Context.environment === "browser") {
      return [text];
    }
    const scopeHeaderLength = this.formattedScope.length + 4 + this.getTime().length + 4;
    const continuationIndent = `${scopePadding}${A_LOGGER_FORMAT.PIPE}`;
    const firstLineMaxWidth = Math.max(this.TERMINAL_WIDTH - scopeHeaderLength - 1, 20);
    const continuationMaxWidth = Math.max(this.TERMINAL_WIDTH - continuationIndent.length, 20);
    if (isFirstLine && text.length <= firstLineMaxWidth) {
      return [text];
    }
    const lines = [];
    const words = text.split(" ");
    let currentLine = "";
    let currentMaxWidth = isFirstLine ? firstLineMaxWidth : continuationMaxWidth;
    for (const word of words) {
      const spaceNeeded = currentLine ? 1 : 0;
      const totalLength = currentLine.length + spaceNeeded + word.length;
      if (totalLength > currentMaxWidth) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
          currentMaxWidth = continuationMaxWidth;
        } else {
          if (word.length > currentMaxWidth) {
            const chunks = this.splitLongWord(word, currentMaxWidth);
            lines.push(...chunks.slice(0, -1));
            currentLine = chunks[chunks.length - 1];
          } else {
            currentLine = word;
          }
          currentMaxWidth = continuationMaxWidth;
        }
      } else {
        currentLine += (currentLine ? " " : "") + word;
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
  splitLongWord(word, maxLength) {
    const chunks = [];
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
  get scopeLength() {
    return Math.max(this.scope.name.length, this.STANDARD_SCOPE_LENGTH);
  }
  /**
   * Get the formatted scope name with proper padding, centered within the container
   * Ensures consistent width for all scope names in log output with centered alignment
   * 
   * @returns Centered and padded scope name for consistent formatting
   */
  get formattedScope() {
    const scopeName = this.scope.name;
    const totalLength = this.STANDARD_SCOPE_LENGTH;
    if (scopeName.length >= totalLength) {
      return scopeName.substring(0, totalLength);
    }
    const totalPadding = totalLength - scopeName.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    return " ".repeat(leftPadding) + scopeName + " ".repeat(rightPadding);
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
  compile(messageColor, ...args) {
    const timeString = this.getTime();
    const scopePadding = " ".repeat(this.STANDARD_SCOPE_LENGTH + 3);
    const isMultiArg = args.length > 1;
    return [
      // Header with separate colors for scope and message content
      `${A_LOGGER_ANSI.PREFIX}${this.COLORS[this.DEFAULT_SCOPE_COLOR]}${A_LOGGER_ANSI.SUFFIX}${A_LOGGER_FORMAT.SCOPE_OPEN}${this.formattedScope}${A_LOGGER_FORMAT.SCOPE_CLOSE}${A_LOGGER_ANSI.RESET} ${A_LOGGER_ANSI.PREFIX}${this.COLORS[messageColor]}${A_LOGGER_ANSI.SUFFIX}${A_LOGGER_FORMAT.TIME_OPEN}${timeString}${A_LOGGER_FORMAT.TIME_CLOSE}`,
      // Top separator for multi-argument messages
      isMultiArg ? `
${scopePadding}${A_LOGGER_FORMAT.TIME_OPEN}${A_LOGGER_FORMAT.SEPARATOR}` : "",
      // Process each argument with appropriate formatting
      ...args.map((arg, i) => {
        const shouldAddNewline = i > 0 || isMultiArg;
        switch (true) {
          case arg instanceof A_Error:
            return this.compile_A_Error(arg);
          case arg instanceof Error:
            return this.compile_Error(arg);
          case (typeof arg === "object" && arg !== null):
            return this.formatObject(arg, shouldAddNewline, scopePadding);
          default:
            return this.formatString(String(arg), shouldAddNewline, scopePadding);
        }
      }),
      // Bottom separator and color reset
      isMultiArg ? `
${scopePadding}${A_LOGGER_FORMAT.TIME_OPEN}${A_LOGGER_FORMAT.SEPARATOR}${A_LOGGER_ANSI.RESET}` : A_LOGGER_ANSI.RESET
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
  formatObject(obj, shouldAddNewline, scopePadding) {
    if (A_Context.environment === "browser") {
      return obj;
    }
    if (obj === null) {
      return shouldAddNewline ? `
${scopePadding}${A_LOGGER_FORMAT.PIPE}null` : "null";
    }
    if (obj === void 0) {
      return shouldAddNewline ? `
${scopePadding}${A_LOGGER_FORMAT.PIPE}undefined` : "undefined";
    }
    let jsonString;
    try {
      jsonString = JSON.stringify(obj, null, 2);
    } catch (error) {
      try {
        const seen = /* @__PURE__ */ new WeakSet();
        jsonString = JSON.stringify(obj, (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return "[Circular Reference]";
            }
            seen.add(value);
          }
          return value;
        }, 2);
      } catch (fallbackError) {
        jsonString = String(obj);
      }
    }
    const continuationIndent = `${scopePadding}${A_LOGGER_FORMAT.PIPE}`;
    const maxJsonLineWidth = this.TERMINAL_WIDTH - continuationIndent.length - 4;
    const lines = jsonString.split("\n").map((line) => {
      const stringValueMatch = line.match(/^(\s*"[^"]+":\s*")([^"]+)(".*)?$/);
      if (stringValueMatch && stringValueMatch[2].length > maxJsonLineWidth - stringValueMatch[1].length - (stringValueMatch[3] || "").length) {
        const [, prefix, value, suffix = ""] = stringValueMatch;
        if (value.length > maxJsonLineWidth - prefix.length - suffix.length) {
          const wrappedValue = this.wrapJsonStringValue(value, maxJsonLineWidth - prefix.length - suffix.length);
          return prefix + wrappedValue + suffix;
        }
      }
      return line;
    });
    const formatted = lines.join("\n" + continuationIndent);
    return shouldAddNewline ? "\n" + continuationIndent + formatted : formatted;
  }
  /**
   * Wrap a long JSON string value while preserving readability
   * 
   * @param value - The string value to wrap
   * @param maxWidth - Maximum width for the value
   * @returns Wrapped string value
   */
  wrapJsonStringValue(value, maxWidth) {
    if (value.length <= maxWidth) {
      return value;
    }
    if (maxWidth > 6) {
      return value.substring(0, maxWidth - 3) + "...";
    } else {
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
  formatString(str, shouldAddNewline, scopePadding) {
    if (A_Context.environment === "browser") {
      const prefix = shouldAddNewline ? "\n" : "";
      return (prefix + str).replace(/\n/g, `
${scopePadding}${A_LOGGER_FORMAT.PIPE}`);
    }
    const wrappedLines = this.wrapText(str, scopePadding, !shouldAddNewline);
    const continuationIndent = `${scopePadding}${A_LOGGER_FORMAT.PIPE}`;
    const formattedLines = wrappedLines.map((line, index) => {
      if (index === 0 && !shouldAddNewline) {
        return line;
      } else {
        return `${continuationIndent}${line}`;
      }
    });
    if (shouldAddNewline) {
      return "\n" + formattedLines.join("\n");
    } else {
      return formattedLines.join("\n");
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
  shouldLog(logMethod) {
    const shouldLog = this.config?.get(A_LOGGER_ENV_KEYS.LOG_LEVEL) || "info";
    switch (shouldLog) {
      case "debug":
        return true;
      case "info":
        return logMethod === "info" || logMethod === "warning" || logMethod === "error";
      case "warn":
        return logMethod === "warning" || logMethod === "error";
      case "error":
        return logMethod === "error";
      case "all":
        return true;
      default:
        return false;
    }
  }
  debug(param1, ...args) {
    if (!this.shouldLog("debug")) return;
    const callScope = new A_Scope({
      name: this.scope.name + ":debug",
      fragments: [new A_LoggerLogContext("debug", ...args)]
    }).inherit(this.scope);
    let compiled = [];
    if (typeof param1 === "string" && this.COLORS[param1]) {
      compiled = this.compile(param1, ...args);
    } else {
      compiled = this.compile(this.DEFAULT_LOG_COLOR, param1, ...args);
    }
    try {
      console.log(...compiled);
      this.call(A_LOGGER_FEATURES.onLog, callScope);
    } finally {
      callScope.destroy();
    }
  }
  info(param1, ...args) {
    if (!this.shouldLog("info")) return;
    const callScope = new A_Scope({
      name: this.scope.name + ":info",
      fragments: [new A_LoggerLogContext("info", ...args)]
    }).inherit(this.scope);
    let compiled = [];
    if (typeof param1 === "string" && this.COLORS[param1]) {
      compiled = this.compile(param1, ...args);
    } else {
      compiled = this.compile(this.DEFAULT_LOG_COLOR, param1, ...args);
    }
    try {
      console.log(...compiled);
      this.call(A_LOGGER_FEATURES.onLog, callScope);
    } finally {
      callScope.destroy();
    }
  }
  log(param1, ...args) {
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
  warning(...args) {
    if (!this.shouldLog("warning")) return;
    const callScope = new A_Scope({
      name: this.scope.name + ":warning",
      fragments: [new A_LoggerLogContext("warning", ...args)]
    }).inherit(this.scope);
    let compiled = this.compile("yellow", ...args);
    try {
      console.log(...compiled);
      this.call(A_LOGGER_FEATURES.onLog, callScope);
    } finally {
      callScope.destroy();
    }
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
  error(...args) {
    if (!this.shouldLog("error")) return;
    const callScope = new A_Scope({
      name: this.scope.name + ":error",
      fragments: [new A_LoggerLogContext("error", ...args)]
    }).inherit(this.scope);
    let compiled = this.compile("red", ...args);
    try {
      console.log(...compiled);
      this.call(A_LOGGER_FEATURES.onLog, callScope);
    } finally {
      callScope.destroy();
    }
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
  log_A_Error(error) {
    const time = this.getTime();
    const scopePadding = " ".repeat(this.STANDARD_SCOPE_LENGTH + 3);
    console.log(`\x1B[31m[${this.formattedScope}] |${time}| ERROR ${error.code}
${scopePadding}| ${error.message}
${scopePadding}| ${error.description} 
${scopePadding}|-------------------------------
${scopePadding}| ${error.stack?.split("\n").map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join("\n") || "No stack trace"}
${scopePadding}|-------------------------------
\x1B[0m` + (error.originalError ? `\x1B[31m${scopePadding}| Wrapped From  ${error.originalError.message}
${scopePadding}|-------------------------------
${scopePadding}| ${error.originalError.stack?.split("\n").map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join("\n") || "No stack trace"}
${scopePadding}|-------------------------------
\x1B[0m` : "") + (error.link ? `\x1B[31m${scopePadding}| Read in docs: ${error.link}
${scopePadding}|-------------------------------
\x1B[0m` : ""));
  }
  /**
   * Format A_Error instances for inline display within compiled messages.
   *
   * Aligned with the structured error-handling strategy:
   *  - Walks the FULL causal chain via `error.chain` so wrapper layers
   *    (A_FeatureError → A_StageError → user error) are all visible.
   *  - Surfaces structured A_FeatureError context (featureName, stageName,
   *    handler, component) when present.
   *  - Prints the outermost A_Error stack ONCE — it already includes a
   *    `Caused by: ...` chain appended by `A_Error.appendCausedByStack()`,
   *    so repeating per-link stacks would duplicate information.
   *  - Shows documentation link only for the outermost error.
   *
   * Visual style mirrors the legacy `log_A_Error`:
   *  - Whole block wrapped in red ANSI; section headers in bold red.
   *  - File:line:col in stack traces highlighted cyan/yellow so they're
   *    easy to spot and stay clickable in VS Code terminal.
   *  - Documentation link underlined in cyan.
   *
   * @param error - The A_Error instance to format
   * @returns Formatted string ready for display
   */
  compile_A_Error(error) {
    const RED = `${A_LOGGER_ANSI.PREFIX}31${A_LOGGER_ANSI.SUFFIX}`;
    const RED_BOLD = `${A_LOGGER_ANSI.PREFIX}1;31${A_LOGGER_ANSI.SUFFIX}`;
    const CYAN = `${A_LOGGER_ANSI.PREFIX}36${A_LOGGER_ANSI.SUFFIX}`;
    const CYAN_UNDERLINE = `${A_LOGGER_ANSI.PREFIX}4;36${A_LOGGER_ANSI.SUFFIX}`;
    const YELLOW = `${A_LOGGER_ANSI.PREFIX}33${A_LOGGER_ANSI.SUFFIX}`;
    const DIM = `${A_LOGGER_ANSI.PREFIX}2${A_LOGGER_ANSI.SUFFIX}`;
    const RESET = A_LOGGER_ANSI.RESET;
    const scopePadding = " ".repeat(this.STANDARD_SCOPE_LENGTH + 3);
    const continuationIndent = `${scopePadding}${A_LOGGER_FORMAT.PIPE}`;
    const separator = `${RED}${continuationIndent}${A_LOGGER_FORMAT.SEPARATOR}${RESET}`;
    const lines = [];
    const pushRow = (text, color = RED) => {
      const wrapped = this.wrapText(text, continuationIndent, false);
      for (const line of wrapped) {
        lines.push(`${color}${continuationIndent}${line}${RESET}`);
      }
    };
    const pushSection = (title) => {
      lines.push(separator);
      lines.push(`${RED_BOLD}${continuationIndent}${title}${RESET}`);
      lines.push(separator);
    };
    lines.push("");
    pushSection(`A_ERROR: ${error.code}`);
    pushRow(`Title       : ${error.title}`);
    pushRow(`Message     : ${error.message}`);
    pushRow(`Description : ${error.description}`);
    this.appendFeatureContext(error, pushRow);
    const chain = error.chain;
    if (chain.length > 1) {
      pushSection("CAUSED BY:");
      for (let i = 1; i < chain.length; i++) {
        const link = chain[i];
        if (i > 1) lines.push(`${RED}${continuationIndent}${RESET}`);
        if (link instanceof A_Error) {
          pushRow(`[${i}] ${link.constructor.name} (${link.code})`, RED_BOLD);
          pushRow(`    Title   : ${link.title}`);
          pushRow(`    Message : ${link.message}`);
          if (link.description && link.description !== link.message) {
            pushRow(`    Desc    : ${link.description}`);
          }
          this.appendFeatureContext(link, pushRow, "    ");
        } else if (link instanceof Error) {
          pushRow(`[${i}] ${link.name}: ${link.message}`, RED_BOLD);
        } else {
          pushRow(`[${i}] ${String(link)}`);
        }
      }
    }
    if (error.stack) {
      pushSection("STACK TRACE:");
      const stackLines = this.formatStackTrace(error.stack, continuationIndent);
      for (const line of stackLines) {
        lines.push(this.colorizeStackLine(line, { RED, RED_BOLD, CYAN, YELLOW, DIM, RESET }));
      }
    }
    if (error.link) {
      lines.push(separator);
      lines.push(`${RED}${continuationIndent}Docs: ${CYAN_UNDERLINE}${error.link}${RESET}`);
    }
    lines.push(separator);
    return lines.join("\n");
  }
  /**
   * Append structured A_FeatureError context (featureName, stageName,
   * handler, component) when the link has those fields.  Silently no-ops
   * for plain A_Error or any other subclass that doesn't expose them.
   */
  appendFeatureContext(error, pushRow, prefix = "") {
    const e = error;
    const hasContext = e.featureName || e.stageName || e.handler || e.component;
    if (!hasContext) return;
    if (e.featureName) pushRow(`${prefix}Feature   : ${e.featureName}`);
    if (e.stageName) pushRow(`${prefix}Stage     : ${e.stageName}`);
    if (e.component) pushRow(`${prefix}Component : ${e.component}`);
    if (e.handler) pushRow(`${prefix}Handler   : ${e.handler}`);
  }
  /**
   * Colorize one stack-trace line:
   *  - "Caused by:" header lines in bold red (preserves the chain visual).
   *  - File locations (path:line:col) in cyan/yellow so they pop out and
   *    stay clickable in VS Code's terminal.
   *  - Everything else in red.
   *
   * The input line is the already-padded/wrapped output of
   * `formatStackTrace` (starts with the scope padding + PIPE).
   */
  colorizeStackLine(line, c) {
    const locRegex = /(\(?)([^()\s:]+\.(?:ts|tsx|js|jsx|mjs|cjs)):(\d+):(\d+)(\)?)/g;
    const colorized = line.replace(
      locRegex,
      (_, openP, file, ln, col, closeP) => `${openP}${c.CYAN}${file}${c.RESET}${c.RED}:${c.YELLOW}${ln}${c.RED}:${c.YELLOW}${col}${c.RED}${closeP}`
    );
    const baseColor = /caused by:/i.test(line) ? c.RED_BOLD : c.RED;
    return `${baseColor}${colorized}${c.RESET}`;
  }
  /**
   * Format stack trace with proper terminal width wrapping and indentation
   * 
   * @param stack - The stack trace string
   * @param baseIndent - Base indentation for continuation lines
   * @returns Array of formatted stack trace lines
   */
  formatStackTrace(stack, baseIndent) {
    const stackLines = stack.split("\n");
    const formatted = [];
    stackLines.forEach((line, index) => {
      if (line.trim()) {
        const stackIndent = index === 0 ? baseIndent : `${baseIndent}  `;
        const wrappedLines = this.wrapText(line.trim(), stackIndent, false);
        formatted.push(...wrappedLines.map(
          (wrappedLine) => index === 0 && wrappedLine === wrappedLines[0] ? `${baseIndent}${wrappedLine}` : `${baseIndent}  ${wrappedLine}`
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
  compile_Error(error) {
    const continuationIndent = `${" ".repeat(this.STANDARD_SCOPE_LENGTH + 3)}${A_LOGGER_FORMAT.PIPE}`;
    const separator = `${continuationIndent}-------------------------------`;
    const lines = [];
    lines.push("");
    lines.push(separator);
    lines.push(`${continuationIndent}ERROR: ${error.name}`);
    lines.push(separator);
    const errorMessage = this.wrapText(`Message: ${error.message}`, continuationIndent, false);
    lines.push(...errorMessage.map((line) => `${continuationIndent}${line}`));
    if (error.stack) {
      lines.push(separator);
      lines.push(`${continuationIndent}STACK TRACE:`);
      lines.push(separator);
      const stackLines = this.formatStackTrace(error.stack, continuationIndent);
      lines.push(...stackLines);
    }
    lines.push(separator);
    return lines.join("\n");
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
  getTime() {
    const now = /* @__PURE__ */ new Date();
    const minutes = String(now.getMinutes()).padStart(A_LOGGER_TIME_FORMAT.MINUTES_PAD, "0");
    const seconds = String(now.getSeconds()).padStart(A_LOGGER_TIME_FORMAT.SECONDS_PAD, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(A_LOGGER_TIME_FORMAT.MILLISECONDS_PAD, "0");
    return `${minutes}${A_LOGGER_TIME_FORMAT.SEPARATOR}${seconds}${A_LOGGER_TIME_FORMAT.SEPARATOR}${milliseconds}`;
  }
};
A_Logger = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Advanced Logging Component with Scope-based Output Formatting that provides color-coded console output, multi-type support, and configurable log levels for enhanced debugging and monitoring."
  }),
  __decorateParam(0, A_Inject(A_Scope)),
  __decorateParam(1, A_Inject(A_Config))
], A_Logger);

// src/lib/A-Logger/A-Logger.env.ts
var A_LoggerEnvVariables = {
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
var A_LoggerEnvVariablesArray = [
  A_LoggerEnvVariables.A_LOGGER_LEVEL,
  A_LoggerEnvVariables.A_LOGGER_DEFAULT_SCOPE_LENGTH,
  A_LoggerEnvVariables.A_LOGGER_DEFAULT_SCOPE_COLOR,
  A_LoggerEnvVariables.A_LOGGER_DEFAULT_LOG_COLOR
];

export { A_LOGGER_ANSI, A_LOGGER_COLORS, A_LOGGER_COLOR_CODES, A_LOGGER_DEFAULT_LEVEL, A_LOGGER_DEFAULT_SCOPE_LENGTH, A_LOGGER_ENV_KEYS, A_LOGGER_ENV_VARIABLES, A_LOGGER_FEATURES, A_LOGGER_FORMAT, A_LOGGER_LEVELS, A_LOGGER_SAFE_RANDOM_COLORS, A_LOGGER_TERMINAL, A_LOGGER_TIME_FORMAT, A_Logger, A_LoggerEnvVariables, A_LoggerEnvVariablesArray, A_LoggerLogContext };
//# sourceMappingURL=chunk-2UT5WCOA.mjs.map
//# sourceMappingURL=chunk-2UT5WCOA.mjs.map