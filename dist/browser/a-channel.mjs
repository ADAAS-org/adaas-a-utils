import { A_OperationContext } from './chunk-72ANHWNG.mjs';
import './chunk-TQ5UON22.mjs';
import { __decorateClass } from './chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Error, A_TypeGuards, A_Component, A_Scope, A_IdentityHelper, A_Context } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

var A_ChannelError = class extends A_Error {
  /**
   * Channel Error allows to keep track of errors within a channel if something goes wrong
   * 
   * 
   * @param originalError 
   * @param context 
   */
  constructor(originalError, context) {
    if (A_TypeGuards.isString(context))
      super(originalError, context);
    else
      super(originalError);
    if (context instanceof A_OperationContext)
      this._context = context;
  }
  /***
   * Returns Context of the error
   */
  get context() {
    return this._context;
  }
};
// ==========================================================
// ==================== Error Types =========================
// ==========================================================
A_ChannelError.MethodNotImplemented = "A-Channel Method Not Implemented";

// src/lib/A-Channel/A-Channel.constants.ts
var A_ChannelFeatures = /* @__PURE__ */ ((A_ChannelFeatures2) => {
  A_ChannelFeatures2["onTimeout"] = "_A_Channel_onTimeout";
  A_ChannelFeatures2["onRetry"] = "_A_Channel_onRetry";
  A_ChannelFeatures2["onCircuitBreakerOpen"] = "_A_Channel_onCircuitBreakerOpen";
  A_ChannelFeatures2["onCache"] = "_A_Channel_onCache";
  A_ChannelFeatures2["onConnect"] = "_A_Channel_onConnect";
  A_ChannelFeatures2["onDisconnect"] = "_A_Channel_onDisconnect";
  A_ChannelFeatures2["onBeforeRequest"] = "_A_Channel_onBeforeRequest";
  A_ChannelFeatures2["onRequest"] = "_A_Channel_onRequest";
  A_ChannelFeatures2["onAfterRequest"] = "_A_Channel_onAfterRequest";
  A_ChannelFeatures2["onError"] = "_A_Channel_onError";
  A_ChannelFeatures2["onSend"] = "_A_Channel_onSend";
  A_ChannelFeatures2["onConsume"] = "_A_Channel_onConsume";
  return A_ChannelFeatures2;
})(A_ChannelFeatures || {});
var A_ChannelRequestStatuses = /* @__PURE__ */ ((A_ChannelRequestStatuses2) => {
  A_ChannelRequestStatuses2["PENDING"] = "PENDING";
  A_ChannelRequestStatuses2["SUCCESS"] = "SUCCESS";
  A_ChannelRequestStatuses2["FAILED"] = "FAILED";
  return A_ChannelRequestStatuses2;
})(A_ChannelRequestStatuses || {});
var A_ChannelRequest = class extends A_OperationContext {
  constructor(params) {
    super("request", params);
  }
  get status() {
    return this.result?.status;
  }
  get data() {
    return this.result?.data;
  }
  succeed(result) {
    const existed = this.result;
    super.succeed({
      ...existed,
      data: result,
      status: "SUCCESS" /* SUCCESS */
    });
  }
};
A_ChannelRequest = __decorateClass([
  A_Frame.Fragment({
    name: "A-ChannelRequest",
    description: "Context for managing channel requests. It encapsulates the request parameters and the result including status and data."
  })
], A_ChannelRequest);
var A_Channel = class extends A_Component {
  /**
   * Creates a new A_Channel instance.
   * 
   * The channel must be registered with A_Context before use:
   * ```typescript
   * const channel = new A_Channel();
   * A_Context.root.register(channel);
   * ```
   */
  constructor() {
    super();
    /**
     * Indicates whether the channel is currently processing requests.
     * This flag is managed automatically during request/send operations.
     * 
     * @readonly
     */
    this._processing = false;
    /**
     * Internal cache storage for channel-specific data.
     * Can be used by custom implementations for caching responses,
     * connection pools, or other channel-specific state.
     * 
     * @protected
     */
    this._cache = /* @__PURE__ */ new Map();
  }
  /**
   * Indicates whether the channel is currently processing requests.
   * 
   * @returns {boolean} True if channel is processing, false otherwise
   */
  get processing() {
    return this._processing;
  }
  /**
   * Promise that resolves when the channel is fully initialized.
   * 
   * Automatically calls the onConnect lifecycle hook if not already called.
   * This ensures the channel is ready for communication operations.
   * 
   * @returns {Promise<void>} Promise that resolves when initialization is complete
   */
  get initialize() {
    if (!this._initialized) {
      this._initialized = this.connect();
    }
    return this._initialized;
  }
  async onConnect(...args) {
  }
  async onDisconnect(...args) {
  }
  async onBeforeRequest(...args) {
  }
  async onRequest(...args) {
  }
  async onAfterRequest(...args) {
  }
  async onError(...args) {
  }
  async onSend(...args) {
  }
  // ==========================================================
  // ================= Public API Methods ===================
  // ==========================================================
  /**
   * Initializes the channel by calling the onConnect lifecycle hook.
   * 
   * This method is called automatically when accessing the `initialize` property.
   * You can also call it manually if needed.
   * 
   * @returns {Promise<void>} Promise that resolves when connection is established
   */
  async connect() {
    await this.call("_A_Channel_onConnect" /* onConnect */);
  }
  /**
   * Disconnects the channel by calling the onDisconnect lifecycle hook.
   * 
   * Use this method to properly cleanup resources when the channel is no longer needed.
   * 
   * @returns {Promise<void>} Promise that resolves when cleanup is complete
   */
  async disconnect() {
    await this.call("_A_Channel_onDisconnect" /* onDisconnect */);
  }
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
  async request(params) {
    await this.initialize;
    this._processing = true;
    const requestScope = new A_Scope({
      name: `a-channel@scope:request:${A_IdentityHelper.generateTimeId()}`
    }).inherit(A_Context.scope(this));
    const context = new A_ChannelRequest(params);
    try {
      requestScope.register(context);
      await this.call("_A_Channel_onBeforeRequest" /* onBeforeRequest */, requestScope);
      await this.call("_A_Channel_onRequest" /* onRequest */, requestScope);
      await this.call("_A_Channel_onAfterRequest" /* onAfterRequest */, requestScope);
      this._processing = false;
      return context;
    } catch (error) {
      this._processing = false;
      const channelError = new A_ChannelError(error);
      context.fail(channelError);
      requestScope.register(channelError);
      await this.call("_A_Channel_onError" /* onError */, requestScope);
      requestScope.destroy();
      throw channelError;
    }
  }
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
  async send(message) {
    await this.initialize;
    this._processing = true;
    const requestScope = new A_Scope({
      name: `a-channel@scope:send:${A_IdentityHelper.generateTimeId()}`
    }).inherit(A_Context.scope(this));
    const context = new A_OperationContext("send", message);
    try {
      requestScope.inherit(A_Context.scope(this));
      requestScope.register(context);
      await this.call("_A_Channel_onSend" /* onSend */, requestScope);
      this._processing = false;
    } catch (error) {
      this._processing = false;
      const channelError = new A_ChannelError(error);
      requestScope.register(channelError);
      context.fail(channelError);
      await this.call("_A_Channel_onError" /* onError */, requestScope);
      requestScope.destroy();
    }
  }
  /**
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use request() or send() methods instead depending on your communication pattern.
   * 
   * For request/response pattern: Use request()
   * For fire-and-forget pattern: Use send()
   * For consumer patterns: Implement custom consumer logic using request() in a loop
   */
  async consume() {
    await this.initialize;
    this._processing = true;
    const requestScope = new A_Scope({ name: `a-channel@scope:consume:${A_IdentityHelper.generateTimeId()}` }).inherit(A_Context.scope(this));
    const context = new A_OperationContext("consume", {});
    try {
      requestScope.inherit(A_Context.scope(this));
      requestScope.register(context);
      await this.call("_A_Channel_onConsume" /* onConsume */, requestScope);
      this._processing = false;
      return context;
    } catch (error) {
      this._processing = false;
      const channelError = new A_ChannelError(error);
      context.fail(channelError);
      await this.call("_A_Channel_onError" /* onError */, requestScope);
      return context;
    }
  }
};
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onConnect" /* onConnect */
  })
], A_Channel.prototype, "onConnect", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onDisconnect" /* onDisconnect */
  })
], A_Channel.prototype, "onDisconnect", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onBeforeRequest" /* onBeforeRequest */
  })
], A_Channel.prototype, "onBeforeRequest", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onRequest" /* onRequest */
  })
], A_Channel.prototype, "onRequest", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onAfterRequest" /* onAfterRequest */
  })
], A_Channel.prototype, "onAfterRequest", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onError" /* onError */
  })
], A_Channel.prototype, "onError", 1);
__decorateClass([
  A_Feature.Extend({
    name: "_A_Channel_onSend" /* onSend */
  })
], A_Channel.prototype, "onSend", 1);
A_Channel = __decorateClass([
  A_Frame.Namespace("A-Utils"),
  A_Frame.Component({
    name: "A-Channel",
    description: "Component uses as abstract channel for communication patterns. Can be inherited and extended to implement custom channels."
  })
], A_Channel);

export { A_Channel, A_ChannelError, A_ChannelFeatures, A_ChannelRequest, A_ChannelRequestStatuses };
//# sourceMappingURL=a-channel.mjs.map
//# sourceMappingURL=a-channel.mjs.map