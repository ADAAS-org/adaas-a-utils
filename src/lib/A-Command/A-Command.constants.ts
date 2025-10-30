/**
 * A-Command Statuses
 */
export enum A_CONSTANTS__A_Command_Status {
    /**
     * Command has been created but not yet initialized
     */
    CREATED = 'CREATED',
    /** 
     * Command is initializing
     */
    INITIALIZATION = 'INITIALIZATION',
    /**
     * Command has been initialized
     */
    INITIALIZED = 'INITIALIZED',
    /**
     * Command is compiling
     */
    COMPILATION = 'COMPILATION',
    /**
     * Command is compiled
     */
    COMPILED = 'COMPILED',
    /**
     * Command is executing
     */
    IN_PROGRESS = 'IN_PROGRESS',
    /**
     * Command has completed successfully
     */
    COMPLETED = 'COMPLETED',
    /**
     * Command has failed
     */
    FAILED = 'FAILED',
}

/**
 * A-Command Lifecycle Features
 */
export enum A_CommandFeatures {
    /**
     * Allows to extend initialization logic and behavior
     */
    onInit = 'onInit',
    /**
     * Allows to extend compilation logic and behavior
     */
    onCompile = 'onCompile',
    /**
     * Allows to extend execution logic and behavior
     */
    onExecute = 'onExecute',
    /**
     * Allows to extend completion logic and behavior
     */
    onComplete = 'onComplete',
    /**
     * 
     */
    onFail = 'onFail',
}




export type A_CONSTANTS__A_Command_Event = keyof typeof A_CommandFeatures;



