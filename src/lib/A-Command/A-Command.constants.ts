export enum A_TYPES__CommandMetaKey {
    EXTENSIONS = 'a-command-extensions',
    FEATURES = 'a-command-features',
    ABSTRACTIONS = 'a-command-abstractions',
}

export enum A_CONSTANTS__A_Command_Status {
    INITIALIZED = 'INITIALIZED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

/**
 * A-Command Lifecycle Features
 */
export enum A_CONSTANTS_A_Command_Features {
    INIT = 'init',
    COMPLIED = 'complied',
    EXECUTE = 'execute',
    COMPLETE = 'complete',
    FAIL = 'fail',
}




export type A_CONSTANTS__A_Command_Event = 'init' | 'compile' | 'execute' | 'complete' | 'fail';



