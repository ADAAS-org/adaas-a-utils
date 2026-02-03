import { A_Error, A_TYPES__Error_Serialized, A_Fragment, A_Meta, A_TYPES__Fragment_Serialized, A_Component, A_TYPES__Entity_Serialized, A_TYPES__ConceptENVVariables, A_TYPES__Fragment_Constructor, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_Scope, A_Entity, A_Container, A_Feature, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor, A_TYPES__Container_Constructor } from '@adaas/a-concept';

type A_Operation_Storage<_Result_type extends any = any, _ParamsType extends Record<string, any> = Record<string, any>> = {
    /**
     * The name of the operation
     */
    name: string;
    /**
     * The parameters for the operation
     */
    params: _ParamsType;
    /**
     * The result of the operation
     */
    result: _Result_type;
    /**
     * Any error that occurred during the operation
     */
    error?: A_Error;
};
type A_Operation_Serialized<_Result_type extends any = any, _ParamsType extends Record<string, any> = Record<string, any>> = {
    /**
     * The name of the operation
     */
    name: string;
    /**
     * The parameters for the operation
     */
    params: _ParamsType;
    /**
     * The result of the operation
     */
    result: _Result_type;
    /**
     * Any error that occurred during the operation
     */
    error?: A_TYPES__Error_Serialized;
};

declare class A_ExecutionContext<_MetaType extends Record<string, any> = Record<string, any>, _SerializedType extends Record<string, any> = Record<string, any>> extends A_Fragment {
    protected _meta: A_Meta<_MetaType, _SerializedType>;
    constructor(name: string, defaults?: Partial<_MetaType>);
    [Symbol.iterator](): Iterator<[keyof _MetaType, _MetaType[keyof _MetaType]]>;
    get meta(): A_Meta<_MetaType>;
    get<K extends keyof _MetaType>(key: K): _MetaType[K] | undefined;
    set<K extends keyof _MetaType>(key: K, value: _MetaType[K]): this;
    has(key: keyof _MetaType): boolean;
    drop(key: keyof _MetaType): void;
    clear(): this;
    toRaw(): _SerializedType;
    toJSON(): A_TYPES__Fragment_Serialized;
}

declare class A_OperationContext<_AllowedOperations extends string = string, _ParamsType extends Record<string, any> = Record<string, any>, _ResultType = any, _StorageType extends A_Operation_Storage<_ResultType, _ParamsType> = A_Operation_Storage<_ResultType, _ParamsType>> extends A_ExecutionContext<_StorageType, A_Operation_Serialized<_ResultType, _ParamsType>> {
    constructor(operation: _AllowedOperations, params?: _ParamsType);
    get name(): _AllowedOperations;
    get result(): _ResultType | undefined;
    get error(): A_Error | undefined;
    get params(): _ParamsType;
    fail(error: A_Error): void;
    succeed(result: _ResultType): void;
    toJSON(): A_Operation_Serialized<_ResultType, _ParamsType>;
}

declare enum A_ChannelFeatures {
    /**
     * Allows to extend timeout logic and behavior
     */
    onTimeout = "_A_Channel_onTimeout",
    /**
     * Allows to extend retry logic and behavior
     */
    onRetry = "_A_Channel_onRetry",
    /**
     * Allows to extend circuit breaker logic and behavior
     */
    onCircuitBreakerOpen = "_A_Channel_onCircuitBreakerOpen",
    /**
     * Allows to extend cache logic and behavior
     */
    onCache = "_A_Channel_onCache",
    /**
     * Allows to extend connection logic and behavior
     */
    onConnect = "_A_Channel_onConnect",
    /**
     * Allows to extend disconnection logic and behavior
     */
    onDisconnect = "_A_Channel_onDisconnect",
    /**
     * Allows to extend request preparation logic and behavior
     */
    onBeforeRequest = "_A_Channel_onBeforeRequest",
    /**
     * Allows to extend request sending logic and behavior
     */
    onRequest = "_A_Channel_onRequest",
    /**
     * Allows to extend request post-processing logic and behavior
     */
    onAfterRequest = "_A_Channel_onAfterRequest",
    /**
     * Allows to extend error handling logic and behavior
     *
     * [!] The same approach uses for ALL errors within the channel
     */
    onError = "_A_Channel_onError",
    /**
     * Allows to extend send logic and behavior
     */
    onSend = "_A_Channel_onSend",
    /**
     * Allows to extend consume logic and behavior
     */
    onConsume = "_A_Channel_onConsume"
}
declare enum A_ChannelRequestStatuses {
    /**
     * Request is pending
     */
    PENDING = "PENDING",
    /***
     * Request was successful
     */
    SUCCESS = "SUCCESS",
    /**
     * Request failed
     */
    FAILED = "FAILED"
}

declare class A_ChannelRequest<_ParamsType extends Record<string, any> = Record<string, any>, _ResultType extends Record<string, any> = Record<string, any>> extends A_OperationContext<'request', _ParamsType, {
    data?: _ResultType;
    status?: A_ChannelRequestStatuses;
}> {
    constructor(params?: _ParamsType);
    get status(): A_ChannelRequestStatuses | undefined;
    get data(): _ResultType | undefined;
    succeed(result: _ResultType): void;
}

/**
 * A-Channel - A powerful, extensible communication channel component
 *
 * A-Channel provides a structured approach to implementing various communication patterns
 * such as HTTP clients, WebSocket connections, message queues, and other messaging systems.
 * It offers a complete lifecycle management system with extensible hooks for custom behavior.
 *
 * ## Key Features:
 * - 🔄 **Lifecycle Management** - Complete connection and processing lifecycle with hooks
 * - 📡 **Multiple Communication Patterns** - Request/Response and Fire-and-Forget messaging
 * - 🛡️ **Error Handling** - Comprehensive error capture and management
 * - 🎯 **Type Safety** - Full TypeScript support with generic types
 * - 🔧 **Extensible** - Component-based architecture for custom behavior
 * - ⚡ **Concurrent Processing** - Handle multiple requests simultaneously
 *
 * ## Basic Usage:
 * ```typescript
 * const channel = new A_Channel();
 * A_Context.root.register(channel);
 *
 * // Request/Response pattern
 * const response = await channel.request({ action: 'getData', id: 123 });
 *
 * // Fire-and-forget pattern
 * await channel.send({ type: 'notification', message: 'Hello World' });
 * ```
 *
 * ## Custom Implementation:
 * ```typescript
 * class HttpChannel extends A_Channel {}
 *
 * class HttpProcessor extends A_Component {
 *     @A_Feature.Extend({ scope: [HttpChannel] })
 *     async [A_ChannelFeatures.onRequest](
 *         @A_Inject(A_ChannelRequest) context: A_ChannelRequest
 *     ) {
 *         const response = await fetch(context.params.url);
 *         (context as any)._result = await response.json();
 *     }
 * }
 * ```
 *
 * @see {@link ./README.md} For complete documentation and examples
 */
