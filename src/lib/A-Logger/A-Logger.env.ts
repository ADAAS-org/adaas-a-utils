

export const A_LoggerEnvVariables = {
    /**
     * Sets the log level for the logger
     * 
     * @example 'debug', 'info', 'warn', 'error'
     */
    A_LOGGER_LEVEL: 'A_LOGGER_LEVEL',


    /**     
     * Sets the default scope length for log messages
     * 
     * @example 'A_LOGGER_DEFAULT_SCOPE_LENGTH'
     */
    A_LOGGER_DEFAULT_SCOPE_LENGTH: 'A_LOGGER_DEFAULT_SCOPE_LENGTH',
} as const;



export const A_LoggerEnvVariablesArray = [
    A_LoggerEnvVariables.A_LOGGER_LEVEL,
] as const;


export type A_LoggerEnvVariablesType = (typeof A_LoggerEnvVariables)[keyof typeof A_LoggerEnvVariables][];