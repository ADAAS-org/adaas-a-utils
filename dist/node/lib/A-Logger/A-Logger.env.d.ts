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

export { A_LoggerEnvVariables, A_LoggerEnvVariablesArray, type A_LoggerEnvVariablesType };