declare class A_Channel extends A_Component {
    /**
     * Indicates whether the channel is currently processing requests.
     * This flag is managed automatically during request/send operations.
     *
     * @readonly
     */
    protected _processing: boolean;
    /**
     * Promise that resolves when the channel initialization is complete.
     * Ensures that onConnect lifecycle hook has been executed before
     * any communication operations.
     *
     * @private
     */
    protected _initialized?: Promise<void>;
    /**
     * Internal cache storage for channel-specific data.
     * Can be used by custom implementations for caching responses,
     * connection pools, or other channel-specific state.
     *
     * @protected
     */
    protected _cache: Map<string, any>;
    /**
     * Creates a new A_Channel instance.
     *
     * The channel must be registered with A_Context before use:
     * ```typescript
     * const channel = new A_Channel();
     * A_Context.root.register(channel);
     * ```
     */
    constructor();
    /**
     * Indicates whether the channel is currently processing requests.
     *
     * @returns {boolean} True if channel is processing, false otherwise
     */
    get processing(): boolean;
    /**
     * Promise that resolves when the channel is fully initialized.
     *
     * Automatically calls the onConnect lifecycle hook if not already called.
     * This ensures the channel is ready for communication operations.
     *
     * @returns {Promise<void>} Promise that resolves when initialization is complete
     */
    get initialize(): Promise<void>;
    /**
     * Connection lifecycle hook - called during channel initialization.
     *
     * Override this method in custom components to implement connection logic:
     * - Initialize network connections
     * - Load configuration
     * - Validate environment
     * - Set up connection pools
     *
     * @example
     * ```typescript
     * class DatabaseChannel extends A_Channel {}
     *
     * class DatabaseConnector extends A_Component {
     *     @A_Feature.Extend({ scope: [DatabaseChannel] })
     *     async [A_ChannelFeatures.onConnect]() {
     *         await this.initializeDatabase();
     *         console.log('Database channel connected');
     *     }
     * }
     * ```
     */
    onConnect(...args: any[]): Promise<void>;
    /**
     * Disconnection lifecycle hook - called during channel cleanup.
     *
     * Override this method in custom components to implement cleanup logic:
     * - Close network connections
     * - Save state
     * - Release resources
     * - Clear caches
     *
     * @example
     * ```typescript
     * @A_Feature.Extend({ scope: [DatabaseChannel] })
     * async [A_ChannelFeatures.onDisconnect]() {
     *     await this.closeConnections();
     *     console.log('Database channel disconnected');
     * }
     * ```
     */
    onDisconnect(...args: any[]): Promise<void>;
    /**
     * Pre-request processing hook - called before main request processing.
     *
     * Use this hook for:
     * - Request validation
     * - Authentication
     * - Rate limiting
     * - Logging
     * - Request transformation
     *
     * @example
     * ```typescript
     * @A_Feature.Extend({ scope: [HttpChannel] })
     * async [A_ChannelFeatures.onBeforeRequest](
     *     @A_Inject(A_ChannelRequest) context: A_ChannelRequest
     * ) {
     *     // Validate required parameters
     *     if (!context.params.url) {
     *         throw new Error('URL is required');
     *     }
     * }
     * ```
     */
    onBeforeRequest(...args: any[]): Promise<void>;
    /**
     * Main request processing hook - core business logic goes here.
     *
     * This is where the main communication logic should be implemented:
     * - Make HTTP requests
     * - Send messages to queues
     * - Execute database queries
     * - Process business logic
     *
     * Set the result in the context: `(context as any)._result = yourResult;`
     *
     * @example
     * ```typescript
     * @A_Feature.Extend({ scope: [HttpChannel] })
     * async [A_ChannelFeatures.onRequest](
     *     @A_Inject(A_ChannelRequest) context: A_ChannelRequest
     * ) {
     *     const response = await fetch(context.params.url);
     *     (context as any)._result = await response.json();
     * }
     * ```
     */
    onRequest(...args: any[]): Promise<void>;
    /**
     * Post-request processing hook - called after successful request processing.
     *
     * Use this hook for:
     * - Response transformation
     * - Logging
     * - Analytics
     * - Caching results
     * - Cleanup
     *
     * @example
     * ```typescript
     * @A_Feature.Extend({ scope: [HttpChannel] })
     * async [A_ChannelFeatures.onAfterRequest](
     *     @A_Inject(A_ChannelRequest) context: A_ChannelRequest
     * ) {
     *     console.log(`Request completed in ${Date.now() - context.startTime}ms`);
     *     await this.cacheResponse(context.params, context.data);
     * }
     * ```
     */
    onAfterRequest(...args: any[]): Promise<void>;
    /**
     * Error handling hook - called when any operation fails.
     *
     * Use this hook for:
     * - Error logging
     * - Error transformation
     * - Alerting
     * - Retry logic
     * - Fallback mechanisms
     *
     * @example
     * ```typescript
     * @A_Feature.Extend({ scope: [HttpChannel] })
     * async [A_ChannelFeatures.onError](
     *     @A_Inject(A_ChannelRequest) context: A_ChannelRequest
     * ) {
     *     console.error('Request failed:', context.params, context.failed);
     *     await this.logError(context);
     *     await this.sendAlert(context);
     * }
     * ```
     */
    onError(...args: any[]): Promise<void>;
    /**
     * Send operation hook - called for fire-and-forget messaging.
     *
     * Use this hook for:
     * - Message broadcasting
     * - Event publishing
     * - Notification sending
     * - Queue operations
     *
     * @example
     * ```typescript
     * @A_Feature.Extend({ scope: [EventChannel] })
     * async [A_ChannelFeatures.onSend](
     *     @A_Inject(A_ChannelRequest) context: A_ChannelRequest
     * ) {
     *     const { eventType, payload } = context.params;
     *     await this.publishEvent(eventType, payload);
     * }
     * ```
     */
    onSend(...args: any[]): Promise<void>;
    /**
     * Initializes the channel by calling the onConnect lifecycle hook.
     *
     * This method is called automatically when accessing the `initialize` property.
     * You can also call it manually if needed.
     *
     * @returns {Promise<void>} Promise that resolves when connection is established
     */
    connect(): Promise<void>;
    /**
     * Disconnects the channel by calling the onDisconnect lifecycle hook.
     *
     * Use this method to properly cleanup resources when the channel is no longer needed.
     *
     * @returns {Promise<void>} Promise that resolves when cleanup is complete
     */
    disconnect(): Promise<void>;
    /**
     * Sends a request and waits for a response (Request/Response pattern).
     *
     * This method follows the complete request lifecycle:
     * 1. Ensures channel is initialized
     * 2. Creates request scope and context
     * 3. Calls onBeforeRequest hook
     * 4. Calls onRequest hook (main processing)
     * 5. Calls onAfterRequest hook
     * 6. Returns the response context
     *
     * If any step fails, the onError hook is called and the error is captured
     * in the returned context.
     *
     * @template _ParamsType The type of request parameters
     * @template _ResultType The type of response data
     * @param params The request parameters
     * @returns {Promise<A_ChannelRequest<_ParamsType, _ResultType>>} Request context with response
     *
     * @example
     * ```typescript
     * // Basic usage
     * const response = await channel.request({ action: 'getData', id: 123 });
     *
     * // Typed usage
     * interface UserRequest { userId: string; }
     * interface UserResponse { name: string; email: string; }
     *
     * const userResponse = await channel.request<UserRequest, UserResponse>({
     *     userId: 'user-123'
     * });
     *
     * if (!userResponse.failed) {
     *     console.log('User:', userResponse.data.name);
     * }
     * ```
     */
    request<_ParamsType extends Record<string, any> = Record<string, any>, _ResultType extends Record<string, any> = Record<string, any>>(params: _ParamsType): Promise<A_ChannelRequest<_ParamsType, _ResultType>>;
    /**
     * Sends a fire-and-forget message (Send pattern).
     *
     * This method is used for one-way communication where no response is expected:
     * - Event broadcasting
     * - Notification sending
     * - Message queuing
     * - Logging operations
     *
     * The method follows this lifecycle:
     * 1. Ensures channel is initialized
     * 2. Creates send scope and context
     * 3. Calls onSend hook
     * 4. Completes without returning data
     *
     * If the operation fails, the onError hook is called but no error is thrown
     * to the caller (fire-and-forget semantics).
     *
     * @template _ParamsType The type of message parameters
     * @param message The message to send
     * @returns {Promise<void>} Promise that resolves when send is complete
     *
     * @example
     * ```typescript
     * // Send notification
     * await channel.send({
     *     type: 'user.login',
     *     userId: 'user-123',
     *     timestamp: new Date().toISOString()
     * });
     *
     * // Send to message queue
     * await channel.send({
     *     queue: 'email-queue',
     *     payload: {
     *         to: 'user@example.com',
     *         subject: 'Welcome!',
     *         body: 'Welcome to our service!'
     *     }
     * });
     * ```
     */
    send<_ParamsType extends Record<string, any> = Record<string, any>>(message: _ParamsType): Promise<void>;
    /**
     * @deprecated This method is deprecated and will be removed in future versions.
     * Use request() or send() methods instead depending on your communication pattern.
     *
     * For request/response pattern: Use request()
     * For fire-and-forget pattern: Use send()
     * For consumer patterns: Implement custom consumer logic using request() in a loop
     */
    consume<T extends Record<string, any> = Record<string, any>>(): Promise<A_OperationContext<any, T>>;
}

declare class A_ChannelError extends A_Error {
    static readonly MethodNotImplemented = "A-Channel Method Not Implemented";
    protected _context?: A_OperationContext;
    /**
     * Channel Error allows to keep track of errors within a channel if something goes wrong
     *
     *
     * @param originalError
     * @param context
     */
    constructor(originalError: string | A_Error | Error | any, context?: A_OperationContext | string);
    /***
     * Returns Context of the error
     */
    get context(): A_OperationContext | undefined;
}

/**
 * A-Command Status Enumeration
 *
 * Defines all possible states a command can be in during its lifecycle.
 * Commands progress through these states in a specific order:
 * CREATED → INITIALIZED → COMPILED → EXECUTING → COMPLETED/FAILED
 */
declare enum A_Command_Status {
    /**
     * Initial state when command is instantiated but not yet ready for execution
     */
    CREATED = "CREATED",
    /**
     * Command has been initialized with execution scope and dependencies
     */
    INITIALIZED = "INITIALIZED",
    /**
     * Command has been compiled and is ready for execution
     */
    COMPILED = "COMPILED",
    /**
     * Command is currently being executed
     */
    EXECUTING = "EXECUTING",
    /**
     * Command has completed successfully
     */
    COMPLETED = "COMPLETED",
    /**
     * Command execution has failed with errors
     */
    FAILED = "FAILED"
}
/**
 * A-Command State Transitions
 *
 * Defines valid state transitions for command lifecycle management.
 * These transitions are used by the StateMachine to enforce proper command flow.
 */
