'use strict';

var aConcept = require('@adaas/a-concept');
var AChannel_error = require('./A-Channel.error');
var AChannel_constants = require('./A-Channel.constants');
var aOperation = require('@adaas/a-utils/a-operation');
var AChannelRequest_context = require('./A-ChannelRequest.context');
var aFrame = require('@adaas/a-frame');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
exports.A_Channel = class A_Channel extends aConcept.A_Component {
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
    await this.call(AChannel_constants.A_ChannelFeatures.onConnect);
  }
  /**
   * Disconnects the channel by calling the onDisconnect lifecycle hook.
   * 
   * Use this method to properly cleanup resources when the channel is no longer needed.
   * 
   * @returns {Promise<void>} Promise that resolves when cleanup is complete
   */
  async disconnect() {
    await this.call(AChannel_constants.A_ChannelFeatures.onDisconnect);
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
    const requestScope = new aConcept.A_Scope({
      name: `a-channel@scope:request:${aConcept.A_IdentityHelper.generateTimeId()}`
    }).inherit(aConcept.A_Context.scope(this));
    const context = new AChannelRequest_context.A_ChannelRequest(params);
    try {
      requestScope.register(context);
      await this.call(AChannel_constants.A_ChannelFeatures.onBeforeRequest, requestScope);
      await this.call(AChannel_constants.A_ChannelFeatures.onRequest, requestScope);
      await this.call(AChannel_constants.A_ChannelFeatures.onAfterRequest, requestScope);
      this._processing = false;
      return context;
    } catch (error) {
      this._processing = false;
      const channelError = new AChannel_error.A_ChannelError(error);
      context.fail(channelError);
      requestScope.register(channelError);
      await this.call(AChannel_constants.A_ChannelFeatures.onError, requestScope);
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
    const requestScope = new aConcept.A_Scope({
      name: `a-channel@scope:send:${aConcept.A_IdentityHelper.generateTimeId()}`
    }).inherit(aConcept.A_Context.scope(this));
    const context = new aOperation.A_OperationContext("send", message);
    try {
      requestScope.inherit(aConcept.A_Context.scope(this));
      requestScope.register(context);
      await this.call(AChannel_constants.A_ChannelFeatures.onSend, requestScope);
      this._processing = false;
    } catch (error) {
      this._processing = false;
      const channelError = new AChannel_error.A_ChannelError(error);
      requestScope.register(channelError);
      context.fail(channelError);
      await this.call(AChannel_constants.A_ChannelFeatures.onError, requestScope);
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
    const requestScope = new aConcept.A_Scope({ name: `a-channel@scope:consume:${aConcept.A_IdentityHelper.generateTimeId()}` }).inherit(aConcept.A_Context.scope(this));
    const context = new aOperation.A_OperationContext("consume", {});
    try {
      requestScope.inherit(aConcept.A_Context.scope(this));
      requestScope.register(context);
      await this.call(AChannel_constants.A_ChannelFeatures.onConsume, requestScope);
      this._processing = false;
      return context;
    } catch (error) {
      this._processing = false;
      const channelError = new AChannel_error.A_ChannelError(error);
      context.fail(channelError);
      await this.call(AChannel_constants.A_ChannelFeatures.onError, requestScope);
      return context;
    }
  }
};
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AChannel_constants.A_ChannelFeatures.onConnect
  })
], exports.A_Channel.prototype, "onConnect", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AChannel_constants.A_ChannelFeatures.onDisconnect
  })
], exports.A_Channel.prototype, "onDisconnect", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AChannel_constants.A_ChannelFeatures.onBeforeRequest
  })
], exports.A_Channel.prototype, "onBeforeRequest", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AChannel_constants.A_ChannelFeatures.onRequest
  })
], exports.A_Channel.prototype, "onRequest", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AChannel_constants.A_ChannelFeatures.onAfterRequest
  })
], exports.A_Channel.prototype, "onAfterRequest", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AChannel_constants.A_ChannelFeatures.onError
  })
], exports.A_Channel.prototype, "onError", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: AChannel_constants.A_ChannelFeatures.onSend
  })
], exports.A_Channel.prototype, "onSend", 1);
exports.A_Channel = __decorateClass([
  aFrame.A_Frame.Namespace("A-Utils"),
  aFrame.A_Frame.Component({
    name: "A-Channel",
    description: "Component uses as abstract channel for communication patterns. Can be inherited and extended to implement custom channels."
  })
], exports.A_Channel);
//# sourceMappingURL=A-Channel.component.js.map
//# sourceMappingURL=A-Channel.component.js.map