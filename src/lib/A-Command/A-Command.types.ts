import { A_Command } from "./A-Command.entity";
import { A_CONSTANTS__A_Command_Event, A_CONSTANTS__A_Command_Status, A_TYPES__CommandMetaKey } from "./A-Command.constants";
import { A_Meta, A_TYPES__Entity_Serialized, A_TYPES__Error_Serialized, A_TYPES__FeatureDefineDecoratorMeta, A_TYPES__FeatureExtendDecoratorMeta } from "@adaas/a-concept";



// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Command constructor type
 * Uses the generic type T to specify the type of the entity
 */
export type A_TYPES__Command_Constructor<T = A_Command> = new (...args: any[]) => T;
/**
 * Command initialization type
 */
export type A_TYPES__Command_Init = Record<string, any>;
/**
 * Command serialized type
 */
export type A_TYPES__Command_Serialized<
    ParamsType extends Record<string, any> = Record<string, any>,
    ResultType extends Record<string, any> = Record<string, any>
> = {
    /**
     * Unique code of the command
     */
    code: string;
    /**
     * Current status of the command
     */
    status: A_CONSTANTS__A_Command_Status;
    /**
     * Parameters used to invoke the command
     */
    params: ParamsType;
    // --------------------------------------------------
    /**
     * The time when the command was created
     */
    startedAt?: string;
    /**
     * The time when the command execution ended
     */
    endedAt?: string;
    /**
     * Duration of the command execution in milliseconds
     */
    duration?: number;
    // --------------------------------------------------
    /**
     * Result of the command execution
     */
    result?: ResultType;
    /**
     * List of errors occurred during the command execution
     */
    errors?: Array<A_TYPES__Error_Serialized>;
} & A_TYPES__Entity_Serialized

// ============================================================================
// ---------------------------- Common Types ----------------------------------
// ============================================================================
/**
 * Command listener type
 */
export type A_TYPES__Command_Listener<
    InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init,
    ResultType extends Record<string, any> = Record<string, any>,
    LifecycleEvents extends string = A_CONSTANTS__A_Command_Event
> = (command?: A_Command<InvokeType, ResultType, LifecycleEvents>) => void;


// ============================================================================
// --------------------------- Meta Types -------------------------------------
// ============================================================================
/**
 * Command meta type
 */
export type A_TYPES__CommandMeta = {
    [A_TYPES__CommandMetaKey.EXTENSIONS]: A_Meta<{

        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         * 
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[]

    }>, case


    [A_TYPES__CommandMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         * 
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__FeatureDefineDecoratorMeta
    }>
}