declare enum A_CommandTransitions {
    /** Transition from CREATED to INITIALIZED state */
    CREATED_TO_INITIALIZED = "created_initialized",
    /** Transition from INITIALIZED to EXECUTING state */
    INITIALIZED_TO_EXECUTING = "initialized_executing",
    /** Transition from EXECUTING to COMPLETED state (success path) */
    EXECUTING_TO_COMPLETED = "executing_completed",
    /** Transition from EXECUTING to FAILED state (error path) */
    EXECUTING_TO_FAILED = "executing_failed"
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
declare enum A_CommandFeatures {
    /**
     * Triggered during command initialization phase
     * Use to set up execution environment, validate parameters, or prepare resources
     */
    onInit = "_A_Command_onInit",
    /**
     * Triggered before command execution starts
     * Use for pre-execution validation, logging, or setup tasks
     */
    onBeforeExecute = "_A_Command_onBeforeExecute",
    /**
     * Main command execution logic
     * Core business logic should be implemented here
     */
    onExecute = "_A_Command_onExecute",
    /**
     * Triggered after command execution completes (success or failure)
     * Use for cleanup, logging, or post-processing tasks
     */
    onAfterExecute = "_A_Command_onAfterExecute",
    /**
     * Triggered when command completes successfully
     * Use for success-specific operations like notifications or result processing
     */
    onComplete = "_A_Command_onComplete",
    /**
     * Triggered when command execution fails
     * Use for error handling, cleanup, or failure notifications
     */
    onFail = "_A_Command_onFail",
    /**
     * Triggered when an error occurs during execution
     * Use for error logging, transformation, or recovery attempts
     */
    onError = "_A_Command_onError"
}
declare enum A_CommandEvent {
    /**
     * Triggered during command initialization phase
     * Use to set up execution environment, validate parameters, or prepare resources
     */
    onInit = "onInit",
    /**
     * Triggered before command execution starts
     * Use for pre-execution validation, logging, or setup tasks
     */
    onBeforeExecute = "onBeforeExecute",
    /**
     * Main command execution logic
     * Core business logic should be implemented here
     */
    onExecute = "onExecute",
    /**
     * Triggered after command execution completes (success or failure)
     * Use for cleanup, logging, or post-processing tasks
     */
    onAfterExecute = "onAfterExecute",
    /**
     * Triggered when command completes successfully
     * Use for success-specific operations like notifications or result processing
     */
    onComplete = "onComplete",
    /**
     * Triggered when command execution fails
     * Use for error handling, cleanup, or failure notifications
     */
    onFail = "onFail",
    /**
     * Triggered when an error occurs during execution
     * Use for error logging, transformation, or recovery attempts
     */
    onError = "onError"
}
/**
 * Type alias for command lifecycle event names
 * Represents all available events that can be listened to on a command instance
 */
type A_CommandEvents = keyof typeof A_CommandEvent;

/**
 * Command Constructor Type
 *
 * Generic constructor type for creating command instances.
 * Used for dependency injection and factory patterns.
 *
 * @template T - The command class type extending A_Command
 */
type A_TYPES__Command_Constructor<T = A_Command> = new (...args: any[]) => T;
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
type A_TYPES__Command_Init = Record<string, any>;
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
type A_TYPES__Command_Serialized<ParamsType extends Record<string, any> = Record<string, any>, ResultType extends Record<string, any> = Record<string, any>> = {
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
    /**
     * Result data produced by successful command execution
     */
    result?: ResultType;
    /**
     * Array of serialized errors that occurred during execution
     */
    error?: A_TYPES__Error_Serialized;
} & A_TYPES__Entity_Serialized;
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
type A_TYPES__Command_Listener<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>, LifecycleEvents extends string = keyof typeof A_CommandEvent> = (command?: A_Command<InvokeType, ResultType, LifecycleEvents>) => void;
type A_Command_ExecutionContext<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>> = {
    result: ResultType;
    params: InvokeType;
};

declare enum A_StateMachineFeatures {
    /**
     * Allows to extend error handling logic and behavior
     */
    onError = "_A_StateMachine_onError",
    /**
     * Allows to extend initialization logic and behavior
     */
    onInitialize = "_A_StateMachine_onInitialize",
    /**
     * Allows to extend transition validation logic and behavior
     */
    onBeforeTransition = "_A_StateMachine_onBeforeTransition",
    /**
     * Allows to extend post-transition logic and behavior
     */
    onAfterTransition = "_A_StateMachine_onAfterTransition"
}

/**
 * A_StateMachine is a powerful state machine implementation that allows you to define and manage
 * complex state transitions with validation, hooks, and error handling.
 *
 * @template T - A record type defining the state transitions and their associated data types.
 *               Each key represents a state name, and the value represents the data type for that state.
 *
 * @example
 * ```typescript
 * interface OrderStates {
 *   pending: { orderId: string };
 *   processing: { orderId: string; processedBy: string };
 *   completed: { orderId: string; completedAt: Date };
 *   cancelled: { orderId: string; reason: string };
 * }
 *
 * class OrderStateMachine extends A_StateMachine<OrderStates> {
 *   // Define custom transition logic
 *   async pending_processing(scope: A_Scope) {
 *     const operation = scope.resolve(A_StateMachineTransition)!;
 *     const { orderId } = operation.props;
 *     // Custom validation and business logic
 *   }
 * }
 * ```
 */
declare class A_StateMachine<T extends Record<string, any> = Record<string, any>> extends A_Component {
    /**
     * Internal promise that tracks the initialization state of the state machine.
     * Used to ensure the state machine is properly initialized before allowing transitions.
     */
    protected _initialized?: Promise<void>;
    /**
     * Gets a promise that resolves when the state machine is fully initialized and ready for transitions.
     * This ensures that all initialization hooks have been executed before allowing state transitions.
     *
     * @returns Promise<void> that resolves when initialization is complete
     *
     * @example
     * ```typescript
     * const stateMachine = new MyStateMachine();
     * await stateMachine.ready; // Wait for initialization
     * await stateMachine.transition('idle', 'running');
     * ```
     */
    get ready(): Promise<void>;
    /**
     * Initialization hook that runs when the state machine is first created.
     * This method can be extended to add custom initialization logic.
     *
     * @param args - Variable arguments passed during initialization
     * @returns Promise<void>
     *
     * @example
     * ```typescript
     * class MyStateMachine extends A_StateMachine {
     *   @A_Feature.Extend()
     *   async [A_StateMachineFeatures.onInitialize]() {
     *     // Custom initialization logic
     *     console.log('State machine initialized');
     *   }
     * }
     * ```
     */
    [A_StateMachineFeatures.onInitialize](...args: any[]): Promise<void>;
    /**
     * Hook that runs before any state transition occurs.
     * Use this to add validation, logging, or preparation logic that should run for all transitions.
     *
     * @param args - Variable arguments, typically includes the transition scope
     * @returns Promise<void>
     *
     * @example
     * ```typescript
     * class MyStateMachine extends A_StateMachine {
     *   @A_Feature.Extend()
     *   async [A_StateMachineFeatures.onBeforeTransition](scope: A_Scope) {
     *     const operation = scope.resolve(A_StateMachineTransition)!;
     *     console.log(`Transitioning from ${operation.props.from} to ${operation.props.to}`);
     *   }
     * }
     * ```
     */
    [A_StateMachineFeatures.onBeforeTransition](...args: any[]): Promise<void>;
    /**
     * Hook that runs after a successful state transition.
     * Use this to add cleanup, logging, or post-transition logic that should run for all transitions.
     *
     * @param args - Variable arguments, typically includes the transition scope
     * @returns Promise<void>
     *
     * @example
     * ```typescript
     * class MyStateMachine extends A_StateMachine {
     *   @A_Feature.Extend()
     *   async [A_StateMachineFeatures.onAfterTransition](scope: A_Scope) {
     *     const operation = scope.resolve(A_StateMachineTransition)!;
     *     console.log(`Successfully transitioned to ${operation.props.to}`);
     *   }
     * }
     * ```
     */
    [A_StateMachineFeatures.onAfterTransition](...args: any[]): Promise<void>;
    /**
     * Error handling hook that runs when a transition fails.
     * Use this to add custom error handling, logging, or recovery logic.
     *
     * @param args - Variable arguments, typically includes the error scope
     * @returns Promise<void>
     *
     * @example
     * ```typescript
     * class MyStateMachine extends A_StateMachine {
     *   @A_Feature.Extend()
     *   async [A_StateMachineFeatures.onError](scope: A_Scope) {
     *     const error = scope.resolve(A_StateMachineError);
     *     console.error('Transition failed:', error?.message);
     *   }
     * }
     * ```
     */
    [A_StateMachineFeatures.onError](...args: any[]): Promise<void>;
    /**
     * Executes a state transition from one state to another.
     * This is the core method of the state machine that handles the complete transition lifecycle.
     *
     * @param from - The state to transition from (must be a key of T)
     * @param to - The state to transition to (must be a key of T)
     * @param props - Optional properties to pass to the transition context (should match T[keyof T])
     * @returns Promise<void> that resolves when the transition is complete
     *
     * @throws {A_StateMachineError} When the transition fails for any reason
     *
     * @example
     * ```typescript
     * interface OrderStates {
     *   pending: { orderId: string };
     *   processing: { orderId: string; processedBy: string };
     * }
     *
     * const orderMachine = new A_StateMachine<OrderStates>();
     *
     * // Transition with props
     * await orderMachine.transition('pending', 'processing', {
     *   orderId: '12345',
     *   processedBy: 'user-456'
     * });
     * ```
     *
     * The transition process follows this lifecycle:
     * 1. Wait for state machine initialization (ready)
     * 2. Create transition name in camelCase format (e.g., "pending_processing")
     * 3. Create operation context with transition data
     * 4. Create isolated scope for the transition
     * 5. Call onBeforeTransition hook
     * 6. Execute the specific transition method (if defined)
     * 7. Call onAfterTransition hook
     * 8. Clean up scope and return result
     *
     * If any step fails, the onError hook is called and a wrapped error is thrown.
     */
    transition(
    /**
     * The state to transition from
     */
    from: keyof T, 
    /**
     * The state to transition to
     */
    to: keyof T, 
    /**
     * Optional properties to pass to the transition context
     */
    props?: T[keyof T]): Promise<void>;
}

declare enum A_TYPES__ConfigFeature {
}
type A_TYPES__ConfigContainerConstructor<T extends Array<string | A_TYPES__ConceptENVVariables[number]>> = {
    /**
     * If set to true, the SDK will throw an error if the variable is not defined OR not presented in the defaults
     */
    strict: boolean;
    /**
     * Allows to define the names of variable to be loaded
     */
    variables: T;
    /**
     * Allows to set the default values for the variables
     */
    defaults: {
        [key in T[number]]?: any;
    };
} & A_TYPES__Fragment_Constructor;

declare const A_CONSTANTS__CONFIG_ENV_VARIABLES: {};
type A_TYPES__ConfigENVVariables = (typeof A_CONSTANTS__CONFIG_ENV_VARIABLES)[keyof typeof A_CONSTANTS__CONFIG_ENV_VARIABLES][];
declare const A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY: readonly [];

declare class A_Config<T extends Array<string | A_TYPES__ConceptENVVariables[number]> = any[]> extends A_ExecutionContext<{
    [key in T[number]]: any;
} & {
    [key in typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY[number]]: any;
} & {
    [key in typeof A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY[number]]: any;
}> {
    protected _strict: boolean;
    protected _configProperties: T;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: ("A_CONCEPT_NAME" | "A_CONCEPT_ROOT_SCOPE" | "A_CONCEPT_ENVIRONMENT" | "A_CONCEPT_ROOT_FOLDER" | "A_ERROR_DEFAULT_DESCRIPTION")[];
    constructor(config: Partial<A_TYPES__ConfigContainerConstructor<T>>);
    get strict(): boolean;
    /**
      * This method is used to get the configuration property by name
      *
      * @param property
      * @returns
      */
    get<K extends T[number]>(property: K | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]): {
        [key in T[number]]: any;
    }[K] | undefined;
    /**
     *
     * This method is used to set the configuration property by name
     * OR set multiple properties at once by passing an array of objects
     *
     * @param variables
     */
    set(variables: Array<{
        property: T[number] | A_TYPES__ConceptENVVariables[number];
        value: any;
    }>): any;
    set(variables: Partial<Record<T[number] | A_TYPES__ConceptENVVariables[number], any>>): any;
    set(property: T[number] | A_TYPES__ConceptENVVariables[number], value: any): any;
}

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

type A_LoggerLevel = 'debug' | 'info' | 'warn' | 'error' | 'all';
/**
 * Available color names for the logger
 * Can be used as first parameter in logging methods to specify message color
 */
type A_LoggerColorName = 'red' | 'yellow' | 'green' | 'blue' | 'cyan' | 'magenta' | 'gray' | 'brightBlue' | 'brightCyan' | 'brightMagenta' | 'darkGray' | 'lightGray' | 'indigo' | 'violet' | 'purple' | 'lavender' | 'skyBlue' | 'steelBlue' | 'slateBlue' | 'deepBlue' | 'lightBlue' | 'periwinkle' | 'cornflower' | 'powder' | 'charcoal' | 'silver' | 'smoke' | 'slate';

/**
 * A_Logger - Advanced Logging Component with Scope-based Output Formatting
 *
 * This component provides comprehensive logging capabilities with:
 * - Color-coded console output for different log levels
 * - Scope-based message formatting with consistent alignment
 * - Support for multiple data types (objects, errors, strings)
 * - Configurable log levels for filtering output
 * - Special handling for A_Error and native Error objects
 * - Timestamp inclusion for better debugging
 *
 * Key Features:
 * - **Scope Integration**: Uses A_Scope for consistent message prefixing
 * - **Color Support**: Terminal color codes for visual distinction
 * - **Object Formatting**: Pretty-prints JSON objects with proper indentation
 * - **Error Handling**: Special formatting for A_Error and Error objects
 * - **Log Level Filtering**: Configurable filtering based on severity
 * - **Multi-line Support**: Proper alignment for multi-line messages
 *
 * @example
 * ```typescript
 * // Basic usage with dependency injection (uses deterministic colors based on scope name)
 * class MyService {
 *   constructor(@A_Inject(A_Logger) private logger: A_Logger) {}
 *
 *   doSomething() {
 *     this.logger.info('Processing started'); // Uses scope-name-based colors, always shows
 *     this.logger.debug('Debug information'); // Only shows when debug level enabled
 *
 *     // Color overload methods with enum support
 *     this.logger.info('green', 'Success message'); // Green message, scope stays default
 *     this.logger.debug('gray', 'Verbose debug info'); // Gray message for less important info
 *     this.logger.info('brightBlue', 'Important notification');
 *
 *     // Terminal width aware formatting - automatically wraps long lines
 *     this.logger.info('This is a very long message that will be automatically wrapped to fit within the terminal width while maintaining proper indentation and formatting');
 *
 *     this.logger.warning('Something might be wrong');
 *     this.logger.error(new Error('Something failed'));
 *   }
 * }
 *
 * // Same scope names will always get the same colors automatically
 * const logger1 = new A_Logger(new A_Scope({name: 'UserService'})); // Gets consistent colors
 * const logger2 = new A_Logger(new A_Scope({name: 'UserService'})); // Gets same colors as logger1
 *
 * // Available color names (A_LoggerColorName enum):
 * // 'red', 'yellow', 'green', 'blue', 'cyan', 'magenta', 'gray',
 * // 'brightBlue', 'brightCyan', 'brightMagenta', 'darkGray', 'lightGray',
 * // 'indigo', 'violet', 'purple', 'lavender', 'skyBlue', 'steelBlue',
 * // 'slateBlue', 'deepBlue', 'lightBlue', 'periwinkle', 'cornflower',
 * // 'powder', 'charcoal', 'silver', 'smoke', 'slate'
 *
 * // Configuration via environment variables or A_Config (overrides automatic selection)
 * process.env.A_LOGGER_DEFAULT_SCOPE_COLOR = 'magenta';
 * process.env.A_LOGGER_DEFAULT_LOG_COLOR = 'green';
 *
 * // Or through A_Config instance
 * const config = new A_Config({
 *   A_LOGGER_DEFAULT_SCOPE_COLOR: 'red',
 *   A_LOGGER_DEFAULT_LOG_COLOR: 'white'
 * });
 * const logger = new A_Logger(scope, config);
 * ```
 */
