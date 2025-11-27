/**
 * A-Command Status Enumeration
 * 
 * Defines all possible states a command can be in during its lifecycle.
 * Commands progress through these states in a specific order:
 * CREATED → INITIALIZED → COMPILED → EXECUTING → COMPLETED/FAILED
 */
export enum A_Command_Status {
    /**
     * Initial state when command is instantiated but not yet ready for execution
     */
    CREATED = 'CREATED',

    /**
     * Command has been initialized with execution scope and dependencies
     */
    INITIALIZED = 'INITIALIZED',

    /**
     * Command has been compiled and is ready for execution
     */
    COMPILED = 'COMPILED',

    /**
     * Command is currently being executed
     */
    EXECUTING = 'EXECUTING',

    /**
     * Command has completed successfully
     */
    COMPLETED = 'COMPLETED',

    /**
     * Command execution has failed with errors
     */
    FAILED = 'FAILED',
}


/**
 * A-Command State Transitions
 * 
 * Defines valid state transitions for command lifecycle management.
 * These transitions are used by the StateMachine to enforce proper command flow.
 */
export enum A_CommandTransitions {
    /** Transition from CREATED to INITIALIZED state */
    CREATED_TO_INITIALIZED = 'created_initialized',

    /** Transition from INITIALIZED to EXECUTING state */
    INITIALIZED_TO_EXECUTING = 'initialized_executing',

    /** Transition from EXECUTING to COMPLETED state (success path) */
    EXECUTING_TO_COMPLETED = 'executing_completed',

    /** Transition from EXECUTING to FAILED state (error path) */
    EXECUTING_TO_FAILED = 'executing_failed',
}

/**
 * A-Command Lifecycle Features
 * 
 * Defines feature extension points that components can implement to customize
 * command behavior at different stages of the lifecycle.
 * 
 * Components can use @A_Feature.Extend() decorator with these feature names
 * to inject custom logic into command execution.
 */
export enum A_CommandFeatures {
    /**
     * Triggered during command initialization phase
     * Use to set up execution environment, validate parameters, or prepare resources
     */
    onInit = '_A_Command_onInit',

    /**
     * Triggered before command execution starts
     * Use for pre-execution validation, logging, or setup tasks
     */
    onBeforeExecute = '_A_Command_onBeforeExecute',

    /**
     * Main command execution logic
     * Core business logic should be implemented here
     */
    onExecute = '_A_Command_onExecute',

    /**
     * Triggered after command execution completes (success or failure)
     * Use for cleanup, logging, or post-processing tasks
     */
    onAfterExecute = '_A_Command_onAfterExecute',

    /**
     * Triggered when command completes successfully
     * Use for success-specific operations like notifications or result processing
     */
    onComplete = '_A_Command_onComplete',

    /**
     * Triggered when command execution fails
     * Use for error handling, cleanup, or failure notifications
     */
    onFail = '_A_Command_onFail',

    /**
     * Triggered when an error occurs during execution
     * Use for error logging, transformation, or recovery attempts
     */
    onError = '_A_Command_onError',
}


export enum A_CommandEvent {
    /**
     * Triggered during command initialization phase
     * Use to set up execution environment, validate parameters, or prepare resources
     */
    onInit = 'onInit',

    /**
     * Triggered before command execution starts
     * Use for pre-execution validation, logging, or setup tasks
     */
    onBeforeExecute = 'onBeforeExecute',

    /**
     * Main command execution logic
     * Core business logic should be implemented here
     */
    onExecute = 'onExecute',

    /**
     * Triggered after command execution completes (success or failure)
     * Use for cleanup, logging, or post-processing tasks
     */
    onAfterExecute = 'onAfterExecute',

    /**
     * Triggered when command completes successfully
     * Use for success-specific operations like notifications or result processing
     */
    onComplete = 'onComplete',

    /**
     * Triggered when command execution fails
     * Use for error handling, cleanup, or failure notifications
     */
    onFail = 'onFail',

    /**
     * Triggered when an error occurs during execution
     * Use for error logging, transformation, or recovery attempts
     */
    onError = 'onError',
}

/**
 * Type alias for command lifecycle event names
 * Represents all available events that can be listened to on a command instance
 */
export type A_CommandEvents = keyof typeof A_CommandEvent;





