import { A_Component } from '@adaas/a-concept';
import { A_OperationContext } from '../A-Operation/A-Operation.context.mjs';
import { A_ChannelRequest } from './A-ChannelRequest.context.mjs';
import '../A-Operation/A-Operation.types.mjs';
import '../A-Execution/A-Execution.context.mjs';
import './A-Channel.constants.mjs';

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

export { A_Channel };