declare class A_Logger extends A_Component {
    protected scope: A_Scope;
    protected config?: A_Config<A_LoggerEnvVariablesType> | undefined;
    /**
     * Terminal color codes for different log levels and custom styling
     * These codes work with ANSI escape sequences for colored terminal output
     */
    readonly COLORS: any;
    /**
     * Standard scope length for consistent formatting
     * This ensures all log messages align properly regardless of scope name length
     */
    private readonly STANDARD_SCOPE_LENGTH;
    /**
     * Default color for the scope portion of log messages
     * This color is used for the scope brackets and content, and remains consistent
     * for this logger instance regardless of message color overrides
     */
    private readonly DEFAULT_SCOPE_COLOR;
    /**
     * Default color for log message content when no explicit color is provided
     * This color is used for the message body when logging without specifying a color
     */
    private readonly DEFAULT_LOG_COLOR;
    /**
     * Current terminal width for responsive formatting
     * Automatically detected or falls back to default values
     */
    private readonly TERMINAL_WIDTH;
    /**
     * Maximum content width based on terminal size
     * Used for word wrapping and line length calculations
     */
    private readonly MAX_CONTENT_WIDTH;
    /**
     * Initialize A_Logger with dependency injection
     * Colors are configured through A_Config or generated randomly if not provided
     *
     * @param scope - The current scope context for message prefixing
     * @param config - Optional configuration for log level filtering and color settings
     */
    constructor(scope: A_Scope, config?: A_Config<A_LoggerEnvVariablesType> | undefined);
    /**
     * Generate a simple hash from a string
     * Used to create deterministic color selection based on scope name
     *
     * @param str - The string to hash
     * @returns A numeric hash value
     */
    private simpleHash;
    /**
     * Generate a deterministic color based on scope name
     * Same scope names will always get the same color, but uses safe color palette
     *
     * @param scopeName - The scope name to generate color for
     * @returns A color key from the safe colors palette
     */
    private generateColorFromScopeName;
    /**
     * Generate a pair of complementary colors based on scope name
     * Ensures visual harmony between scope and message colors while being deterministic
     *
     * @param scopeName - The scope name to base colors on
     * @returns Object with scopeColor and logColor that work well together
     */
    private generateComplementaryColorsFromScope;
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
    private detectTerminalWidth;
    /**
     * Wrap text to fit within terminal width while preserving formatting
     *
     * @param text - Text to wrap
     * @param scopePadding - The scope padding string for alignment
     * @param isFirstLine - Whether this is the first line (affects available width calculation)
     * @returns Array of wrapped lines with proper indentation
     */
    private wrapText;
    /**
     * Split a long word that doesn't fit on a single line
     *
     * @param word - Word to split
     * @param maxLength - Maximum length per chunk
     * @returns Array of word chunks
     */
    private splitLongWord;
    /**
     * Get the formatted scope length for consistent message alignment
     * Uses a standard length to ensure all messages align properly regardless of scope name
     *
     * @returns The scope length to use for padding calculations
     */
    get scopeLength(): number;
    /**
     * Get the formatted scope name with proper padding, centered within the container
     * Ensures consistent width for all scope names in log output with centered alignment
     *
     * @returns Centered and padded scope name for consistent formatting
     */
    get formattedScope(): string;
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
    compile(messageColor: keyof typeof this.COLORS, ...args: any[]): Array<any>;
    /**
     * Format an object for display with proper JSON indentation and terminal width awareness
     *
     * @param obj - The object to format
     * @param shouldAddNewline - Whether to add a newline prefix
     * @param scopePadding - The padding string for consistent alignment
     * @returns Formatted object string or the object itself for browser environments
     */
    private formatObject;
    /**
     * Wrap a long JSON string value while preserving readability
     *
     * @param value - The string value to wrap
     * @param maxWidth - Maximum width for the value
     * @returns Wrapped string value
     */
    private wrapJsonStringValue;
    /**
     * Format a string for display with proper indentation and terminal width wrapping
     *
     * @param str - The string to format
     * @param shouldAddNewline - Whether to add a newline prefix
     * @param scopePadding - The padding string for consistent alignment
     * @returns Formatted string
     */
    private formatString;
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
    protected shouldLog(logMethod: 'debug' | 'info' | 'warning' | 'error'): boolean;
    /**
     * Debug logging method with optional color specification
     * Only logs when debug level is enabled
     *
     * Supports two usage patterns:
     * 1. debug(message, ...args) - Uses instance's default log color
     * 2. debug(color, message, ...args) - Uses specified color for message content only
     *
     * Note: The scope color always remains the instance's default scope color,
     * only the message content color changes when explicitly specified.
     *
     * @param color - Optional color name from A_LoggerColorName enum or the first message argument
     * @param args - Additional arguments to log
     *
     * @example
     * ```typescript
     * logger.debug('Debug information'); // Uses instance default colors
     * logger.debug('gray', 'Debug message'); // Gray message, scope stays instance color
     * logger.debug('Processing user:', { id: 1, name: 'John' });
     * ```
     */
    debug(color: A_LoggerColorName, ...args: any[]): void;
    debug(...args: any[]): void;
    /**
     * Info logging method with optional color specification
     * Logs without any restrictions (always shows regardless of log level)
     *
     * Supports two usage patterns:
     * 1. info(message, ...args) - Uses instance's default log color
     * 2. info(color, message, ...args) - Uses specified color for message content only
     *
     * Note: The scope color always remains the instance's default scope color,
     * only the message content color changes when explicitly specified.
     *
     * @param color - Optional color name from A_LoggerColorName enum or the first message argument
     * @param args - Additional arguments to log
     *
     * @example
     * ```typescript
     * logger.info('Hello World'); // Uses instance default colors
     * logger.info('green', 'Success message'); // Green message, scope stays instance color
     * logger.info('Processing user:', { id: 1, name: 'John' });
     * ```
     */
    info(color: A_LoggerColorName, ...args: any[]): void;
    info(...args: any[]): void;
    /**
     * Legacy log method (kept for backward compatibility)
     * @deprecated Use info() method instead
     *
     * @param color - Optional color name from A_LoggerColorName enum or the first message argument
     * @param args - Additional arguments to log
     */
    log(color: A_LoggerColorName, ...args: any[]): void;
    log(...args: any[]): void;
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
    warning(...args: any[]): void;
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
    error(...args: any[]): void;
    /**
     * Legacy method for A_Error logging (kept for backward compatibility)
     *
     * @deprecated Use error() method instead which handles A_Error automatically
     * @param error - The A_Error instance to log
     */
    protected log_A_Error(error: A_Error): void;
    /**
     * Format A_Error instances for inline display within compiled messages
     *
     * Provides detailed formatting for A_Error objects with:
     * - Error code, message, and description
     * - Original error information FIRST (better UX for debugging)
     * - Stack traces with terminal width awareness
     * - Documentation links (if available)
     * - Consistent formatting with rest of logger
     *
     * @param error - The A_Error instance to format
     * @returns Formatted string ready for display
     */
    protected compile_A_Error(error: A_Error): string;
    /**
     * Format stack trace with proper terminal width wrapping and indentation
     *
     * @param stack - The stack trace string
     * @param baseIndent - Base indentation for continuation lines
     * @returns Array of formatted stack trace lines
     */
    private formatStackTrace;
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
    protected compile_Error(error: Error): string;
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
    protected getTime(): string;
}

type A_StateMachineTransitionParams<T = any> = {
    from: string;
    to: string;
    props?: T;
};
type A_StateMachineTransitionStorage<_ResultType extends any = any, _ParamsType extends any = any> = {
    from: string;
    to: string;
} & A_Operation_Storage<_ResultType, A_StateMachineTransitionParams<_ParamsType>>;

declare class A_StateMachineTransition<_ParamsType = any, _ResultType = any> extends A_OperationContext<'a-state-machine-transition', A_StateMachineTransitionParams<_ParamsType>, _ResultType, A_StateMachineTransitionStorage<_ResultType, _ParamsType>> {
    constructor(params: A_StateMachineTransitionParams<_ParamsType>);
    /**
     * The state to transition from
     */
    get from(): string;
    /**
     * The state to transition to
     */
    get to(): string;
}

/**
 * A_Command - Advanced Command Pattern Implementation
 *
 * A comprehensive command pattern implementation that encapsulates business logic
 * as executable commands with full lifecycle management, event handling, and
 * state persistence capabilities.
 *
 * ## Key Features
 * - **Structured Lifecycle**: Automatic progression through init → compile → execute → complete/fail
 * - **Event-Driven**: Subscribe to lifecycle events and emit custom events
 * - **State Persistence**: Full serialization/deserialization for cross-service communication
 * - **Type Safety**: Generic types for parameters, results, and custom events
 * - **Dependency Injection**: Integrated with A-Concept's DI system
 * - **Error Management**: Comprehensive error capture and handling
 * - **Execution Tracking**: Built-in timing and performance metrics
 *
 * ## Lifecycle Phases
 * 1. **CREATED** - Command instantiated but not initialized
 * 2. **INITIALIZED** - Execution scope and dependencies set up
 * 3. **COMPILED** - Ready for execution with all resources prepared
 * 4. **EXECUTING** - Currently running business logic
 * 5. **COMPLETED** - Successfully finished execution
 * 6. **FAILED** - Execution failed with errors captured
 *
 * @template InvokeType - Type definition for command parameters
 * @template ResultType - Type definition for command execution result
 * @template LifecycleEvents - Union type of custom lifecycle event names
 *
 * @example
 * ```typescript
 * // Define parameter and result types
 * interface UserCreateParams {
 *   name: string;
 *   email: string;
 *   role: 'admin' | 'user';
 * }
 *
 * interface UserCreateResult {
 *   userId: string;
 *   success: boolean;
 * }
 *
 * // Create custom command
 * class CreateUserCommand extends A_Command<UserCreateParams, UserCreateResult> {}
 *
 * // Execute command
 * const command = new CreateUserCommand({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   role: 'user'
 * });
 *
 * scope.register(command);
 * await command.execute();
 *
 * console.log('Result:', command.result);
 * console.log('Status:', command.status);
 * ```
 */
