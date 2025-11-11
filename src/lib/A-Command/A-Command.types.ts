import { A_Command } from "./A-Command.entity";
import { A_Command_Event, A_Command_Status, } from "./A-Command.constants";
import { A_TYPES__Entity_Serialized, A_TYPES__Error_Serialized } from "@adaas/a-concept";

// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================

/**
 * Command Constructor Type
 * 
 * Generic constructor type for creating command instances.
 * Used for dependency injection and factory patterns.
 * 
 * @template T - The command class type extending A_Command
 */
export type A_TYPES__Command_Constructor<T = A_Command> = new (...args: any[]) => T;

/**
 * Command Initialization Parameters
 * 
 * Base type for command parameters. Commands should extend this with
 * specific parameter types for their use case.
 * 
 * @example
 * ```typescript
 * interface UserCommandParams extends A_TYPES__Command_Init {
 *   userId: string;
 *   action: 'create' | 'update' | 'delete';
 * }
 * ```
 */
export type A_TYPES__Command_Init = Record<string, any>;

/**
 * Command Serialized Format
 * 
 * Complete serialized representation of a command including all state,
 * timing information, results, and errors. Used for persistence,
 * transmission between services, and state restoration.
 * 
 * @template ParamsType - Type of command parameters
 * @template ResultType - Type of command execution result
 * 
 * @example
 * ```typescript
 * const serialized: A_TYPES__Command_Serialized<
 *   { userId: string },
 *   { success: boolean }
 * > = command.toJSON();
 * ```
 */
export type A_TYPES__Command_Serialized<
    ParamsType extends Record<string, any> = Record<string, any>,
    ResultType extends Record<string, any> = Record<string, any>
> = {
    /**
     * Unique identifier for the command type (derived from class name)
     */
    code: string;
    
    /**
     * Current execution status of the command
     */
    status: A_Command_Status;
    
    /**
     * Parameters used to initialize the command
     */
    params: ParamsType;
    
    // --------------------------------------------------
    // Timing Information
    // --------------------------------------------------
    
    /**
     * ISO timestamp when the command was created
     */
    createdAt: string;
    
    /**
     * ISO timestamp when command execution started (if started)
     */
    startedAt?: string;
    
    /**
     * ISO timestamp when command execution ended (if completed/failed)
     */
    endedAt?: string;
    
    /**
     * Total execution duration in milliseconds (if completed/failed)
     */
    duration?: number;
    
    /**
     * Time between creation and execution start in milliseconds
     */
    idleTime?: number;
    
    // --------------------------------------------------
    // Execution Results
    // --------------------------------------------------
    
    /**
     * Result data produced by successful command execution
     */
    result?: ResultType;
    
    /**
     * Array of serialized errors that occurred during execution
     */
    error?: A_TYPES__Error_Serialized;
} & A_TYPES__Entity_Serialized

// ============================================================================
// ---------------------------- Event Types -----------------------------------
// ============================================================================

/**
 * Command Event Listener Function
 * 
 * Type definition for event listener functions that can be registered
 * to respond to command lifecycle events.
 * 
 * @template InvokeType - Type of command initialization parameters
 * @template ResultType - Type of command execution result  
 * @template LifecycleEvents - Union type of custom lifecycle event names
 * 
 * @param command - The command instance that triggered the event
 * 
 * @example
 * ```typescript
 * const listener: A_TYPES__Command_Listener<UserParams, UserResult> = (command) => {
 *   console.log(`Command ${command?.code} triggered event`);
 * };
 * 
 * command.on('onExecute', listener);
 * ```
 */
export type A_TYPES__Command_Listener<
    InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init,
    ResultType extends Record<string, any> = Record<string, any>,
    LifecycleEvents extends string = A_Command_Event
> = (command?: A_Command<InvokeType, ResultType, LifecycleEvents>) => void;