declare class A_Command<InvokeType extends A_TYPES__Command_Init = A_TYPES__Command_Init, ResultType extends Record<string, any> = Record<string, any>, LifecycleEvents extends string | keyof typeof A_CommandEvent = keyof typeof A_CommandEvent> extends A_Entity<InvokeType, A_TYPES__Command_Serialized<InvokeType, ResultType>> {
    /**
     * Static command identifier derived from the class name
     * Used for command registration and serialization
     */
    static get code(): string;
    /** The origin of the command, used to know has it been created from serialization or invoked */
    protected _origin: 'invoked' | 'serialized';
    /** Command execution scope for dependency injection and feature resolution */
    protected _executionScope: A_Scope;
    /** Result data produced by successful command execution */
    protected _result?: ResultType;
    /** Set of errors that occurred during command execution */
    protected _error: A_Error;
    /** Command initialization parameters */
    protected _params: InvokeType;
    /** Current lifecycle status of the command */
    protected _status: A_Command_Status;
    /** Map of event listeners organized by event name */
    protected _listeners: Map<LifecycleEvents | keyof typeof A_CommandEvent, Set<A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>>>;
    /** Timestamp when command execution started */
    protected _startTime?: Date;
    /** Timestamp when command execution ended */
    protected _endTime?: Date;
    /** Timestamp when command was created */
    protected _createdAt: Date;
    /**
     * Total execution duration in milliseconds
     *
     * - If completed/failed: Returns total time from start to end
     * - If currently executing: Returns elapsed time since start
     * - If not started: Returns undefined
     */
    get duration(): number | undefined;
    /**
     * Idle time before execution started in milliseconds
     *
     * Time between command creation and execution start.
     * Useful for monitoring command queue performance.
     */
    get idleTime(): number | undefined;
    /**
     * Command execution scope for dependency injection
     *
     * Provides access to components, services, and shared resources
     * during command execution. Inherits from the scope where the
     * command was registered.
     */
    get scope(): A_Scope;
    /**
     * Execution context associated with the command
     */
    get context(): A_ExecutionContext<A_Command_ExecutionContext<InvokeType, ResultType>>;
    /**
     * Unique command type identifier
     *
     * Derived from the class name and used for:
     * - Command registration and resolution
     * - Serialization and deserialization
     * - Logging and debugging
     *
     * @example 'create-user-command', 'process-order-command'
     */
    get code(): string;
    /**
     * Current lifecycle status of the command
     *
     * Indicates the current phase in the command execution lifecycle.
     * Used to track progress and determine available operations.
     */
    get status(): A_Command_Status;
    /**
     * Timestamp when the command was created
     *
     * Marks the initial instantiation time, useful for tracking
     * command age and queue performance metrics.
     */
    get createdAt(): Date;
    /**
     * Timestamp when command execution started
     *
     * Undefined until execution begins. Used for calculating
     * execution duration and idle time.
     */
    get startedAt(): Date | undefined;
    /**
     * Timestamp when command execution ended
     *
     * Set when command reaches COMPLETED or FAILED status.
     * Used for calculating total execution duration.
     */
    get endedAt(): Date | undefined;
    /**
     * Result data produced by command execution
     *
     * Contains the output data from successful command execution.
     * Undefined until command completes successfully.
     */
    get result(): ResultType | undefined;
    /**
     * Array of errors that occurred during execution
     *
     * Automatically wraps native errors in A_Error instances
     * for consistent error handling. Empty array if no errors occurred.
     */
    get error(): A_Error | undefined;
    /**
     * Command initialization parameters
     *
     * Contains the input data used to create and configure the command.
     * These parameters are immutable during command execution.
                    return new A_Error(err);
                }
            });
    }

    /**
     * Command initialization parameters
     *
     * Contains the input data used to create and configure the command.
     * These parameters are immutable during command execution.
     */
    get params(): InvokeType;
    /**
     * Indicates if the command has been processed (completed or failed)
     *
     * Returns true if the command has completed or failed, false otherwise.
     */
    get isProcessed(): boolean;
    /**
     *
     * A-Command represents an executable command with a specific code and parameters.
     * It can be executed within a given scope and stores execution results and errors.
     *
     *
     * A-Command should be context independent and execution logic should be based on attached components
     *
     * @param code
     * @param params
     */
    constructor(
    /**
     * Command invocation parameters
     */
    params: InvokeType | A_TYPES__Command_Serialized<InvokeType, ResultType> | string);
    protected [A_StateMachineFeatures.onBeforeTransition](transition: A_StateMachineTransition, logger?: A_Logger, ...args: any[]): Promise<void>;
    protected [A_CommandTransitions.CREATED_TO_INITIALIZED](transition: A_StateMachineTransition, ...args: any[]): Promise<void>;
    protected [A_CommandTransitions.INITIALIZED_TO_EXECUTING](transition: A_StateMachineTransition, ...args: any[]): Promise<void>;
    protected [A_CommandTransitions.EXECUTING_TO_COMPLETED](transition: A_StateMachineTransition, ...args: any[]): Promise<void>;
    protected [A_CommandTransitions.EXECUTING_TO_FAILED](transition: A_StateMachineTransition, error: A_Error, ...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onInit](stateMachine: A_StateMachine, ...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onBeforeExecute](stateMachine: A_StateMachine, ...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onExecute](...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onAfterExecute](...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onComplete](stateMachine: A_StateMachine, ...args: any[]): Promise<void>;
    protected [A_CommandFeatures.onFail](stateMachine: A_StateMachine, operation: A_ExecutionContext<A_Command_ExecutionContext<InvokeType, ResultType>>, ...args: any[]): Promise<void>;
    /**
     * Initializes the command before execution.
     */
    init(): Promise<void>;
    /**
     * Executes the command logic.
     */
    execute(): Promise<any>;
    /**
     * Marks the command as completed
     *
     *
     * Calling This method will set the command status to COMPLETED, record the end time,
     * store the result, emit the onComplete event, and destroy the execution scope.
     *
     * [!] After Calling this method, the command is considered fully processed And further processing will be INTERRUPTED.
     * [!] If the command is already processed (COMPLETED or FAILED), this method does nothing.
     * [!] This method can be called with optional result data to store with the command.
     *
     * @param result - Optional result data to store with the command
     */
    complete(result?: ResultType): Promise<void>;
    /**
     * Marks the command as failed
     */
    fail(error?: A_Error): Promise<void>;
    /**
     * Registers an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    on(event: LifecycleEvents | A_CommandEvent, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>): void;
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event: LifecycleEvents | A_CommandEvent, listener: A_TYPES__Command_Listener<InvokeType, ResultType, LifecycleEvents>): void;
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event: LifecycleEvents | keyof typeof A_CommandEvent): void;
    /**
     * Allows to create a Command instance from new data
     *
     * @param newEntity
     */
    fromNew(newEntity: InvokeType): void;
    /**
     * Allows to convert serialized data to Command instance
     *
     * [!] By default it omits params as they are not stored in the serialized data
     *
     * @param serialized
     */
    fromJSON(serialized: A_TYPES__Command_Serialized<InvokeType, ResultType>): void;
    /**
     * Converts the Command instance to a plain object
     *
     * @returns
     */
    toJSON(): A_TYPES__Command_Serialized<InvokeType, ResultType>;
    /**
     * Ensures that the command's execution scope inherits from the context scope
     *
     * Throws an error if the command is not bound to any context scope
     */
    protected checkScopeInheritance(): void;
}

declare class A_CommandError extends A_Error {
    static readonly CommandScopeBindingError = "A-Command Scope Binding Error";
    static readonly ExecutionError = "A-Command Execution Error";
    static readonly ResultProcessingError = "A-Command Result Processing Error";
    /**
     * Error indicating that the command was interrupted during execution
     */
    static readonly CommandInterruptedError = "A-Command Interrupted Error";
}

interface Ifspolyfill {
    readFileSync: (path: string, encoding: string) => string;
    existsSync: (path: string) => boolean;
    createReadStream: (path: string, options?: BufferEncoding) => any;
}
interface IcryptoInterface {
    createTextHash(text: string, algorithm: string): Promise<string>;
    createFileHash(filePath: string, algorithm: string): Promise<string>;
}
interface IhttpInterface {
    request: (options: any, callback?: (res: any) => void) => any;
    get: (url: string | any, callback?: (res: any) => void) => any;
    createServer: (requestListener?: (req: any, res: any) => void) => any;
}
interface IhttpsInterface {
    request: (options: any, callback?: (res: any) => void) => any;
    get: (url: string | any, callback?: (res: any) => void) => any;
    createServer: (options: any, requestListener?: (req: any, res: any) => void) => any;
}
interface IpathInterface {
    join: (...paths: string[]) => string;
    resolve: (...paths: string[]) => string;
    dirname: (path: string) => string;
    basename: (path: string, ext?: string) => string;
    extname: (path: string) => string;
    relative: (from: string, to: string) => string;
    normalize: (path: string) => string;
    isAbsolute: (path: string) => boolean;
    parse: (path: string) => any;
    format: (pathObject: any) => string;
    sep: string;
    delimiter: string;
}
interface IurlInterface {
    parse: (urlString: string) => any;
    format: (urlObject: any) => string;
    resolve: (from: string, to: string) => string;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
}
interface IbufferInterface {
    from: (data: any, encoding?: string) => any;
    alloc: (size: number, fill?: any) => any;
    allocUnsafe: (size: number) => any;
    isBuffer: (obj: any) => boolean;
    concat: (list: any[], totalLength?: number) => any;
}
interface IprocessInterface {
    env: Record<string, string | undefined>;
    argv: string[];
    platform: string;
    version: string;
    versions: Record<string, string>;
    cwd: () => string;
    exit: (code?: number) => never;
    nextTick: (callback: Function, ...args: any[]) => void;
}

declare class A_FSPolyfillClass {
    protected logger: A_Logger;
    private _fs;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<Ifspolyfill>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_CryptoPolyfillClass {
    protected logger: A_Logger;
    private _crypto;
    private _initialized;
    private _fsPolyfill?;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(fsPolyfill?: Ifspolyfill): Promise<IcryptoInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_HttpPolyfillClass {
    protected logger: A_Logger;
    private _http;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IhttpInterface>;
    private init;
    private initServer;
    private initBrowser;
    private createMockRequest;
}

declare class A_HttpsPolyfillClass {
    protected logger: A_Logger;
    private _https;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IhttpsInterface>;
    private init;
    private initServer;
    private initBrowser;
    private createMockRequest;
}

declare class A_PathPolyfillClass {
    protected logger: A_Logger;
    private _path;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IpathInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_UrlPolyfillClass {
    protected logger: A_Logger;
    private _url;
    private _initialized;
    get isInitialized(): boolean;
    constructor(logger: A_Logger);
    get(): Promise<IurlInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_BufferPolyfillClass {
    protected logger: A_Logger;
    private _buffer;
    private _initialized;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IbufferInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_ProcessPolyfillClass {
    protected logger: A_Logger;
    private _process;
    private _initialized;
    get isInitialized(): boolean;
    constructor(logger: A_Logger);
    get(): Promise<IprocessInterface>;
    private init;
    private initServer;
    private initBrowser;
}

declare class A_Polyfill extends A_Component {
    protected logger: A_Logger;
    protected _fsPolyfill: A_FSPolyfillClass;
    protected _cryptoPolyfill: A_CryptoPolyfillClass;
    protected _httpPolyfill: A_HttpPolyfillClass;
    protected _httpsPolyfill: A_HttpsPolyfillClass;
    protected _pathPolyfill: A_PathPolyfillClass;
    protected _urlPolyfill: A_UrlPolyfillClass;
    protected _bufferPolyfill: A_BufferPolyfillClass;
    protected _processPolyfill: A_ProcessPolyfillClass;
    protected _initializing: Promise<void> | null;
    /**
     * Indicates whether the channel is connected
     */
    protected _initialized?: Promise<void>;
    constructor(logger: A_Logger);
    /**
     * Indicates whether the channel is connected
     */
    get ready(): Promise<void>;
    load(): Promise<void>;
    attachToWindow(): Promise<void>;
    protected _loadInternal(): Promise<void>;
    /**
     * Allows to use the 'fs' polyfill methods regardless of the environment
     * This method loads the 'fs' polyfill and returns its instance
     *
     * @returns
     */
    fs(): Promise<Ifspolyfill>;
    /**
     * Allows to use the 'crypto' polyfill methods regardless of the environment
     * This method loads the 'crypto' polyfill and returns its instance
     *
     * @returns
     */
    crypto(): Promise<IcryptoInterface>;
    /**
     * Allows to use the 'http' polyfill methods regardless of the environment
     * This method loads the 'http' polyfill and returns its instance
     *
     * @returns
     */
    http(): Promise<IhttpInterface>;
    /**
     * Allows to use the 'https' polyfill methods regardless of the environment
     * This method loads the 'https' polyfill and returns its instance
     *
     * @returns
     */
    https(): Promise<IhttpsInterface>;
    /**
     * Allows to use the 'path' polyfill methods regardless of the environment
     * This method loads the 'path' polyfill and returns its instance
     *
     * @returns
     */
    path(): Promise<IpathInterface>;
    /**
     * Allows to use the 'url' polyfill methods regardless of the environment
     * This method loads the 'url' polyfill and returns its instance
     *
     * @returns
     */
    url(): Promise<IurlInterface>;
    /**
     * Allows to use the 'buffer' polyfill methods regardless of the environment
     * This method loads the 'buffer' polyfill and returns its instance
     *
     * @returns
     */
    buffer(): Promise<IbufferInterface>;
    /**
     * Allows to use the 'process' polyfill methods regardless of the environment
     * This method loads the 'process' polyfill and returns its instance
     *
     * @returns
     */
    process(): Promise<IprocessInterface>;
}

declare class A_ConfigLoader extends A_Container {
    private reader;
    prepare(polyfill: A_Polyfill): Promise<void>;
}

declare class A_ConfigError extends A_Error {
    static readonly InitializationError = "A-Config Initialization Error";
}

/**
 * Config Reader
 */
declare class ConfigReader extends A_Component {
    protected polyfill: A_Polyfill;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: ("A_CONCEPT_NAME" | "A_CONCEPT_ROOT_SCOPE" | "A_CONCEPT_ENVIRONMENT" | "A_CONCEPT_ROOT_FOLDER" | "A_ERROR_DEFAULT_DESCRIPTION")[];
    constructor(polyfill: A_Polyfill);
    attachContext(container: A_Container, context: A_Scope, config?: A_Config<any>): Promise<void>;
    initialize(config: A_Config): Promise<void>;
    /**
     * Get the configuration property by Name
     * @param property
     */
    resolve<_ReturnType = any>(property: string): _ReturnType;
    /**
     * This method reads the configuration and sets the values to the context
     *
     * @returns
     */
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
    /**
     * Finds the root directory of the project by locating the folder containing package.json
     *
     * @param {string} startPath - The initial directory to start searching from (default is __dirname)
     * @returns {string|null} - The path to the root directory or null if package.json is not found
     */
    protected getProjectRoot(startPath?: string): Promise<string>;
}

declare class ENVConfigReader extends ConfigReader {
    readEnvFile(config: A_Config<A_TYPES__ConceptENVVariables>, polyfill: A_Polyfill, feature: A_Feature): Promise<void>;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_ENV_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

declare class FileConfigReader extends ConfigReader {
    private FileData;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_File_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

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

type A_UTILS_TYPES__Manifest_Init = Array<A_UTILS_TYPES__Manifest_ComponentLevelConfig>;
type A_UTILS_TYPES__Manifest_ComponentLevelConfig<T extends A_Component = A_Component> = {
    /**
     * Component constructor
     */
    component: A_TYPES__Component_Constructor<T>;
    /**
     * Method level configurations for the component
     */
    methods?: Array<A_UTILS_TYPES__Manifest_MethodLevelConfig<T>>;
} & Partial<A_UTILS_TYPES__Manifest_Rules>;
type A_UTILS_TYPES__Manifest_MethodLevelConfig<T extends A_Component = A_Component> = {
    /**
     * Method name from the component provided
     */
    method: string | RegExp;
} & Partial<A_UTILS_TYPES__Manifest_Rules>;
type A_UTILS_TYPES__Manifest_Rules = {
    /**
     * A list of entities to which a component is applied
     *
     * By default is for all
     */
    apply: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp;
    /**
     * A list of entities to which a component is excluded
     */
    exclude: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp;
};
type A_UTILS_TYPES__Manifest_AllowedComponents = A_TYPES__Component_Constructor | A_TYPES__Entity_Constructor | A_TYPES__Fragment_Constructor | A_TYPES__Container_Constructor;
interface A_UTILS_TYPES__ManifestRule {
    componentRegex: RegExp;
    methodRegex: RegExp;
    applyRegex?: RegExp;
    excludeRegex?: RegExp;
}
interface A_UTILS_TYPES__ManifestQuery {
    component: A_TYPES__Component_Constructor;
    method: string;
    target: A_UTILS_TYPES__Manifest_AllowedComponents;
}

/**
 * Fluent API for checking manifest permissions
 */
declare class A_ManifestChecker {
    private manifest;
    private component;
    private method;
    private checkExclusion;
    constructor(manifest: A_Manifest, component: A_TYPES__Component_Constructor, method: string, checkExclusion?: boolean);
    for(target: A_UTILS_TYPES__Manifest_AllowedComponents): boolean;
}

declare class A_Manifest extends A_Fragment {
    private rules;
    /**
     * A-Manifest is a configuration set that allows to include or exclude component application for the particular methods.
     *
     * For example, if A-Scope provides polymorphic A-Component that applies for All A-Entities in it but you have another component that should be used for only One particular Entity, you can use A-Manifest to specify this behavior.
     *
     *
     * By default if Component is provided in the scope - it applies for all entities in it. However, if you want to exclude some entities or include only some entities for the particular component - you can use A-Manifest to define this behavior.
     *
     * @param config - Array of component configurations
     */
    constructor(config?: A_UTILS_TYPES__Manifest_Init);
    /**
     * Should convert received configuration into internal Regexp applicable for internal storage
     */
    protected prepare(config: A_UTILS_TYPES__Manifest_Init): void;
    /**
     * Process a single configuration item and convert it to internal rules
     */
    private processConfigItem;
    /**
     * Convert a constructor to a regex pattern
     */
    private constructorToRegex;
    /**
     * Convert a method name or regex to a regex pattern
     */
    private methodToRegex;
    /**
     * Convert allowed components array or regex to a single regex
     */
    private allowedComponentsToRegex;
    /**
     * Escape special regex characters in a string
     */
    private escapeRegex;
    protected configItemToRegexp(item: A_TYPES__Component_Constructor): RegExp;
    protected ID(component: A_TYPES__Component_Constructor, method: string): string;
    /**
     * Check if a component and method combination is allowed for a target
     */
    isAllowed<T extends A_Component>(ctor: T | A_TYPES__Component_Constructor<T>, method: string): A_ManifestChecker;
    /**
     * Internal method to check if access is allowed
     */
    internal_checkAccess(query: A_UTILS_TYPES__ManifestQuery): boolean;
    isExcluded<T extends A_Component>(ctor: T | A_TYPES__Component_Constructor<T>, method: string): A_ManifestChecker;
}

declare class A_ManifestError extends A_Error {
    static readonly ManifestInitializationError = "A-Manifest Initialization Error";
}

declare enum A_MemoryFeatures {
    /**
     * Allows to extend initialization logic and behavior
     */
    onInit = "_A_Memory_onInit",
    /**
     * Allows to extend destruction logic and behavior
     */
    onDestroy = "_A_Memory_onDestroy",
    /**
     * Allows to extend expiration logic and behavior
     */
    onExpire = "_A_Memory_onExpire",
    /**
     * Allows to extend error handling logic and behavior
     */
    onError = "_A_Memory_onError",
    /**
     * Allows to extend serialization logic and behavior
     */
    onSerialize = "_A_Memory_onSerialize",
    /**
     * Allows to extend set operation logic and behavior
     */
    onSet = "_A_Memory_onSet",
    /**
     * Allows to extend get operation logic and behavior
     */
    onGet = "_A_Memory_onGet",
    /**
     * Allows to extend drop operation logic and behavior
     */
    onDrop = "_A_Memory_onDrop",
    /**
     * Allows to extend clear operation logic and behavior
     */
    onClear = "_A_Memory_onClear",
    /**
     * Allows to extend has operation logic and behavior
     */
    onHas = "_A_Memory_onHas"
}

declare class A_MemoryContext<_MemoryType extends Record<string, any> = Record<string, any>, _SerializedType extends A_TYPES__Fragment_Serialized = A_TYPES__Fragment_Serialized> extends A_Fragment {
    protected _storage: Map<keyof _MemoryType, _MemoryType[keyof _MemoryType]>;
    set<K extends keyof _MemoryType>(param: K, value: _MemoryType[K]): void;
    get<K extends keyof _MemoryType>(param: K): _MemoryType[K] | undefined;
    delete<K extends keyof _MemoryType>(param: K): void;
    has<K extends keyof _MemoryType>(param: K): boolean;
    clear(): void;
}

type A_MemoryContextMeta<T extends Record<string, any> = Record<string, any>> = Omit<T, 'error'> & {
    error?: A_Error;
};
type A_Memory_Storage = Record<string, any> & {
    error?: A_Error;
};
type A_MemoryOperations = 'get' | 'set' | 'drop' | 'clear' | 'has' | 'serialize';
type A_MemoryOperationContext<T extends any = any> = A_OperationContext<A_MemoryOperations, {
    key: string;
    value?: any;
}, T>;
type A_MemoryOperationContextMeta<T extends any = any, I extends any = any> = {
    result: T;
    operation: A_MemoryOperations;
    key: string;
    value?: I;
};

declare class A_Memory<_StorageType extends Record<string, any> = Record<string, any>, _SerializedType extends Record<string, any> = Record<string, any>> extends A_Component {
    protected _ready?: Promise<void>;
    get ready(): Promise<void>;
    [A_MemoryFeatures.onError](...args: any[]): Promise<void>;
    [A_MemoryFeatures.onExpire](...args: any[]): Promise<void>;
    [A_MemoryFeatures.onInit](context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onDestroy](context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    /**
     * Handles the 'get' operation for retrieving a value from memory
     */
    [A_MemoryFeatures.onGet](operation: A_MemoryOperationContext, context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onHas](operation: A_MemoryOperationContext<boolean>, context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onSet](operation: A_MemoryOperationContext, context: A_MemoryContext<_StorageType>, scope: A_Scope, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onDrop](operation: A_MemoryOperationContext, context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    [A_MemoryFeatures.onClear](operation: A_MemoryOperationContext, context: A_MemoryContext<_StorageType>, ...args: any[]): Promise<void>;
    /**
     * Initializes the memory context
     */
    init(): Promise<void>;
    /**
     * Destroys the memory context
     *
     * This method is responsible for cleaning up any resources
     * used by the memory context and resetting its state.
     */
    destroy(): Promise<void>;
    /**
      * Retrieves a value from the context memory
      *
      * @param key - memory key to retrieve
      * @returns - value associated with the key or undefined if not found
      */
    get<K extends keyof _StorageType>(
    /**
     * Key to retrieve the value for
     */
    key: K): Promise<_StorageType[K] | undefined>;
    /**
     * Checks if a value exists in the context memory
     *
     * @param key - memory key to check
     * @returns - true if key exists, false otherwise
     */
    has(key: keyof _StorageType): Promise<boolean>;
    /**
     * Saves a value in the context memory
     *
     * @param key
     * @param value
     */
    set<K extends keyof _StorageType>(
    /**
     * Key to save the value under
     */
    key: K, 
    /**
     * Value to save
     */
    value: _StorageType[K]): Promise<void>;
    /**
     * Removes a value from the context memory by key
     *
     * @param key
     */
    drop(key: keyof _StorageType): Promise<void>;
    /**
     * Clears all stored values in the context memory
     */
    clear(): Promise<void>;
    /**
     * Serializes the memory context to a JSON object
     *
     * @returns - serialized memory object
     */
    toJSON(): Promise<_SerializedType>;
}

declare class A_MemoryError extends A_Error {
    static readonly MemoryInitializationError = "Memory initialization error";
    static readonly MemoryDestructionError = "Memory destruction error";
    static readonly MemoryGetError = "Memory GET operation failed";
    static readonly MemorySetError = "Memory SET operation failed";
    static readonly MemoryDropError = "Memory DROP operation failed";
    static readonly MemoryClearError = "Memory CLEAR operation failed";
    static readonly MemoryHasError = "Memory HAS operation failed";
    static readonly MemorySerializeError = "Memory toJSON operation failed";
}

declare enum A_ServiceFeatures {
    onBeforeLoad = "_A_Service_onBeforeLoad",
    onLoad = "_A_Service_onLoad",
    onAfterLoad = "_A_Service_onAfterLoad",
    onBeforeStart = "_A_Service_onBeforeStart",
    onStart = "_A_Service_onStart",
    onAfterStart = "_A_Service_onAfterStart",
    onBeforeStop = "_A_Service_onBeforeStop",
    onStop = "_A_Service_onStop",
    onAfterStop = "_A_Service_onAfterStop",
    onError = "_A_Service_onError"
}

/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 *
 */
declare class A_Service extends A_Container {
    load(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    protected [A_ServiceFeatures.onBeforeLoad](polyfill: A_Polyfill, ...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onLoad](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onAfterLoad](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onBeforeStart](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onStart](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onAfterStart](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onBeforeStop](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onStop](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onAfterStop](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onError](error: A_Error, logger?: A_Logger, ...args: any[]): Promise<void>;
}

declare class A_Route<_TParams extends Record<string, any> = Record<string, any>, _TQuery extends Record<string, any> = Record<string, any>> extends A_Fragment {
    url: string;
    constructor(url: string | RegExp);
    /**
     * Returns path only without query and hash
     */
    get path(): string;
    /**
     * Returns array of parameter names in the route path
     */
    get params(): string[];
    /**
     * Returns protocol based on URL scheme
     */
    get protocol(): string;
    extractParams(url: string): _TParams;
    extractQuery(url: string): _TQuery;
    toString(): string;
    toRegExp(): RegExp;
    toAFeatureExtension(extensionScope?: Array<string>): RegExp;
}

type A_SignalConfig_Init = {
    /**
     * An array defining the structure of the signal vector.
     *
     * Each entry corresponds to a signal component constructor.
     */
    structure?: Array<A_TYPES__Entity_Constructor<A_Signal>>;
    /**
     * A string representation of the structure for easier DI resolution.
     * Each signal's constructor name is used to form this string.
     * e.g. "['A_RouterWatcher', 'A_ScopeWatcher', 'A_LoggerWatcher']"
     * OR "A_RouterWatcher,A_ScopeWatcher,A_LoggerWatcher"
     */
    stringStructure?: string;
    propagateSignals?: boolean;
};
type A_SignalVector_Init<_TSignals extends Array<A_Signal> = Array<A_Signal>, _TVectorStructure extends Array<A_TYPES__Entity_Constructor<_TSignals[number]>> = Array<A_TYPES__Entity_Constructor<_TSignals[number]>>> = {
    structure: _TVectorStructure;
    values: _TSignals;
};
type A_SignalVector_Serialized = A_TYPES__Entity_Serialized & {
    structure: string[];
    values: Array<Record<string, any>>;
} & A_TYPES__Entity_Serialized;
type A_Signal_Init<T extends Record<string, any> = Record<string, any>> = {
    /**
     * The signal name
     */
    name?: string;
    /**
     * The signal data
     */
    data: T;
};
type A_Signal_Serialized<T extends Record<string, any> = Record<string, any>> = {
    /**
     * The signal data
     */
    data: T;
} & A_TYPES__Entity_Serialized;

/**
 * A Signal Entity is an individual signal instance that carries data.
 * Signals is a event types that uses for vectors of signals to be used for further processing.
 *
 * Comparing to standard events, signals should be used in case when the event impacts some "state"
 * and the state should be used instead of the event itself.
 *
 * For example, a signal can represent the current status of a user (online/offline/away),
 * while an event would represent a single action (user logged in/logged out).
 *
 * Signals are typically used in scenarios where the current state is more important than individual events,
 * such as monitoring systems, real-time dashboards, or stateful applications.
 */
declare class A_Signal<_TSignalDataType extends Record<string, any> = Record<string, any>> extends A_Entity<A_Signal_Init<_TSignalDataType>, A_Signal_Serialized<_TSignalDataType>> {
    data: _TSignalDataType;
    /**
     * Allows to define default data for the signal.
     *
     * If no data is provided during initialization, the default data will be used.
     *
     * @returns
     */
    static default(): Promise<A_Signal | undefined>;
    fromJSON(serializedEntity: A_Signal_Serialized<_TSignalDataType>): void;
    fromNew(newEntity: A_Signal_Init<_TSignalDataType>): void;
    toJSON(): A_Signal_Serialized<_TSignalDataType>;
}

/**
 * A Signal Vector Entity is a collection of signals structured in a specific way.
 * It allows grouping multiple signals together for batch processing or transmission.
 *
 * Signal Vectors are useful in scenarios where multiple related signals need to be handled together,
 * as a state of the system or a snapshot of various parameters at a given time.
 *
 * @template TSignalsConstructors - Array of signal constructor types (e.g., [typeof MySignal, typeof CustomSignal])
 * @template TSignals - Array of signal instances derived from constructors
 */
declare class A_SignalVector<TSignals extends Array<A_Signal> = Array<A_Signal>, TSignalsConstructors extends Array<A_TYPES__Entity_Constructor<A_Signal>> = TSignals extends Array<infer U> ? U extends A_Signal ? A_TYPES__Entity_Constructor<U>[] : never : never> extends A_Entity<A_SignalVector_Init<TSignals[number][], TSignalsConstructors>, A_SignalVector_Serialized> {
    /**
     * The structure of the signal vector, defining the types of signals it contains.
     *
     * For example:
     * [UserSignInSignal, UserStatusSignal, UserActivitySignal]
     *
     * [!] if not provided, it will be derived from the signals values.
     */
    protected _structure?: TSignalsConstructors;
    /**
     * It's actual vector Values of Signals like :
     * [UserActionSignal, UserMousePositionSignal, ExternalDependencySignal]
     */
    protected _signals: TSignals[number][];
    fromNew(newEntity: A_SignalVector_Init<TSignals[number][], TSignalsConstructors>): void;
    /**
     * The structure of the signal vector, defining the types of signals it contains.
     *
     * For example:
     * [UserSignInSignal, UserStatusSignal, UserActivitySignal]
     *
     */
    get structure(): TSignalsConstructors;
    get length(): number;
    /**
     * Enables iteration over the signals in the vector.
     *
     * @returns
     */
    [Symbol.iterator](): Iterator<TSignals[number]>;
    /**
     * Checks if the vector contains a signal of the specified type.
     *
     * @param signal
     */
    has(signal: A_Signal): boolean;
    has(signalConstructor: A_TYPES__Component_Constructor<A_Signal>): boolean;
    /**
     * Retrieves the signal of the specified type from the vector.
     *
     * @param signal
     */
    get<T extends A_Signal>(signal: T): T | undefined;
    get<T extends A_Signal>(signalConstructor: A_TYPES__Entity_Constructor<T>): T | undefined;
    /**
     * Converts to Array of values of signals in the vector
     * Maintains the order specified in the structure/generic type
     *
     * @param structure - Optional structure to override the default ordering
     * @returns Array of signal instances in the specified order
     */
    toVector<T extends Array<A_Signal> = TSignals>(structure?: {
        [K in keyof T]: T[K] extends A_Signal ? A_TYPES__Entity_Constructor<T[K]> : never;
    }): Promise<{
        [K in keyof T]: T[K];
    }>;
    /**
     * Converts to Array of data of signals in the vector
     * Maintains the order specified in the structure/generic type
     *
     * @param structure - Optional structure to override the default ordering
     * @returns Array of serialized signal data in the specified order
     */
    toDataVector<T extends Array<A_Signal> = TSignals>(structure?: {
        [K in keyof T]: T[K] extends A_Signal ? A_TYPES__Entity_Constructor<T[K]> : never;
    }): Promise<{
        [K in keyof T]: T[K] extends A_Signal<infer D> ? D | undefined : never;
    }>;
    /**
     * Converts to Object with signal constructor names as keys and their corresponding data values
     * Uses the structure ordering to ensure consistent key ordering
     *
     * @returns Object with signal constructor names as keys and signal data as values
     */
    toObject<T extends Array<A_Signal> = TSignals>(structure?: {
        [K in keyof T]: T[K] extends A_Signal ? A_TYPES__Entity_Constructor<T[K]> : never;
    }): Promise<{
        [key: string]: T[number] extends A_Signal<infer D> ? D | undefined : never;
    }>;
    /**
     * Serializes the Signal Vector to a JSON-compatible format.
     *
     *
     * @returns
     */
    toJSON(): A_SignalVector_Serialized;
}

/**
 * A_SignalState manages the latest state of all signals within a given scope.
 *
 * This class maintains a mapping between signal constructors and their most recently emitted values,
 * providing a centralized state store for signal management within an application context.
 *
 * @template TSignalData - Union type of all possible signal data types that can be stored (must extend Record<string, any>)
 *
 * The generic ensures type safety by maintaining correspondence between:
 * - Signal constructor types and their data types
 * - Signal instances and their emitted value types
 * - Vector structure and the data it contains
 */
declare class A_SignalState<TSignalData extends Record<string, any> = Record<string, any>> extends A_Fragment {
    /**
     * Internal map storing the relationship between signal constructors and their latest values
     * Key: Signal constructor function
     * Value: Latest emitted data from that signal type
     */
    protected _state: Map<A_TYPES__Component_Constructor<A_Signal>, A_Signal>;
    /**
     * Previous state map to track changes between signal emissions
     * Key: Signal constructor function
     * Value: Previous emitted data from that signal type
     */
    protected _prevState: Map<A_TYPES__Component_Constructor<A_Signal>, A_Signal>;
    /**
     * Optional structure defining the ordered list of signal constructors
     * Used for vector operations and initialization
     */
    protected _structure: Array<A_TYPES__Component_Constructor<A_Signal>>;
    /**
     * Gets the ordered structure of signal constructors
     * @returns Array of signal constructors in their defined order
     */
    get structure(): Array<A_TYPES__Component_Constructor<A_Signal>>;
    /**
     * Creates a new A_SignalState instance
     *
     * @param structure - Optional array defining the ordered structure of signal constructors
     *                   This structure is used for vector operations and determines the order
     *                   in which signals are processed and serialized
     */
    constructor(structure: A_TYPES__Component_Constructor<A_Signal>[]);
    /**
     * Sets the latest value for a specific signal type
     *
     * @param signal - The signal constructor to associate the value with
     * @param value - The data value emitted by the signal
     */
    set(signal: A_Signal, value: A_Signal): void;
    set(signal: A_Signal): void;
    set(signal: A_TYPES__Component_Constructor<A_Signal>, value: A_Signal): void;
    /**
     * Retrieves the latest value for a specific signal type
     *
     * @param signal - The signal constructor to get the value for
     * @returns The latest data value or undefined if no value has been set
     */
    get(signal: A_Signal): A_Signal | undefined;
    get(signal: A_TYPES__Component_Constructor<A_Signal>): A_Signal | undefined;
    /**
     * Retrieves the previous value for a specific signal type
     *
     * @param signal
     */
    getPrev(signal: A_Signal): A_Signal | undefined;
    getPrev(signal: A_TYPES__Component_Constructor<A_Signal>): A_Signal | undefined;
    /**
     * Checks if a signal type has been registered in the state
     *
     * @param signal - The signal constructor to check for
     * @returns True if the signal type exists in the state map
     */
    has(signal: A_Signal): boolean;
    has(signal: A_TYPES__Component_Constructor<A_Signal>): boolean;
    /**
     * Removes a signal type and its associated value from the state
     *
     * @param signal - The signal constructor to remove
     * @returns True if the signal was successfully deleted, false if it didn't exist
     */
    delete(signal: A_Signal): boolean;
    delete(signal: A_TYPES__Component_Constructor<A_Signal>): boolean;
    /**
     * Converts the current state to a vector (ordered array) format
     *
     * The order is determined by the structure array provided during construction.
     * Each position in the vector corresponds to a specific signal type's latest value.
     *
     * @returns Array of signal values in the order defined by the structure
     * @throws Error if structure is not defined or if any signal value is undefined
     */
    toVector(): A_SignalVector;
    /**
     * Converts the current state to an object with signal constructor names as keys
     *
     * This provides a more readable representation of the state where each signal
     * type is identified by its constructor name.
     *
     * @returns Object mapping signal constructor names to their latest values
     * @throws Error if any signal value is undefined
     */
    toObject(): Record<string, A_Signal>;
}

/**
 * This component should dictate a structure of the vector for all signals within a given scope.
 * so if there're multiple signals it should say what type at what position should be expected.
 *
 * e.g. [A_RouterWatcher, A_ScopeWatcher, A_LoggerWatcher]
 * This structure then should be used for any further processing of signals within the scope.
 */
declare class A_SignalConfig extends A_Fragment {
    protected _structure?: Array<A_TYPES__Entity_Constructor<A_Signal>>;
    protected _config: A_SignalConfig_Init;
    protected _ready?: Promise<void>;
    get structure(): Array<A_TYPES__Entity_Constructor<A_Signal>>;
    /**
     * Uses for synchronization to ensure the config is initialized.
     *
     * @returns True if the configuration has been initialized.
     */
    get ready(): Promise<void> | undefined;
    constructor(params: A_SignalConfig_Init);
    /**
     * Initializes the signal configuration if not already initialized.
     *
     * @returns
     */
    initialize(): Promise<void>;
    /**
     * Initializes the signal configuration by processing the provided structure or string representation.
     * This method sets up the internal structure of signal constructors based on the configuration.
     */
    protected _initialize(): Promise<void>;
}

declare enum A_SignalBusFeatures {
    onBeforeNext = "_A_SignalBusFeatures_onBeforeNext",
    onNext = "_A_SignalBusFeatures_onNext",
    onError = "_A_SignalBusFeatures_onError"
}

/**
 * This component should listen for all available signal watchers components in this and all parent scopes.
 * When a signal is emitted, it should forward the signal to all registered watchers.
 *
 * A_SignalBus should always return the same vector structure of the signals, and that's why it should store the state of the latest behavior.
 * For example if there are 3 watchers registered, the bus should always return a vector of 3 elements, based on the A_SignalConfig structure.
 *
 *
 * The component itself is stateless and all methods uses only parameters (context) is provided with.
 */
declare class A_SignalBus extends A_Component {
    next(...signals: A_Signal[]): Promise<void>;
    protected [A_SignalBusFeatures.onError](error: A_Error, logger?: A_Logger, ...args: any[]): Promise<void>;
    [A_SignalBusFeatures.onBeforeNext](scope: A_Scope, globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>, state?: A_SignalState, logger?: A_Logger, config?: A_SignalConfig): Promise<void>;
    /**
     * This methods extends A-Signal Emit feature to handle signal emission within the bus.
     *
     * It updates the signal state and emits the updated signal vector.
     *
     * @param signal
     * @param globalConfig
     * @param logger
     * @param state
     * @param config
     * @returns
     */
    [A_SignalBusFeatures.onNext](scope: A_Scope, state: A_SignalState, globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>, logger?: A_Logger, config?: A_SignalConfig): Promise<void>;
}

declare class A_SignalBusError extends A_Error {
    static readonly SignalProcessingError = "Signal processing error";
}

type A_UTILS_TYPES__ScheduleObjectConfig = {
    /**
     * If the timeout is cleared, should the promise resolve or reject?
     * BY Default it rejects
     *
     * !!!NOTE: If the property is set to true, the promise will resolve with undefined
     */
    resolveOnClear: boolean;
};
type A_UTILS_TYPES__ScheduleObjectCallback<T> = () => Promise<T>;

declare class A_ScheduleObject<T extends any = any> {
    private timeout;
    private deferred;
    private config;
    /**
     * Creates a scheduled object that will execute the action after specified milliseconds
     *
     *
     * @param ms - milliseconds to wait before executing the action
     * @param action - the action to execute
     * @param config - configuration options for the schedule object
     */
    constructor(
    /**
     * Milliseconds to wait before executing the action
     */
    ms: number, 
    /**
     * The action to execute after the specified milliseconds
     */
    action: A_UTILS_TYPES__ScheduleObjectCallback<T>, 
    /**
     * Configuration options for the schedule object
     */
    config?: A_UTILS_TYPES__ScheduleObjectConfig);
    get promise(): Promise<T>;
    clear(): void;
}

declare class A_Schedule extends A_Component {
    /**
     * Allows to schedule a callback for particular time in the future
     *
     * @param timestamp - Unix timestamp in milliseconds
     * @param callback - The callback to execute
     * @returns A promise that resolves to the schedule object
     */
    schedule<T extends any = any>(
    /**
     * Unix timestamp in milliseconds
     */
    timestamp: number, 
    /**
     * The callback to execute
     */
    callback: A_UTILS_TYPES__ScheduleObjectCallback<T>, 
    /**
     * Configuration options for the schedule object
     */
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
    schedule<T extends any = any>(
    /**
     * ISO date string representing the date and time to schedule the callback for
     */
    date: string, 
    /**
     * The callback to execute
     */
    callback: A_UTILS_TYPES__ScheduleObjectCallback<T>, 
    /**
    * Configuration options for the schedule object
    */
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
    /**
     * Allows to execute callback after particular delay in milliseconds
     * So the callback will be executed after the specified delay
     *
     * @param ms
     */
    delay<T extends any = any>(
    /**
     * Delay in milliseconds
     */
    ms: number, 
    /**
     * The callback to execute after the delay
     */
    callback: A_UTILS_TYPES__ScheduleObjectCallback<T>, 
    /**
    * Configuration options for the schedule object
    */
    config?: A_UTILS_TYPES__ScheduleObjectConfig): Promise<A_ScheduleObject<T>>;
}

declare class A_Deferred<T> {
    promise: Promise<T>;
    private resolveFn;
    private rejectFn;
    /**
     * Creates a deferred promise
     * @returns A promise that can be resolved or rejected later
     */
    constructor();
    resolve(value: T | PromiseLike<T>): void;
    reject(reason?: any): void;
}

declare class A_StateMachineError extends A_Error {
    static readonly InitializationError = "A-StateMachine Initialization Error";
    static readonly TransitionError = "A-StateMachine Transition Error";
}

export { A_CONSTANTS__CONFIG_ENV_VARIABLES, A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY, A_Channel, A_ChannelError, A_ChannelFeatures, A_ChannelRequest, A_ChannelRequestStatuses, A_Command, A_CommandError, A_CommandEvent, type A_CommandEvents, A_CommandFeatures, A_CommandTransitions, type A_Command_ExecutionContext, A_Command_Status, A_Config, A_ConfigError, A_ConfigLoader, A_Deferred, A_ExecutionContext, A_LOGGER_ANSI, A_LOGGER_COLORS, A_LOGGER_DEFAULT_LEVEL, A_LOGGER_DEFAULT_SCOPE_LENGTH, A_LOGGER_ENV_KEYS, A_LOGGER_FORMAT, A_LOGGER_SAFE_RANDOM_COLORS, A_LOGGER_TERMINAL, A_LOGGER_TIME_FORMAT, A_Logger, type A_LoggerColorName, A_LoggerEnvVariables, A_LoggerEnvVariablesArray, type A_LoggerEnvVariablesType, type A_LoggerLevel, A_Manifest, A_ManifestChecker, A_ManifestError, A_Memory, A_MemoryContext, type A_MemoryContextMeta, A_MemoryError, A_MemoryFeatures, type A_MemoryOperationContext, type A_MemoryOperationContextMeta, type A_MemoryOperations, type A_Memory_Storage, A_OperationContext, type A_Operation_Serialized, type A_Operation_Storage, A_Polyfill, A_Route, A_Schedule, A_ScheduleObject, A_Service, A_ServiceFeatures, A_Signal, A_SignalBus, A_SignalBusError, A_SignalBusFeatures, A_SignalConfig, type A_SignalConfig_Init, A_SignalState, A_SignalVector, type A_SignalVector_Init, type A_SignalVector_Serialized, type A_Signal_Init, type A_Signal_Serialized, A_StateMachine, A_StateMachineError, A_StateMachineFeatures, A_StateMachineTransition, type A_StateMachineTransitionParams, type A_StateMachineTransitionStorage, type A_TYPES__Command_Constructor, type A_TYPES__Command_Init, type A_TYPES__Command_Listener, type A_TYPES__Command_Serialized, type A_TYPES__ConfigContainerConstructor, type A_TYPES__ConfigENVVariables, A_TYPES__ConfigFeature, type A_UTILS_TYPES__ManifestQuery, type A_UTILS_TYPES__ManifestRule, type A_UTILS_TYPES__Manifest_AllowedComponents, type A_UTILS_TYPES__Manifest_ComponentLevelConfig, type A_UTILS_TYPES__Manifest_Init, type A_UTILS_TYPES__Manifest_MethodLevelConfig, type A_UTILS_TYPES__Manifest_Rules, type A_UTILS_TYPES__ScheduleObjectCallback, type A_UTILS_TYPES__ScheduleObjectConfig, ConfigReader, ENVConfigReader, FileConfigReader, type IbufferInterface, type IcryptoInterface, type Ifspolyfill, type IhttpInterface, type IhttpsInterface, type IpathInterface, type IprocessInterface, type IurlInterface };
