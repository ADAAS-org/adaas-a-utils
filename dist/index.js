'use strict';

var aConcept = require('@adaas/a-concept');

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
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var A_OperationContext = class extends aConcept.A_Fragment {
  constructor(operation, params) {
    super();
    this.meta.set("name", operation);
    this.meta.set("params", params || {});
  }
  get name() {
    return this._meta.get("name") || this._name;
  }
  get result() {
    return this._meta.get("result");
  }
  get error() {
    return this._meta.get("error");
  }
  get params() {
    return this._meta.get("params") || {};
  }
  fail(error) {
    this._meta.set("error", error);
  }
  succeed(result) {
    this._meta.set("result", result);
  }
  toJSON() {
    return {
      name: this.name,
      params: this.params,
      result: this.result || {},
      error: this.error?.toJSON()
    };
  }
};

// src/lib/A-Channel/A-Channel.error.ts
var A_ChannelError = class extends aConcept.A_Error {
  /**
   * Channel Error allows to keep track of errors within a channel if something goes wrong
   * 
   * 
   * @param originalError 
   * @param context 
   */
  constructor(originalError, context) {
    if (aConcept.A_TypeGuards.isString(context))
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
  A_ChannelFeatures2["onTimeout"] = "onTimeout";
  A_ChannelFeatures2["onRetry"] = "onRetry";
  A_ChannelFeatures2["onCircuitBreakerOpen"] = "onCircuitBreakerOpen";
  A_ChannelFeatures2["onCache"] = "onCache";
  A_ChannelFeatures2["onConnect"] = "onConnect";
  A_ChannelFeatures2["onDisconnect"] = "onDisconnect";
  A_ChannelFeatures2["onBeforeRequest"] = "onBeforeRequest";
  A_ChannelFeatures2["onRequest"] = "onRequest";
  A_ChannelFeatures2["onAfterRequest"] = "onAfterRequest";
  A_ChannelFeatures2["onError"] = "onError";
  A_ChannelFeatures2["onSend"] = "onSend";
  A_ChannelFeatures2["onConsume"] = "onConsume";
  return A_ChannelFeatures2;
})(A_ChannelFeatures || {});
var A_ChannelRequestStatuses = /* @__PURE__ */ ((A_ChannelRequestStatuses2) => {
  A_ChannelRequestStatuses2["PENDING"] = "PENDING";
  A_ChannelRequestStatuses2["SUCCESS"] = "SUCCESS";
  A_ChannelRequestStatuses2["FAILED"] = "FAILED";
  return A_ChannelRequestStatuses2;
})(A_ChannelRequestStatuses || {});

// src/lib/A-Channel/A-ChannelRequest.context.ts
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

// src/lib/A-Channel/A-Channel.component.ts
var A_Channel = class extends aConcept.A_Component {
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
    await this.call("onConnect" /* onConnect */);
  }
  /**
   * Disconnects the channel by calling the onDisconnect lifecycle hook.
   * 
   * Use this method to properly cleanup resources when the channel is no longer needed.
   * 
   * @returns {Promise<void>} Promise that resolves when cleanup is complete
   */
  async disconnect() {
    await this.call("onDisconnect" /* onDisconnect */);
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
    });
    const context = new A_ChannelRequest(params);
    try {
      requestScope.register(context);
      await this.call("onBeforeRequest" /* onBeforeRequest */, requestScope);
      await this.call("onRequest" /* onRequest */, requestScope);
      await this.call("onAfterRequest" /* onAfterRequest */, requestScope);
      this._processing = false;
      return context;
    } catch (error) {
      this._processing = false;
      const channelError = new A_ChannelError(error);
      context.fail(channelError);
      requestScope.register(channelError);
      await this.call("onError" /* onError */, requestScope);
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
    });
    const context = new A_OperationContext("send", message);
    try {
      requestScope.inherit(aConcept.A_Context.scope(this));
      requestScope.register(context);
      await this.call("onSend" /* onSend */, requestScope);
      this._processing = false;
    } catch (error) {
      this._processing = false;
      const channelError = new A_ChannelError(error);
      requestScope.register(channelError);
      context.fail(channelError);
      await this.call("onError" /* onError */, requestScope);
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
    const requestScope = new aConcept.A_Scope({ name: `a-channel@scope:consume:${aConcept.A_IdentityHelper.generateTimeId()}` });
    const context = new A_OperationContext("consume", {});
    try {
      requestScope.inherit(aConcept.A_Context.scope(this));
      requestScope.register(context);
      await this.call("onConsume" /* onConsume */, requestScope);
      this._processing = false;
      return context;
    } catch (error) {
      this._processing = false;
      const channelError = new A_ChannelError(error);
      context.fail(channelError);
      await this.call("onError" /* onError */, requestScope);
      return context;
    }
  }
};
__decorateClass([
  aConcept.A_Feature.Extend({
    name: "onConnect" /* onConnect */
  })
], A_Channel.prototype, "onConnect", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: "onDisconnect" /* onDisconnect */
  })
], A_Channel.prototype, "onDisconnect", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: "onBeforeRequest" /* onBeforeRequest */
  })
], A_Channel.prototype, "onBeforeRequest", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: "onRequest" /* onRequest */
  })
], A_Channel.prototype, "onRequest", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: "onAfterRequest" /* onAfterRequest */
  })
], A_Channel.prototype, "onAfterRequest", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: "onError" /* onError */
  })
], A_Channel.prototype, "onError", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: "onSend" /* onSend */
  })
], A_Channel.prototype, "onSend", 1);

// src/lib/A-Command/A-Command.constants.ts
var A_Command_Status = /* @__PURE__ */ ((A_Command_Status2) => {
  A_Command_Status2["CREATED"] = "CREATED";
  A_Command_Status2["INITIALIZED"] = "INITIALIZED";
  A_Command_Status2["COMPILED"] = "COMPILED";
  A_Command_Status2["EXECUTING"] = "EXECUTING";
  A_Command_Status2["COMPLETED"] = "COMPLETED";
  A_Command_Status2["FAILED"] = "FAILED";
  return A_Command_Status2;
})(A_Command_Status || {});
var A_CommandTransitions = /* @__PURE__ */ ((A_CommandTransitions2) => {
  A_CommandTransitions2["CREATED_TO_INITIALIZED"] = "created_initialized";
  A_CommandTransitions2["INITIALIZED_TO_EXECUTING"] = "initialized_executing";
  A_CommandTransitions2["EXECUTING_TO_COMPLETED"] = "executing_completed";
  A_CommandTransitions2["EXECUTING_TO_FAILED"] = "executing_failed";
  return A_CommandTransitions2;
})(A_CommandTransitions || {});
var A_CommandFeatures = /* @__PURE__ */ ((A_CommandFeatures2) => {
  A_CommandFeatures2["onInit"] = "onInit";
  A_CommandFeatures2["onBeforeExecute"] = "onBeforeExecute";
  A_CommandFeatures2["onExecute"] = "onExecute";
  A_CommandFeatures2["onAfterExecute"] = "onAfterExecute";
  A_CommandFeatures2["onComplete"] = "onComplete";
  A_CommandFeatures2["onFail"] = "onFail";
  A_CommandFeatures2["onError"] = "onError";
  return A_CommandFeatures2;
})(A_CommandFeatures || {});
var A_CommandError = class extends aConcept.A_Error {
};
A_CommandError.CommandScopeBindingError = "A-Command Scope Binding Error";
A_CommandError.ExecutionError = "A-Command Execution Error";
A_CommandError.ResultProcessingError = "A-Command Result Processing Error";
/**
 * Error indicating that the command was interrupted during execution
 */
A_CommandError.CommandInterruptedError = "A-Command Interrupted Error";
var A_StateMachineError = class extends aConcept.A_Error {
};
A_StateMachineError.InitializationError = "A-StateMachine Initialization Error";
A_StateMachineError.TransitionError = "A-StateMachine Transition Error";

// src/lib/A-StateMachine/A-StateMachineTransition.context.ts
var A_StateMachineTransition = class extends A_OperationContext {
  constructor(params) {
    super(
      "a-state-machine-transition",
      params
    );
    this._meta.set("from", params.from);
    this._meta.set("to", params.to);
  }
  get from() {
    return this._meta.get("from");
  }
  get to() {
    return this._meta.get("to");
  }
};

// src/lib/A-StateMachine/A-StateMachine.component.ts
var _a, _b, _c, _d;
var A_StateMachine = class extends aConcept.A_Component {
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
  get ready() {
    if (!this._initialized) {
      this._initialized = this.call("onInitialize" /* onInitialize */);
    }
    return this._initialized;
  }
  async [_d = "onInitialize" /* onInitialize */](...args) {
  }
  async [_c = "onBeforeTransition" /* onBeforeTransition */](...args) {
  }
  async [_b = "onAfterTransition" /* onAfterTransition */](...args) {
  }
  async [_a = "onError" /* onError */](...args) {
  }
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
  async transition(from, to, props) {
    await this.ready;
    const transitionName = `${aConcept.A_FormatterHelper.toCamelCase(String(from))}_${aConcept.A_FormatterHelper.toCamelCase(String(to))}`;
    const transition = new A_StateMachineTransition({
      from: String(from),
      to: String(to),
      props
    });
    const scope = new aConcept.A_Scope({
      name: `A-StateMachine-Transition-Scope-${transitionName}`,
      fragments: [transition]
    });
    try {
      await this.call("onBeforeTransition" /* onBeforeTransition */, scope);
      await this.call(transitionName, scope);
      await this.call("onAfterTransition" /* onAfterTransition */, scope);
      scope.destroy();
      return transition.result;
    } catch (error) {
      const wrappedError = new A_StateMachineError({
        title: A_StateMachineError.TransitionError,
        description: `An error occurred while transitioning to "${transitionName}"`,
        originalError: error
      });
      scope.register(wrappedError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw wrappedError;
    }
  }
};
__decorateClass([
  aConcept.A_Feature.Extend()
], A_StateMachine.prototype, _d, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_StateMachine.prototype, _c, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_StateMachine.prototype, _b, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_StateMachine.prototype, _a, 1);

// src/lib/A-Config/A-Config.constants.ts
var A_CONSTANTS__CONFIG_ENV_VARIABLES = {};
var A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY = [];

// src/lib/A-Config/A-Config.context.ts
var A_Config = class extends aConcept.A_Fragment {
  constructor(config) {
    super({
      name: "A_Config"
    });
    this.VARIABLES = /* @__PURE__ */ new Map();
    this.DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
      ...aConcept.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
      ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];
    this.config = aConcept.A_CommonHelper.deepCloneAndMerge(config, {
      strict: false,
      defaults: {},
      variables: aConcept.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY
    });
    this.CONFIG_PROPERTIES = this.config.variables ? this.config.variables : [];
    this.config.variables.forEach((variable) => {
      this.VARIABLES.set(
        aConcept.A_FormatterHelper.toUpperSnakeCase(variable),
        this.config.defaults[variable]
      );
    });
  }
  /** 
   * This method is used to get the configuration property by name
   * 
   * @param property 
   * @returns 
   */
  get(property) {
    if (this.CONFIG_PROPERTIES.includes(property) || this.DEFAULT_ALLOWED_TO_READ_PROPERTIES.includes(property) || !this.config.strict)
      return this.VARIABLES.get(aConcept.A_FormatterHelper.toUpperSnakeCase(property));
    throw new Error("Property not exists or not allowed to read");
  }
  set(property, value) {
    const array = Array.isArray(property) ? property : typeof property === "string" ? [{ property, value }] : Object.keys(property).map((key) => ({
      property: key,
      value: property[key]
    }));
    for (const { property: property2, value: value2 } of array) {
      let targetValue = value2 ? value2 : this.config?.defaults ? this.config.defaults[property2] : void 0;
      this.VARIABLES.set(aConcept.A_FormatterHelper.toUpperSnakeCase(property2), targetValue);
    }
  }
};

// src/lib/A-Logger/A-Logger.constants.ts
var A_LOGGER_DEFAULT_SCOPE_LENGTH = 20;
var A_LOGGER_COLORS = {
  // System colors (reserved for specific purposes)
  red: "31",
  // Errors, critical issues
  yellow: "33",
  // Warnings, caution messages
  green: "32",
  // Success, completion messages
  // Safe palette for random selection (grey-blue-violet theme)
  blue: "34",
  // Info, general messages
  cyan: "36",
  // Headers, titles
  magenta: "35",
  // Special highlighting
  gray: "90",
  // Debug, less important info
  brightBlue: "94",
  // Bright blue variant
  brightCyan: "96",
  // Bright cyan variant
  brightMagenta: "95",
  // Bright magenta variant
  darkGray: "30",
  // Dark gray
  lightGray: "37",
  // Light gray (white)
  // Extended blue-violet palette
  indigo: "38;5;54",
  // Deep indigo
  violet: "38;5;93",
  // Violet
  purple: "38;5;129",
  // Purple
  lavender: "38;5;183",
  // Lavender
  skyBlue: "38;5;117",
  // Sky blue
  steelBlue: "38;5;67",
  // Steel blue
  slateBlue: "38;5;62",
  // Slate blue
  deepBlue: "38;5;18",
  // Deep blue
  lightBlue: "38;5;153",
  // Light blue
  periwinkle: "38;5;111",
  // Periwinkle
  cornflower: "38;5;69",
  // Cornflower blue
  powder: "38;5;152",
  // Powder blue
  // Additional grays for variety
  charcoal: "38;5;236",
  // Charcoal
  silver: "38;5;250",
  // Silver
  smoke: "38;5;244",
  // Smoke gray
  slate: "38;5;240"
  // Slate gray
};
var A_LOGGER_SAFE_RANDOM_COLORS = [
  "blue",
  "cyan",
  "magenta",
  "gray",
  "brightBlue",
  "brightCyan",
  "brightMagenta",
  "darkGray",
  "lightGray",
  "indigo",
  "violet",
  "purple",
  "lavender",
  "skyBlue",
  "steelBlue",
  "slateBlue",
  "deepBlue",
  "lightBlue",
  "periwinkle",
  "cornflower",
  "powder",
  "charcoal",
  "silver",
  "smoke",
  "slate"
];
var A_LOGGER_ANSI = {
  RESET: "\x1B[0m",
  PREFIX: "\x1B[",
  SUFFIX: "m"
};
var A_LOGGER_TIME_FORMAT = {
  MINUTES_PAD: 2,
  SECONDS_PAD: 2,
  MILLISECONDS_PAD: 3,
  SEPARATOR: ":"
};
var A_LOGGER_FORMAT = {
  SCOPE_OPEN: "[",
  SCOPE_CLOSE: "]",
  TIME_OPEN: "|",
  TIME_CLOSE: "|",
  SEPARATOR: "-------------------------------",
  PIPE: "| "
};
var A_LOGGER_ENV_KEYS = {
  LOG_LEVEL: "A_LOGGER_LEVEL",
  DEFAULT_SCOPE_LENGTH: "A_LOGGER_DEFAULT_SCOPE_LENGTH",
  DEFAULT_SCOPE_COLOR: "A_LOGGER_DEFAULT_SCOPE_COLOR",
  DEFAULT_LOG_COLOR: "A_LOGGER_DEFAULT_LOG_COLOR"
};

// src/lib/A-Logger/A-Logger.component.ts
exports.A_Logger = class A_Logger extends aConcept.A_Component {
  // =============================================
  // Constructor and Initialization
  // =============================================
  /**
   * Initialize A_Logger with dependency injection
   * Colors are configured through A_Config or generated randomly if not provided
   * 
   * @param scope - The current scope context for message prefixing
   * @param config - Optional configuration for log level filtering and color settings
   */
  constructor(scope, config) {
    super();
    this.scope = scope;
    this.config = config;
    this.COLORS = A_LOGGER_COLORS;
    this.STANDARD_SCOPE_LENGTH = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_SCOPE_LENGTH) || A_LOGGER_DEFAULT_SCOPE_LENGTH;
    const configScopeColor = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_SCOPE_COLOR);
    const configLogColor = config?.get(A_LOGGER_ENV_KEYS.DEFAULT_LOG_COLOR);
    if (configScopeColor || configLogColor) {
      this.DEFAULT_SCOPE_COLOR = configScopeColor || this.generateColorFromScopeName(this.scope.name);
      this.DEFAULT_LOG_COLOR = configLogColor || this.generateColorFromScopeName(this.scope.name);
    } else {
      const complementaryColors = this.generateComplementaryColorsFromScope(this.scope.name);
      this.DEFAULT_SCOPE_COLOR = complementaryColors.scopeColor;
      this.DEFAULT_LOG_COLOR = complementaryColors.logColor;
    }
  }
  // =============================================
  // Color Generation Utilities
  // =============================================
  /**
   * Generate a simple hash from a string
   * Used to create deterministic color selection based on scope name
   * 
   * @param str - The string to hash
   * @returns A numeric hash value
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  /**
   * Generate a deterministic color based on scope name
   * Same scope names will always get the same color, but uses safe color palette
   * 
   * @param scopeName - The scope name to generate color for
   * @returns A color key from the safe colors palette
   */
  generateColorFromScopeName(scopeName) {
    const safeColors = A_LOGGER_SAFE_RANDOM_COLORS;
    const hash = this.simpleHash(scopeName);
    const colorIndex = hash % safeColors.length;
    return safeColors[colorIndex];
  }
  /**
   * Generate a pair of complementary colors based on scope name
   * Ensures visual harmony between scope and message colors while being deterministic
   * 
   * @param scopeName - The scope name to base colors on
   * @returns Object with scopeColor and logColor that work well together
   */
  generateComplementaryColorsFromScope(scopeName) {
    const colorPairs = [
      { scopeColor: "indigo", logColor: "lightBlue" },
      { scopeColor: "deepBlue", logColor: "cyan" },
      { scopeColor: "purple", logColor: "lavender" },
      { scopeColor: "steelBlue", logColor: "skyBlue" },
      { scopeColor: "slateBlue", logColor: "periwinkle" },
      { scopeColor: "charcoal", logColor: "silver" },
      { scopeColor: "violet", logColor: "brightMagenta" },
      { scopeColor: "darkGray", logColor: "lightGray" },
      { scopeColor: "cornflower", logColor: "powder" },
      { scopeColor: "slate", logColor: "smoke" }
    ];
    const hash = this.simpleHash(scopeName);
    const pairIndex = hash % colorPairs.length;
    return colorPairs[pairIndex];
  }
  // =============================================
  // Factory Methods
  // =============================================
  // =============================================
  // Scope and Formatting Utilities
  // =============================================
  /**
   * Get the formatted scope length for consistent message alignment
   * Uses a standard length to ensure all messages align properly regardless of scope name
   * 
   * @returns The scope length to use for padding calculations
   */
  get scopeLength() {
    return Math.max(this.scope.name.length, this.STANDARD_SCOPE_LENGTH);
  }
  /**
   * Get the formatted scope name with proper padding, centered within the container
   * Ensures consistent width for all scope names in log output with centered alignment
   * 
   * @returns Centered and padded scope name for consistent formatting
   */
  get formattedScope() {
    const scopeName = this.scope.name;
    const totalLength = this.STANDARD_SCOPE_LENGTH;
    if (scopeName.length >= totalLength) {
      return scopeName.substring(0, totalLength);
    }
    const totalPadding = totalLength - scopeName.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    return " ".repeat(leftPadding) + scopeName + " ".repeat(rightPadding);
  }
  // =============================================
  // Message Compilation and Formatting
  // =============================================
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
   * @returns Array of formatted strings ready for console output
   */
  compile(messageColor, ...args) {
    const timeString = this.getTime();
    const scopePadding = " ".repeat(this.scopeLength + 3);
    const isMultiArg = args.length > 1;
    return [
      // Header with separate colors for scope and message content
      `${A_LOGGER_ANSI.PREFIX}${this.COLORS[this.DEFAULT_SCOPE_COLOR]}${A_LOGGER_ANSI.SUFFIX}${A_LOGGER_FORMAT.SCOPE_OPEN}${this.formattedScope}${A_LOGGER_FORMAT.SCOPE_CLOSE}${A_LOGGER_ANSI.RESET} ${A_LOGGER_ANSI.PREFIX}${this.COLORS[messageColor]}${A_LOGGER_ANSI.SUFFIX}${A_LOGGER_FORMAT.TIME_OPEN}${timeString}${A_LOGGER_FORMAT.TIME_CLOSE}`,
      // Top separator for multi-argument messages
      isMultiArg ? `
${scopePadding}${A_LOGGER_FORMAT.TIME_OPEN}${A_LOGGER_FORMAT.SEPARATOR}` : "",
      // Process each argument with appropriate formatting
      ...args.map((arg, i) => {
        const shouldAddNewline = i > 0 || isMultiArg;
        switch (true) {
          case arg instanceof aConcept.A_Error:
            return this.compile_A_Error(arg);
          case arg instanceof Error:
            return this.compile_Error(arg);
          case (typeof arg === "object" && arg !== null):
            return this.formatObject(arg, shouldAddNewline, scopePadding);
          default:
            return this.formatString(String(arg), shouldAddNewline, scopePadding);
        }
      }),
      // Bottom separator and color reset
      isMultiArg ? `
${scopePadding}${A_LOGGER_FORMAT.TIME_OPEN}${A_LOGGER_FORMAT.SEPARATOR}${A_LOGGER_ANSI.RESET}` : A_LOGGER_ANSI.RESET
    ];
  }
  /**
   * Format an object for display with proper JSON indentation
   * 
   * @param obj - The object to format
   * @param shouldAddNewline - Whether to add a newline prefix
   * @param scopePadding - The padding string for consistent alignment
   * @returns Formatted object string
   */
  formatObject(obj, shouldAddNewline, scopePadding) {
    let jsonString;
    try {
      jsonString = JSON.stringify(obj, null, 2);
    } catch (error) {
      const seen = /* @__PURE__ */ new WeakSet();
      jsonString = JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular Reference]";
          }
          seen.add(value);
        }
        return value;
      }, 2);
    }
    const formatted = jsonString.replace(/\n/g, `
${scopePadding}${A_LOGGER_FORMAT.PIPE}`);
    return shouldAddNewline ? `
${scopePadding}${A_LOGGER_FORMAT.PIPE}` + formatted : formatted;
  }
  /**
   * Format a string for display with proper indentation
   * 
   * @param str - The string to format
   * @param shouldAddNewline - Whether to add a newline prefix
   * @param scopePadding - The padding string for consistent alignment
   * @returns Formatted string
   */
  formatString(str, shouldAddNewline, scopePadding) {
    const prefix = shouldAddNewline ? "\n" : "";
    return (prefix + str).replace(/\n/g, `
${scopePadding}${A_LOGGER_FORMAT.PIPE}`);
  }
  // =============================================
  // Log Level Management
  // =============================================
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
  shouldLog(logMethod) {
    const shouldLog = this.config?.get(A_LOGGER_ENV_KEYS.LOG_LEVEL) || "info";
    switch (shouldLog) {
      case "debug":
        return true;
      case "info":
        return logMethod === "info" || logMethod === "warning" || logMethod === "error";
      case "warn":
        return logMethod === "warning" || logMethod === "error";
      case "error":
        return logMethod === "error";
      case "all":
        return true;
      default:
        return false;
    }
  }
  debug(param1, ...args) {
    if (!this.shouldLog("debug")) return;
    if (typeof param1 === "string" && this.COLORS[param1]) {
      console.log(...this.compile(param1, ...args));
    } else {
      console.log(...this.compile(this.DEFAULT_LOG_COLOR, param1, ...args));
    }
  }
  info(param1, ...args) {
    if (!this.shouldLog("info")) return;
    if (typeof param1 === "string" && this.COLORS[param1]) {
      console.log(...this.compile(param1, ...args));
    } else {
      console.log(...this.compile(this.DEFAULT_LOG_COLOR, param1, ...args));
    }
  }
  log(param1, ...args) {
    this.info(param1, ...args);
  }
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
  warning(...args) {
    if (!this.shouldLog("warning")) return;
    console.log(...this.compile("yellow", ...args));
  }
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
  error(...args) {
    if (!this.shouldLog("error")) return;
    console.log(...this.compile("red", ...args));
  }
  // =============================================
  // Specialized Error Formatting
  // =============================================
  /**
   * Legacy method for A_Error logging (kept for backward compatibility)
   * 
   * @deprecated Use error() method instead which handles A_Error automatically
   * @param error - The A_Error instance to log
   */
  log_A_Error(error) {
    const time = this.getTime();
    const scopePadding = " ".repeat(this.scopeLength + 3);
    console.log(`\x1B[31m[${this.formattedScope}] |${time}| ERROR ${error.code}
${scopePadding}| ${error.message}
${scopePadding}| ${error.description} 
${scopePadding}|-------------------------------
${scopePadding}| ${error.stack?.split("\n").map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join("\n") || "No stack trace"}
${scopePadding}|-------------------------------
\x1B[0m` + (error.originalError ? `\x1B[31m${scopePadding}| Wrapped From  ${error.originalError.message}
${scopePadding}|-------------------------------
${scopePadding}| ${error.originalError.stack?.split("\n").map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join("\n") || "No stack trace"}
${scopePadding}|-------------------------------
\x1B[0m` : "") + (error.link ? `\x1B[31m${scopePadding}| Read in docs: ${error.link}
${scopePadding}|-------------------------------
\x1B[0m` : ""));
  }
  /**
   * Format A_Error instances for inline display within compiled messages
   * 
   * Provides detailed formatting for A_Error objects including:
   * - Error code and message
   * - Description and stack trace
   * - Original error information (if wrapped)
   * - Documentation links (if available)
   * 
   * @param error - The A_Error instance to format
   * @returns Formatted string ready for display
   */
  compile_A_Error(error) {
    const scopePadding = " ".repeat(this.scopeLength + 3);
    return `
${scopePadding}|-------------------------------
${scopePadding}|  Error:  | ${error.code}
${scopePadding}|-------------------------------
${scopePadding}|${" ".repeat(10)}| ${error.message}
${scopePadding}|${" ".repeat(10)}| ${error.description} 
${scopePadding}|-------------------------------
${scopePadding}| ${error.stack?.split("\n").map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join("\n") || "No stack trace"}
${scopePadding}|-------------------------------` + (error.originalError ? `${scopePadding}| Wrapped From  ${error.originalError.message}
${scopePadding}|-------------------------------
${scopePadding}| ${error.originalError.stack?.split("\n").map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join("\n") || "No stack trace"}
${scopePadding}|-------------------------------` : "") + (error.link ? `${scopePadding}| Read in docs: ${error.link}
${scopePadding}|-------------------------------` : "");
  }
  /**
   * Format standard Error instances for inline display within compiled messages
   * 
   * Converts standard JavaScript Error objects into a readable JSON format
   * with proper indentation and stack trace formatting
   * 
   * @param error - The Error instance to format
   * @returns Formatted string ready for display
   */
  compile_Error(error) {
    const scopePadding = " ".repeat(this.scopeLength + 3);
    return JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack?.split("\n").map((line, index) => index === 0 ? line : `${scopePadding}| ${line}`).join("\n")
    }, null, 2).replace(/\n/g, `
${scopePadding}| `).replace(/\\n/g, "\n");
  }
  // =============================================
  // Utility Methods
  // =============================================
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
  getTime() {
    const now = /* @__PURE__ */ new Date();
    const minutes = String(now.getMinutes()).padStart(A_LOGGER_TIME_FORMAT.MINUTES_PAD, "0");
    const seconds = String(now.getSeconds()).padStart(A_LOGGER_TIME_FORMAT.SECONDS_PAD, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(A_LOGGER_TIME_FORMAT.MILLISECONDS_PAD, "0");
    return `${minutes}${A_LOGGER_TIME_FORMAT.SEPARATOR}${seconds}${A_LOGGER_TIME_FORMAT.SEPARATOR}${milliseconds}`;
  }
};
exports.A_Logger = __decorateClass([
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Scope)),
  __decorateParam(1, aConcept.A_Inject(A_Config))
], exports.A_Logger);

// src/lib/A-Command/A-Command.entity.ts
var _a2, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k;
var A_Command = class extends aConcept.A_Entity {
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
  constructor(params) {
    super(params);
    /** Map of event listeners organized by event name */
    this._listeners = /* @__PURE__ */ new Map();
  }
  // ====================================================================
  // ================== Static Command Information ======================
  // ====================================================================
  /**
   * Static command identifier derived from the class name
   * Used for command registration and serialization
   */
  static get code() {
    return super.entity;
  }
  // ====================================================================
  // ================== Public Getter Properties =======================
  // ====================================================================
  /**
   * Total execution duration in milliseconds
   * 
   * - If completed/failed: Returns total time from start to end
   * - If currently executing: Returns elapsed time since start
   * - If not started: Returns undefined
   */
  get duration() {
    return this._endTime && this._startTime ? this._endTime.getTime() - this._startTime.getTime() : this._startTime ? (/* @__PURE__ */ new Date()).getTime() - this._startTime.getTime() : void 0;
  }
  /**
   * Idle time before execution started in milliseconds
   * 
   * Time between command creation and execution start.
   * Useful for monitoring command queue performance.
   */
  get idleTime() {
    return this._startTime && this._createdAt ? this._startTime.getTime() - this._createdAt.getTime() : void 0;
  }
  /**
   * Command execution scope for dependency injection
   * 
   * Provides access to components, services, and shared resources
   * during command execution. Inherits from the scope where the
   * command was registered.
   */
  get scope() {
    return this._executionScope;
  }
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
  get code() {
    return this.constructor.code;
  }
  /**
   * Current lifecycle status of the command
   * 
   * Indicates the current phase in the command execution lifecycle.
   * Used to track progress and determine available operations.
   */
  get status() {
    return this._status;
  }
  /**
   * Timestamp when the command was created
   * 
   * Marks the initial instantiation time, useful for tracking
   * command age and queue performance metrics.
   */
  get createdAt() {
    return this._createdAt;
  }
  /**
   * Timestamp when command execution started
   * 
   * Undefined until execution begins. Used for calculating
   * execution duration and idle time.
   */
  get startedAt() {
    return this._startTime;
  }
  /**
   * Timestamp when command execution ended
   * 
   * Set when command reaches COMPLETED or FAILED status.
   * Used for calculating total execution duration.
   */
  get endedAt() {
    return this._endTime;
  }
  /**
   * Result data produced by command execution
   * 
   * Contains the output data from successful command execution.
   * Undefined until command completes successfully.
   */
  get result() {
    return this._result;
  }
  /**
   * Array of errors that occurred during execution
   * 
   * Automatically wraps native errors in A_Error instances
   * for consistent error handling. Empty array if no errors occurred.
   */
  get error() {
    return this._error;
  }
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
  get params() {
    return this._params;
  }
  /**
   * Indicates if the command has been processed (completed or failed)
   * 
   * Returns true if the command has completed or failed, false otherwise.
   */
  get isProcessed() {
    return this._status === "COMPLETED" /* COMPLETED */ || this._status === "FAILED" /* FAILED */;
  }
  async [_k = "onBeforeTransition" /* onBeforeTransition */](transition, logger, ...args) {
    this.checkScopeInheritance();
    logger?.debug("yellow", `Command ${this.aseid.toString()} transitioning from ${transition.from} to ${transition.to}`);
  }
  async [_j = "created_initialized" /* CREATED_TO_INITIALIZED */](transition, ...args) {
    if (this._status !== "CREATED" /* CREATED */) {
      return;
    }
    this._createdAt = /* @__PURE__ */ new Date();
    this._status = "INITIALIZED" /* INITIALIZED */;
    this.emit("onInit" /* onInit */);
  }
  async [_i = "initialized_executing" /* INITIALIZED_TO_EXECUTING */](transition, ...args) {
    if (this._status !== "INITIALIZED" /* INITIALIZED */ && this._status !== "CREATED" /* CREATED */) {
      return;
    }
    this._startTime = /* @__PURE__ */ new Date();
    this._status = "EXECUTING" /* EXECUTING */;
    this.emit("onExecute" /* onExecute */);
  }
  /**
   * Handles command completion after successful execution
   * 
   * EXECUTION -> COMPLETED transition
   */
  async [_h = "executing_completed" /* EXECUTING_TO_COMPLETED */](transition, ...args) {
    this._endTime = /* @__PURE__ */ new Date();
    this._status = "COMPLETED" /* COMPLETED */;
    this.emit("onComplete" /* onComplete */);
  }
  /**
   * Handles command failure during execution
   * 
   * EXECUTION -> FAILED transition
   */
  async [_g = "executing_failed" /* EXECUTING_TO_FAILED */](transition, error, ...args) {
    this._endTime = /* @__PURE__ */ new Date();
    this._status = "FAILED" /* FAILED */;
    this.emit("onFail" /* onFail */);
  }
  /**
   * Default behavior for Command Initialization uses StateMachine to transition states
   */
  async [_f = "onInit" /* onInit */](stateMachine, ...args) {
    await stateMachine.transition("CREATED" /* CREATED */, "INITIALIZED" /* INITIALIZED */);
  }
  async [_e = "onBeforeExecute" /* onBeforeExecute */](stateMachine, ...args) {
    await stateMachine.transition("INITIALIZED" /* INITIALIZED */, "EXECUTING" /* EXECUTING */);
  }
  async [_d2 = "onExecute" /* onExecute */](...args) {
  }
  /**
   * By Default on AfterExecute calls the Completion method to mark the command as completed
   * 
   * [!] This can be overridden to implement custom behavior using A_Feature overrides
   */
  async [_c2 = "onAfterExecute" /* onAfterExecute */](...args) {
  }
  async [_b2 = "onComplete" /* onComplete */](stateMachine, ...args) {
    await stateMachine.transition("EXECUTING" /* EXECUTING */, "COMPLETED" /* COMPLETED */);
  }
  async [_a2 = "onFail" /* onFail */](stateMachine, operation, ...args) {
    await stateMachine.transition("EXECUTING" /* EXECUTING */, "FAILED" /* FAILED */);
  }
  // --------------------------------------------------------------------------
  // A-Command Lifecycle Methods
  // --------------------------------------------------------------------------
  /**
   * Initializes the command before execution.
   */
  async init() {
    await this.call("onInit" /* onInit */, this.scope);
  }
  /**
   * Executes the command logic.
   */
  async execute() {
    if (this.isProcessed) return;
    try {
      this.checkScopeInheritance();
      const context = new A_OperationContext("execute-command");
      this.scope.register(context);
      await new Promise(async (resolve, reject) => {
        try {
          const onBeforeExecuteFeature = new aConcept.A_Feature({
            name: "onBeforeExecute" /* onBeforeExecute */,
            component: this,
            scope: this.scope
          });
          const onExecuteFeature = new aConcept.A_Feature({
            name: "onExecute" /* onExecute */,
            component: this,
            scope: this.scope
          });
          const onAfterExecuteFeature = new aConcept.A_Feature({
            name: "onAfterExecute" /* onAfterExecute */,
            component: this,
            scope: this.scope
          });
          this.on("onComplete" /* onComplete */, () => {
            onBeforeExecuteFeature.interrupt();
            onExecuteFeature.interrupt();
            onAfterExecuteFeature.interrupt();
            resolve();
          });
          await onBeforeExecuteFeature.process(this.scope);
          await onExecuteFeature.process(this.scope);
          await onAfterExecuteFeature.process(this.scope);
          if (this._origin === "invoked") {
            await this.complete();
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      let targetError = error instanceof aConcept.A_Error ? error : new A_CommandError({
        title: A_CommandError.ExecutionError,
        description: `An error occurred while executing command "${this.aseid.toString()}".`,
        originalError: error
      });
      await this.fail(targetError);
    }
  }
  /**
   * Marks the command as completed
   */
  async complete(result) {
    if (this.isProcessed) return;
    this._status = "COMPLETED" /* COMPLETED */;
    this._result = result;
    await this.call("onComplete" /* onComplete */, this.scope);
    this.scope.destroy();
  }
  /**
   * Marks the command as failed
   */
  async fail(error) {
    if (this.isProcessed) return;
    this._status = "FAILED" /* FAILED */;
    if (error) {
      this._error = error;
      this.scope.register(error);
    }
    await this.call("onFail" /* onFail */, this.scope);
    this.scope.destroy();
  }
  // --------------------------------------------------------------------------   
  // A-Command Event-Emitter methods
  // --------------------------------------------------------------------------
  /**
   * Registers an event listener for a specific event
   * 
   * @param event 
   * @param listener 
   */
  on(event, listener) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, /* @__PURE__ */ new Set());
    }
    this._listeners.get(event).add(listener);
  }
  /**
   * Removes an event listener for a specific event
   * 
   * @param event 
   * @param listener 
   */
  off(event, listener) {
    this._listeners.get(event)?.delete(listener);
  }
  /**
   * Emits an event to all registered listeners
   * 
   * @param event 
   */
  emit(event) {
    this._listeners.get(event)?.forEach(async (listener) => {
      listener(this);
    });
  }
  // --------------------------------------------------------------------------
  // A-Entity Base Class Overrides
  // --------------------------------------------------------------------------
  // Serialization / Deserialization
  // -------------------------------------------------------------------------
  /**
   * Allows to create a Command instance from new data
   * 
   * @param newEntity 
   */
  fromNew(newEntity) {
    super.fromNew(newEntity);
    this._origin = "invoked";
    this._executionScope = new aConcept.A_Scope({
      name: `A-Command-Execution-Scope-${this.aseid.toString()}`,
      components: [A_StateMachine]
    });
    this._createdAt = /* @__PURE__ */ new Date();
    this._params = newEntity;
    this._status = "CREATED" /* CREATED */;
  }
  /**
   * Allows to convert serialized data to Command instance
   * 
   * [!] By default it omits params as they are not stored in the serialized data
   * 
   * @param serialized 
   */
  fromJSON(serialized) {
    super.fromJSON(serialized);
    this._origin = "serialized";
    this._executionScope = new aConcept.A_Scope({
      name: `A-Command-Execution-Scope-${this.aseid.toString()}`,
      components: [A_StateMachine]
    });
    if (serialized.createdAt) this._createdAt = new Date(serialized.createdAt);
    if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
    if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);
    this._params = serialized.params;
    this._status = serialized.status;
    if (serialized.error)
      this._error = new A_CommandError(serialized.error);
    if (serialized.result)
      this._result = serialized.result;
  }
  /**
   * Converts the Command instance to a plain object
   * 
   * @returns 
   */
  toJSON() {
    return {
      ...super.toJSON(),
      code: this.code,
      status: this._status,
      params: this._params,
      createdAt: this._createdAt.toISOString(),
      startedAt: this._startTime ? this._startTime.toISOString() : void 0,
      endedAt: this._endTime ? this._endTime.toISOString() : void 0,
      duration: this.duration,
      idleTime: this.idleTime,
      result: this.result,
      error: this.error ? this.error.toJSON() : void 0
    };
  }
  //============================================================================================
  //                                Helpers Methods
  //============================================================================================
  /**
   * Ensures that the command's execution scope inherits from the context scope
   * 
   * Throws an error if the command is not bound to any context scope
   */
  checkScopeInheritance() {
    let attachedScope;
    try {
      attachedScope = aConcept.A_Context.scope(this);
    } catch (error) {
      throw new A_CommandError({
        title: A_CommandError.CommandScopeBindingError,
        description: `Command ${this.aseid.toString()} is not bound to any context scope. Ensure the command is properly registered within a context before execution.`,
        originalError: error
      });
    }
    if (!this.scope.isInheritedFrom(aConcept.A_Context.scope(this))) {
      this.scope.inherit(aConcept.A_Context.scope(this));
    }
  }
};
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(A_StateMachineTransition)),
  __decorateParam(1, aConcept.A_Inject(exports.A_Logger))
], A_Command.prototype, _k, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(A_StateMachineTransition))
], A_Command.prototype, _j, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(A_StateMachineTransition))
], A_Command.prototype, _i, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(A_StateMachineTransition))
], A_Command.prototype, _h, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(A_StateMachineTransition)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Error))
], A_Command.prototype, _g, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(A_StateMachine))
], A_Command.prototype, _f, 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(A_StateMachine))
], A_Command.prototype, _e, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_Command.prototype, _d2, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_Command.prototype, _c2, 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(A_StateMachine))
], A_Command.prototype, _b2, 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    after: /.*/
  }),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(A_StateMachine)),
  __decorateParam(1, aConcept.A_Inject(A_OperationContext))
], A_Command.prototype, _a2, 1);
var A_FSPolyfillClass = class {
  constructor(logger) {
    this.logger = logger;
    this._initialized = false;
  }
  get isInitialized() {
    return this._initialized;
  }
  async get() {
    if (!this._initialized) {
      await this.init();
    }
    return this._fs;
  }
  async init() {
    try {
      if (aConcept.A_Context.environment === "server") {
        await this.initServer();
      } else {
        this.initBrowser();
      }
      this._initialized = true;
    } catch (error) {
      this.initBrowser();
      this._initialized = true;
    }
  }
  async initServer() {
    this._fs = await import('fs');
  }
  initBrowser() {
    this._fs = {
      readFileSync: (path, encoding) => {
        this.logger.warning("fs.readFileSync not available in browser environment");
        return "";
      },
      existsSync: (path) => {
        this.logger.warning("fs.existsSync not available in browser environment");
        return false;
      },
      createReadStream: (path) => {
        this.logger.warning("fs.createReadStream not available in browser environment");
        return null;
      }
    };
  }
};
var A_CryptoPolyfillClass = class {
  constructor(logger) {
    this.logger = logger;
    this._initialized = false;
  }
  get isInitialized() {
    return this._initialized;
  }
  async get(fsPolyfill) {
    if (!this._initialized) {
      this._fsPolyfill = fsPolyfill;
      await this.init();
    }
    return this._crypto;
  }
  async init() {
    try {
      if (aConcept.A_Context.environment === "server") {
        await this.initServer();
      } else {
        this.initBrowser();
      }
      this._initialized = true;
    } catch (error) {
      this.initBrowser();
      this._initialized = true;
    }
  }
  async initServer() {
    const crypto2 = await import('crypto');
    this._crypto = {
      createTextHash: (text, algorithm = "sha384") => Promise.resolve(
        `${algorithm}-${crypto2.createHash(algorithm).update(text).digest("base64")}`
      ),
      createFileHash: (filePath, algorithm = "sha384") => new Promise(async (resolve, reject) => {
        try {
          if (!this._fsPolyfill) {
            throw new Error("FS polyfill is required for file hashing");
          }
          const hash = crypto2.createHash(algorithm);
          const fileStream = this._fsPolyfill.createReadStream(filePath);
          fileStream.on("data", (data) => hash.update(data));
          fileStream.on("end", () => resolve(`${algorithm}-${hash.digest("base64")}`));
          fileStream.on("error", (err) => reject(err));
        } catch (error) {
          reject(error);
        }
      })
    };
  }
  initBrowser() {
    this._crypto = {
      createFileHash: () => {
        this.logger.warning("File hash not available in browser environment");
        return Promise.resolve("");
      },
      createTextHash: (text, algorithm = "SHA-384") => new Promise(async (resolve, reject) => {
        try {
          if (!crypto.subtle) {
            throw new Error("SubtleCrypto not available");
          }
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          const hashBuffer = await crypto.subtle.digest(algorithm, data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashBase64 = btoa(String.fromCharCode(...hashArray));
          resolve(`${algorithm}-${hashBase64}`);
        } catch (error) {
          reject(error);
        }
      })
    };
  }
};
var A_HttpPolyfillClass = class {
  constructor(logger) {
    this.logger = logger;
    this._initialized = false;
  }
  get isInitialized() {
    return this._initialized;
  }
  async get() {
    if (!this._initialized) {
      await this.init();
    }
    return this._http;
  }
  async init() {
    try {
      if (aConcept.A_Context.environment === "server") {
        await this.initServer();
      } else {
        this.initBrowser();
      }
      this._initialized = true;
    } catch (error) {
      this.initBrowser();
      this._initialized = true;
    }
  }
  async initServer() {
    const httpModule = await import('http');
    this._http = {
      request: httpModule.request,
      get: httpModule.get,
      createServer: httpModule.createServer
    };
  }
  initBrowser() {
    this._http = {
      request: (options, callback) => {
        this.logger.warning("http.request not available in browser/test environment, use fetch instead");
        return this.createMockRequest(options, callback, false);
      },
      get: (url, callback) => {
        this.logger.warning("http.get not available in browser/test environment, use fetch instead");
        return this.createMockRequest(typeof url === "string" ? { hostname: url } : url, callback, false);
      },
      createServer: () => {
        this.logger.error("http.createServer not available in browser/test environment");
        return null;
      }
    };
  }
  createMockRequest(options, callback, isHttps = false) {
    const request = {
      end: () => {
        if (callback) {
          const mockResponse = {
            statusCode: 200,
            headers: {},
            on: (event, handler) => {
              if (event === "data") {
                setTimeout(() => handler("mock data"), 0);
              } else if (event === "end") {
                setTimeout(() => handler(), 0);
              }
            },
            pipe: (dest) => {
              if (dest.write) dest.write("mock data");
              if (dest.end) dest.end();
            }
          };
          setTimeout(() => callback(mockResponse), 0);
        }
      },
      write: (data) => {
      },
      on: (event, handler) => {
      }
    };
    return request;
  }
};
var A_HttpsPolyfillClass = class {
  constructor(logger) {
    this.logger = logger;
    this._initialized = false;
  }
  get isInitialized() {
    return this._initialized;
  }
  async get() {
    if (!this._initialized) {
      await this.init();
    }
    return this._https;
  }
  async init() {
    try {
      if (aConcept.A_Context.environment === "server") {
        await this.initServer();
      } else {
        this.initBrowser();
      }
      this._initialized = true;
    } catch (error) {
      this.initBrowser();
      this._initialized = true;
    }
  }
  async initServer() {
    const httpsModule = await import('https');
    this._https = {
      request: httpsModule.request,
      get: httpsModule.get,
      createServer: httpsModule.createServer
    };
  }
  initBrowser() {
    this._https = {
      request: (options, callback) => {
        this.logger.warning("https.request not available in browser/test environment, use fetch instead");
        return this.createMockRequest(options, callback, true);
      },
      get: (url, callback) => {
        this.logger.warning("https.get not available in browser/test environment, use fetch instead");
        return this.createMockRequest(typeof url === "string" ? { hostname: url } : url, callback, true);
      },
      createServer: () => {
        this.logger.error("https.createServer not available in browser/test environment");
        return null;
      }
    };
  }
  createMockRequest(options, callback, isHttps = true) {
    const request = {
      end: () => {
        if (callback) {
          const mockResponse = {
            statusCode: 200,
            headers: {},
            on: (event, handler) => {
              if (event === "data") {
                setTimeout(() => handler("mock data"), 0);
              } else if (event === "end") {
                setTimeout(() => handler(), 0);
              }
            },
            pipe: (dest) => {
              if (dest.write) dest.write("mock data");
              if (dest.end) dest.end();
            }
          };
          setTimeout(() => callback(mockResponse), 0);
        }
      },
      write: (data) => {
      },
      on: (event, handler) => {
      }
    };
    return request;
  }
};
var A_PathPolyfillClass = class {
  constructor(logger) {
    this.logger = logger;
    this._initialized = false;
  }
  get isInitialized() {
    return this._initialized;
  }
  async get() {
    if (!this._initialized) {
      await this.init();
    }
    return this._path;
  }
  async init() {
    try {
      if (aConcept.A_Context.environment === "server") {
        await this.initServer();
      } else {
        this.initBrowser();
      }
      this._initialized = true;
    } catch (error) {
      this.initBrowser();
      this._initialized = true;
    }
  }
  async initServer() {
    this._path = await import('path');
  }
  initBrowser() {
    this._path = {
      join: (...paths) => {
        return paths.join("/").replace(/\/+/g, "/");
      },
      resolve: (...paths) => {
        let resolvedPath = "";
        for (const path of paths) {
          if (path.startsWith("/")) {
            resolvedPath = path;
          } else {
            resolvedPath = this._path.join(resolvedPath, path);
          }
        }
        return resolvedPath || "/";
      },
      dirname: (path) => {
        const parts = path.split("/");
        return parts.slice(0, -1).join("/") || "/";
      },
      basename: (path, ext) => {
        const base = path.split("/").pop() || "";
        return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base;
      },
      extname: (path) => {
        const parts = path.split(".");
        return parts.length > 1 ? "." + parts.pop() : "";
      },
      relative: (from, to) => {
        return to.replace(from, "").replace(/^\//, "");
      },
      normalize: (path) => {
        return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
      },
      isAbsolute: (path) => {
        return path.startsWith("/") || /^[a-zA-Z]:/.test(path);
      },
      parse: (path) => {
        const ext = this._path.extname(path);
        const base = this._path.basename(path);
        const name = this._path.basename(path, ext);
        const dir = this._path.dirname(path);
        return { root: "/", dir, base, ext, name };
      },
      format: (pathObject) => {
        return this._path.join(pathObject.dir || "", pathObject.base || "");
      },
      sep: "/",
      delimiter: ":"
    };
  }
};
var A_UrlPolyfillClass = class {
  constructor(logger) {
    this.logger = logger;
    this._initialized = false;
  }
  get isInitialized() {
    return this._initialized;
  }
  async get() {
    if (!this._initialized) {
      await this.init();
    }
    return this._url;
  }
  async init() {
    try {
      if (aConcept.A_Context.environment === "server") {
        await this.initServer();
      } else {
        this.initBrowser();
      }
      this._initialized = true;
    } catch (error) {
      this.initBrowser();
      this._initialized = true;
    }
  }
  async initServer() {
    const urlModule = await import('url');
    this._url = {
      parse: urlModule.parse,
      format: urlModule.format,
      resolve: urlModule.resolve,
      URL: urlModule.URL || globalThis.URL,
      URLSearchParams: urlModule.URLSearchParams || globalThis.URLSearchParams
    };
  }
  initBrowser() {
    this._url = {
      parse: (urlString) => {
        try {
          const url = new URL(urlString);
          return {
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            host: url.host,
            href: url.href
          };
        } catch {
          return {};
        }
      },
      format: (urlObject) => {
        try {
          return new URL("", urlObject.href || `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}${urlObject.search}${urlObject.hash}`).href;
        } catch {
          return "";
        }
      },
      resolve: (from, to) => {
        try {
          return new URL(to, from).href;
        } catch {
          return to;
        }
      },
      URL: globalThis.URL,
      URLSearchParams: globalThis.URLSearchParams
    };
  }
};
var A_BufferPolyfillClass = class {
  constructor(logger) {
    this.logger = logger;
    this._initialized = false;
  }
  get isInitialized() {
    return this._initialized;
  }
  async get() {
    if (!this._initialized) {
      await this.init();
    }
    return this._buffer;
  }
  async init() {
    try {
      if (aConcept.A_Context.environment === "server") {
        await this.initServer();
      } else {
        this.initBrowser();
      }
      this._initialized = true;
    } catch (error) {
      this.initBrowser();
      this._initialized = true;
    }
  }
  async initServer() {
    const bufferModule = await import('buffer');
    this._buffer = {
      from: bufferModule.Buffer.from,
      alloc: bufferModule.Buffer.alloc,
      allocUnsafe: bufferModule.Buffer.allocUnsafe,
      isBuffer: bufferModule.Buffer.isBuffer,
      concat: bufferModule.Buffer.concat
    };
  }
  initBrowser() {
    this._buffer = {
      from: (data, encoding) => {
        if (typeof data === "string") {
          return new TextEncoder().encode(data);
        }
        return new Uint8Array(data);
      },
      alloc: (size, fill) => {
        const buffer = new Uint8Array(size);
        if (fill !== void 0) {
          buffer.fill(fill);
        }
        return buffer;
      },
      allocUnsafe: (size) => {
        return new Uint8Array(size);
      },
      isBuffer: (obj) => {
        return obj instanceof Uint8Array || obj instanceof ArrayBuffer;
      },
      concat: (list, totalLength) => {
        const length = totalLength || list.reduce((sum, buf) => sum + buf.length, 0);
        const result = new Uint8Array(length);
        let offset = 0;
        for (const buf of list) {
          result.set(buf, offset);
          offset += buf.length;
        }
        return result;
      }
    };
  }
};
var A_ProcessPolyfillClass = class {
  constructor(logger) {
    this.logger = logger;
    this._initialized = false;
  }
  get isInitialized() {
    return this._initialized;
  }
  async get() {
    if (!this._initialized) {
      await this.init();
    }
    return this._process;
  }
  async init() {
    try {
      if (aConcept.A_Context.environment === "server") {
        this.initServer();
      } else {
        this.initBrowser();
      }
      this._initialized = true;
    } catch (error) {
      this.initBrowser();
      this._initialized = true;
    }
  }
  initServer() {
    this._process = {
      env: process.env,
      argv: process.argv,
      platform: process.platform,
      version: process.version,
      versions: process.versions,
      cwd: process.cwd,
      exit: process.exit,
      nextTick: process.nextTick
    };
  }
  initBrowser() {
    this._process = {
      env: {
        NODE_ENV: "browser",
        ...globalThis.process?.env || {}
      },
      argv: ["browser"],
      platform: "browser",
      version: "browser",
      versions: { node: "browser" },
      cwd: () => "/",
      exit: (code) => {
        this.logger.warning("process.exit not available in browser");
        throw new Error(`Process exit with code ${code}`);
      },
      nextTick: (callback, ...args) => {
        setTimeout(() => callback(...args), 0);
      }
    };
  }
};

// src/lib/A-Polyfill/A-Polyfill.component.ts
exports.A_Polyfill = class A_Polyfill extends aConcept.A_Component {
  constructor(logger) {
    super();
    this.logger = logger;
    this._initializing = null;
  }
  /**
   * Indicates whether the channel is connected
   */
  get ready() {
    if (!this._initialized) {
      this._initialized = this._loadInternal();
    }
    return this._initialized;
  }
  async load() {
    await this.ready;
  }
  async attachToWindow() {
    if (aConcept.A_Context.environment !== "browser") return;
    globalThis.A_Polyfill = this;
    globalThis.process = { env: { NODE_ENV: "production" }, cwd: () => "/" };
    globalThis.__dirname = "/";
  }
  async _loadInternal() {
    this._fsPolyfill = new A_FSPolyfillClass(this.logger);
    this._cryptoPolyfill = new A_CryptoPolyfillClass(this.logger);
    this._httpPolyfill = new A_HttpPolyfillClass(this.logger);
    this._httpsPolyfill = new A_HttpsPolyfillClass(this.logger);
    this._pathPolyfill = new A_PathPolyfillClass(this.logger);
    this._urlPolyfill = new A_UrlPolyfillClass(this.logger);
    this._bufferPolyfill = new A_BufferPolyfillClass(this.logger);
    this._processPolyfill = new A_ProcessPolyfillClass(this.logger);
    await this._fsPolyfill.get();
    await this._cryptoPolyfill.get(await this._fsPolyfill.get());
    await this._httpPolyfill.get();
    await this._httpsPolyfill.get();
    await this._pathPolyfill.get();
    await this._urlPolyfill.get();
    await this._bufferPolyfill.get();
    await this._processPolyfill.get();
  }
  /**
   * Allows to use the 'fs' polyfill methods regardless of the environment
   * This method loads the 'fs' polyfill and returns its instance
   * 
   * @returns 
   */
  async fs() {
    await this.ready;
    return await this._fsPolyfill.get();
  }
  /**
   * Allows to use the 'crypto' polyfill methods regardless of the environment
   * This method loads the 'crypto' polyfill and returns its instance
   * 
   * @returns 
   */
  async crypto() {
    await this.ready;
    return await this._cryptoPolyfill.get();
  }
  /**
   * Allows to use the 'http' polyfill methods regardless of the environment
   * This method loads the 'http' polyfill and returns its instance
   * 
   * @returns 
   */
  async http() {
    await this.ready;
    return await this._httpPolyfill.get();
  }
  /**
   * Allows to use the 'https' polyfill methods regardless of the environment
   * This method loads the 'https' polyfill and returns its instance
   * 
   * @returns 
   */
  async https() {
    await this.ready;
    return await this._httpsPolyfill.get();
  }
  /**
   * Allows to use the 'path' polyfill methods regardless of the environment
   * This method loads the 'path' polyfill and returns its instance
   * 
   * @returns 
   */
  async path() {
    await this.ready;
    return await this._pathPolyfill.get();
  }
  /**
   * Allows to use the 'url' polyfill methods regardless of the environment
   * This method loads the 'url' polyfill and returns its instance
   * 
   * @returns 
   */
  async url() {
    await this.ready;
    return await this._urlPolyfill.get();
  }
  /**
   * Allows to use the 'buffer' polyfill methods regardless of the environment
   * This method loads the 'buffer' polyfill and returns its instance
   * 
   * @returns 
   */
  async buffer() {
    await this.ready;
    return await this._bufferPolyfill.get();
  }
  /**
   * Allows to use the 'process' polyfill methods regardless of the environment
   * This method loads the 'process' polyfill and returns its instance
   * 
   * @returns 
   */
  async process() {
    await this.ready;
    return await this._processPolyfill.get();
  }
};
__decorateClass([
  aConcept.A_Concept.Load()
], exports.A_Polyfill.prototype, "load", 1);
__decorateClass([
  aConcept.A_Concept.Load()
], exports.A_Polyfill.prototype, "attachToWindow", 1);
exports.A_Polyfill = __decorateClass([
  __decorateParam(0, aConcept.A_Inject(exports.A_Logger))
], exports.A_Polyfill);
var A_ConfigError = class extends aConcept.A_Error {
};
A_ConfigError.InitializationError = "A-Config Initialization Error";
exports.ConfigReader = class ConfigReader extends aConcept.A_Component {
  constructor(polyfill) {
    super();
    this.polyfill = polyfill;
  }
  async attachContext(container, feature, config) {
    if (!config) {
      config = new A_Config({
        variables: [
          ...aConcept.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
          ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
        ],
        defaults: {}
      });
      container.scope.register(config);
    }
    const rootDir = await this.getProjectRoot();
    config.set("A_CONCEPT_ROOT_FOLDER", rootDir);
  }
  async initialize(config) {
    const data = await this.read([
      ...config.CONFIG_PROPERTIES,
      ...aConcept.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
      ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ]);
    config.set(data);
  }
  /**
   * Get the configuration property by Name
   * @param property 
   */
  resolve(property) {
    return property;
  }
  /**
   * This method reads the configuration and sets the values to the context
   * 
   * @returns 
   */
  async read(variables = []) {
    return {};
  }
  /**
   * Finds the root directory of the project by locating the folder containing package.json
   * 
   * @param {string} startPath - The initial directory to start searching from (default is __dirname)
   * @returns {string|null} - The path to the root directory or null if package.json is not found
   */
  async getProjectRoot(startPath = __dirname) {
    return process.cwd();
  }
};
__decorateClass([
  aConcept.A_Concept.Load(),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Container)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Feature)),
  __decorateParam(2, aConcept.A_Inject(A_Config))
], exports.ConfigReader.prototype, "attachContext", 1);
__decorateClass([
  aConcept.A_Concept.Load(),
  __decorateParam(0, aConcept.A_Inject(A_Config))
], exports.ConfigReader.prototype, "initialize", 1);
exports.ConfigReader = __decorateClass([
  __decorateParam(0, aConcept.A_Inject(exports.A_Polyfill))
], exports.ConfigReader);

// src/lib/A-Config/components/FileConfigReader.component.ts
var FileConfigReader = class extends exports.ConfigReader {
  constructor() {
    super(...arguments);
    this.FileData = /* @__PURE__ */ new Map();
  }
  /**
   * Get the configuration property Name
   * @param property 
   */
  getConfigurationProperty_File_Alias(property) {
    return aConcept.A_FormatterHelper.toCamelCase(property);
  }
  resolve(property) {
    return this.FileData.get(this.getConfigurationProperty_File_Alias(property));
  }
  async read(variables) {
    const fs = await this.polyfill.fs();
    try {
      const data = fs.readFileSync(`${aConcept.A_Context.concept}.conf.json`, "utf8");
      const config = JSON.parse(data);
      this.FileData = new Map(Object.entries(config));
      return config;
    } catch (error) {
      return {};
    }
  }
};
var ENVConfigReader = class extends exports.ConfigReader {
  async readEnvFile(config, polyfill, feature) {
    const fs = await polyfill.fs();
    if (fs.existsSync(".env"))
      fs.readFileSync(`${config.get("A_CONCEPT_ROOT_FOLDER")}/.env`, "utf-8").split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
  }
  /**
   * Get the configuration property Name 
   * @param property 
   */
  getConfigurationProperty_ENV_Alias(property) {
    return aConcept.A_FormatterHelper.toUpperSnakeCase(property);
  }
  resolve(property) {
    return process.env[this.getConfigurationProperty_ENV_Alias(property)];
  }
  async read(variables = []) {
    const allVariables = [
      ...variables,
      ...Object.keys(process.env)
    ];
    const config = {};
    allVariables.forEach((variable) => {
      config[variable] = this.resolve(variable);
    });
    return config;
  }
};
__decorateClass([
  aConcept.A_Concept.Load({
    before: ["ENVConfigReader.initialize"]
  }),
  __decorateParam(0, aConcept.A_Inject(A_Config)),
  __decorateParam(1, aConcept.A_Inject(exports.A_Polyfill)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Feature))
], ENVConfigReader.prototype, "readEnvFile", 1);

// src/lib/A-Config/A-Config.container.ts
var A_ConfigLoader = class extends aConcept.A_Container {
  async prepare(polyfill) {
    if (!this.scope.has(A_Config)) {
      const newConfig = new A_Config({
        variables: [
          ...aConcept.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
          ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
        ],
        defaults: {}
      });
      this.scope.register(newConfig);
    }
    const fs = await polyfill.fs();
    try {
      switch (true) {
        case (aConcept.A_Context.environment === "server" && !!fs.existsSync(`${aConcept.A_Context.concept}.conf.json`)):
          this.reader = this.scope.resolve(FileConfigReader);
          break;
        case (aConcept.A_Context.environment === "server" && !fs.existsSync(`${aConcept.A_Context.concept}.conf.json`)):
          this.reader = this.scope.resolve(ENVConfigReader);
          break;
        case aConcept.A_Context.environment === "browser":
          this.reader = this.scope.resolve(ENVConfigReader);
          break;
        default:
          throw new A_ConfigError(
            A_ConfigError.InitializationError,
            `Environment ${aConcept.A_Context.environment} is not supported`
          );
      }
    } catch (error) {
      if (error instanceof aConcept.A_ScopeError) {
        throw new A_ConfigError({
          title: A_ConfigError.InitializationError,
          description: `Failed to initialize A_ConfigLoader. Reader not found for environment ${aConcept.A_Context.environment}`,
          originalError: error
        });
      }
    }
  }
};
__decorateClass([
  aConcept.A_Concept.Load({
    before: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(exports.A_Polyfill))
], A_ConfigLoader.prototype, "prepare", 1);

// src/lib/A-Config/A-Config.types.ts
var A_TYPES__ConfigFeature = /* @__PURE__ */ ((A_TYPES__ConfigFeature2) => {
  return A_TYPES__ConfigFeature2;
})(A_TYPES__ConfigFeature || {});
var A_ManifestError = class extends aConcept.A_Error {
};
A_ManifestError.ManifestInitializationError = "A-Manifest Initialization Error";

// src/lib/A-Manifest/classes/A-ManifestChecker.class.ts
var A_ManifestChecker = class {
  constructor(manifest, component, method, checkExclusion = false) {
    this.manifest = manifest;
    this.component = component;
    this.method = method;
    this.checkExclusion = checkExclusion;
  }
  for(target) {
    const result = this.manifest.internal_checkAccess({
      component: this.component,
      method: this.method,
      target
    });
    return this.checkExclusion ? !result : result;
  }
};

// src/lib/A-Manifest/A-Manifest.context.ts
var A_Manifest = class extends aConcept.A_Fragment {
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
  constructor(config = []) {
    super({
      name: "A-Manifest"
    });
    this.rules = [];
    this.prepare(config);
  }
  /**
   * Should convert received configuration into internal Regexp applicable for internal storage
   */
  prepare(config) {
    if (!aConcept.A_TypeGuards.isArray(config))
      throw new A_ManifestError(
        A_ManifestError.ManifestInitializationError,
        `A-Manifest configuration should be an array of configurations`
      );
    for (const item of config) {
      this.processConfigItem(item);
    }
  }
  /**
   * Process a single configuration item and convert it to internal rules
   */
  processConfigItem(item) {
    if (!aConcept.A_TypeGuards.isComponentConstructor(item.component))
      throw new A_ManifestError(
        A_ManifestError.ManifestInitializationError,
        `A-Manifest configuration item should be a A-Component constructor`
      );
    const componentRegex = this.constructorToRegex(item.component);
    if (item.apply || item.exclude) {
      const methodRegex = /.*/;
      this.rules.push({
        componentRegex,
        methodRegex,
        applyRegex: item.apply ? this.allowedComponentsToRegex(item.apply) : void 0,
        excludeRegex: item.exclude ? this.allowedComponentsToRegex(item.exclude) : void 0
      });
    }
    if (item.methods && item.methods.length > 0) {
      for (const methodConfig of item.methods) {
        const methodRegex = this.methodToRegex(methodConfig.method);
        this.rules.push({
          componentRegex,
          methodRegex,
          applyRegex: methodConfig.apply ? this.allowedComponentsToRegex(methodConfig.apply) : void 0,
          excludeRegex: methodConfig.exclude ? this.allowedComponentsToRegex(methodConfig.exclude) : void 0
        });
      }
    }
  }
  /**
   * Convert a constructor to a regex pattern
   */
  constructorToRegex(ctor) {
    return new RegExp(`^${this.escapeRegex(ctor.name)}$`);
  }
  /**
   * Convert a method name or regex to a regex pattern
   */
  methodToRegex(method) {
    if (method instanceof RegExp) {
      return method;
    }
    return new RegExp(`^${this.escapeRegex(method)}$`);
  }
  /**
   * Convert allowed components array or regex to a single regex
   */
  allowedComponentsToRegex(components) {
    if (components instanceof RegExp) {
      return components;
    }
    const patterns = components.map((ctor) => this.escapeRegex(ctor.name));
    return new RegExp(`^(${patterns.join("|")})$`);
  }
  /**
   * Escape special regex characters in a string
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  configItemToRegexp(item) {
    return this.constructorToRegex(item);
  }
  ID(component, method) {
    return `${component.name}.${method}`;
  }
  /**
   * Check if a component and method combination is allowed for a target
   */
  isAllowed(ctor, method) {
    const componentCtor = typeof ctor === "function" ? ctor : ctor.constructor;
    return new A_ManifestChecker(this, componentCtor, method);
  }
  /**
   * Internal method to check if access is allowed
   */
  internal_checkAccess(query) {
    const componentName = query.component.name;
    const methodName = query.method;
    const targetName = query.target.name;
    const matchingRules = this.rules.filter(
      (rule) => rule.componentRegex.test(componentName) && rule.methodRegex.test(methodName)
    ).sort((a, b) => {
      const aIsGeneral = a.methodRegex.source === ".*";
      const bIsGeneral = b.methodRegex.source === ".*";
      if (aIsGeneral && !bIsGeneral) return 1;
      if (!aIsGeneral && bIsGeneral) return -1;
      return 0;
    });
    if (matchingRules.length === 0) {
      return true;
    }
    for (const rule of matchingRules) {
      if (rule.excludeRegex && rule.excludeRegex.test(targetName)) {
        return false;
      }
      if (rule.applyRegex) {
        return rule.applyRegex.test(targetName);
      }
    }
    return true;
  }
  isExcluded(ctor, method) {
    const componentCtor = typeof ctor === "function" ? ctor : ctor.constructor;
    return new A_ManifestChecker(this, componentCtor, method, true);
  }
};
var A_MemoryContext = class extends aConcept.A_Fragment {
  set(param, value) {
    super.set(param, value);
  }
  get(param) {
    return super.get(param);
  }
};
var A_MemoryError = class extends aConcept.A_Error {
};
A_MemoryError.MemoryInitializationError = "Memory initialization error";
A_MemoryError.MemoryDestructionError = "Memory destruction error";
A_MemoryError.MemoryGetError = "Memory GET operation failed";
A_MemoryError.MemorySetError = "Memory SET operation failed";
A_MemoryError.MemoryDropError = "Memory DROP operation failed";
A_MemoryError.MemoryClearError = "Memory CLEAR operation failed";
A_MemoryError.MemoryHasError = "Memory HAS operation failed";
A_MemoryError.MemorySerializeError = "Memory toJSON operation failed";

// src/lib/A-Memory/A-Memory.component.ts
var _a3, _b3, _c3, _d3, _e2, _f2, _g2, _h2, _i2;
var A_Memory = class extends aConcept.A_Component {
  get ready() {
    if (!this._ready) {
      this._ready = this.init();
    }
    return this._ready;
  }
  /**
   * Handles errors during memory operations
   */
  async [_i2 = "onError" /* onError */](...args) {
  }
  /**
   * Handles memory expiration
   */
  async [_h2 = "onExpire" /* onExpire */](...args) {
  }
  /**
   * Initializes the memory context
   */
  async [_g2 = "onInit" /* onInit */](context, ...args) {
    if (!context) {
      context = new A_MemoryContext();
      aConcept.A_Context.scope(this).register(context);
    }
  }
  async [_f2 = "onDestroy" /* onDestroy */](context, ...args) {
    context.clear();
  }
  /**
   * Handles the 'get' operation for retrieving a value from memory
   */
  async [_e2 = "onGet" /* onGet */](operation, context, ...args) {
    operation.succeed(context.get(operation.params.key));
  }
  /**
   * Handles the 'has' operation for checking existence of a key in memory
   */
  async [_d3 = "onHas" /* onHas */](operation, context, ...args) {
    operation.succeed(context.has(operation.params.key));
  }
  /**
   * Handles the 'set' operation for saving a value in memory
   */
  async [_c3 = "onSet" /* onSet */](operation, context, ...args) {
    context.set(operation.params.key, operation.params.value);
  }
  /**
   * Handles the 'drop' operation for removing a value from memory
   */
  async [_b3 = "onDrop" /* onDrop */](operation, context, ...args) {
    context.drop(operation.params.key);
  }
  /**
   * Handles the 'clear' operation for clearing all values from memory
   */
  async [_a3 = "onClear" /* onClear */](operation, context, ...args) {
    context.clear();
  }
  // ======================================================================
  // =========================A-Memory Methods=============================
  // ======================================================================
  /**
   * Initializes the memory context
   */
  async init() {
    if (this._ready)
      return this._ready;
    const scope = new aConcept.A_Scope({ name: "A-Memory-Init-Scope" }).inherit(aConcept.A_Context.scope(this));
    try {
      await this.call("onInit" /* onInit */, scope);
    } catch (error) {
      const initError = new A_MemoryError({
        title: A_MemoryError.MemoryInitializationError,
        description: "An error occurred during memory initialization",
        originalError: error
      });
      scope.register(initError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw initError;
    }
  }
  /**
   * Destroys the memory context
   *
   * This method is responsible for cleaning up any resources
   * used by the memory context and resetting its state.
   */
  async destroy() {
    const scope = new aConcept.A_Scope({ name: "A-Memory-Destroy-Scope" }).inherit(aConcept.A_Context.scope(this));
    try {
      this._ready = void 0;
      await this.call("onDestroy" /* onDestroy */, scope);
    } catch (error) {
      const destroyError = new A_MemoryError({
        title: A_MemoryError.MemoryDestructionError,
        description: "An error occurred during memory destruction",
        originalError: error
      });
      scope.register(destroyError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw destroyError;
    }
  }
  /**
    * Retrieves a value from the context memory
    * 
    * @param key - memory key to retrieve
    * @returns - value associated with the key or undefined if not found
    */
  async get(key) {
    const operation = new A_OperationContext("get", { key });
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Get-Operation-Scope",
      fragments: [operation]
    });
    try {
      await this.call("onGet" /* onGet */, scope);
      scope.destroy();
      return operation.result;
    } catch (error) {
      const getError = new A_MemoryError({
        title: A_MemoryError.MemoryGetError,
        description: `An error occurred while getting the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(getError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw getError;
    }
  }
  /**
   * Checks if a value exists in the context memory
   * 
   * @param key - memory key to check
   * @returns - true if key exists, false otherwise
   */
  async has(key) {
    const operation = new A_OperationContext("has", { key });
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Has-Operation-Scope",
      fragments: [operation]
    });
    try {
      await this.call("onHas" /* onHas */, scope);
      scope.destroy();
      return operation.result;
    } catch (error) {
      const getError = new A_MemoryError({
        title: A_MemoryError.MemoryHasError,
        description: `An error occurred while checking existence for key "${String(key)}"`,
        originalError: error
      });
      scope.register(getError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw getError;
    }
  }
  /**
   * Saves a value in the context memory
   * 
   * @param key 
   * @param value 
   */
  async set(key, value) {
    const operation = new A_OperationContext("set", { key, value });
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Set-Operation-Scope",
      fragments: [operation]
    });
    try {
      await this.call("onSet" /* onSet */, scope);
    } catch (error) {
      const setError = new A_MemoryError({
        title: A_MemoryError.MemorySetError,
        description: `An error occurred while setting the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(setError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw setError;
    }
  }
  /**
   * Removes a value from the context memory by key
   * 
   * @param key 
   */
  async drop(key) {
    const operation = new A_OperationContext("drop", { key });
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Drop-Operation-Scope",
      fragments: [operation]
    });
    try {
      await this.call("onDrop" /* onDrop */, scope);
    } catch (error) {
      const dropError = new A_MemoryError({
        title: A_MemoryError.MemoryDropError,
        description: `An error occurred while dropping the value for key "${String(key)}"`,
        originalError: error
      });
      scope.register(dropError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw dropError;
    }
  }
  /**
   * Clears all stored values in the context memory
   */
  async clear() {
    const operation = new A_OperationContext("clear");
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Clear-Operation-Scope",
      fragments: [operation]
    });
    try {
      await this.call("onClear" /* onClear */, scope);
    } catch (error) {
      const clearError = new A_MemoryError({
        title: A_MemoryError.MemoryClearError,
        description: `An error occurred while clearing the memory`,
        originalError: error
      });
      scope.register(clearError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw clearError;
    }
  }
  /**
   * Serializes the memory context to a JSON object
   *  
   * @returns - serialized memory object 
   */
  async toJSON() {
    const operation = new A_OperationContext("serialize");
    const scope = new aConcept.A_Scope({
      name: "A-Memory-Serialize-Operation-Scope",
      fragments: [operation]
    });
    try {
      await this.call("onSerialize" /* onSerialize */, scope);
      return operation.result;
    } catch (error) {
      const serializeError = new A_MemoryError({
        title: A_MemoryError.MemorySerializeError,
        description: `An error occurred while serializing the memory`,
        originalError: error
      });
      scope.register(serializeError);
      await this.call("onError" /* onError */, scope);
      scope.destroy();
      throw serializeError;
    }
  }
};
__decorateClass([
  aConcept.A_Feature.Extend()
], A_Memory.prototype, _i2, 1);
__decorateClass([
  aConcept.A_Feature.Extend()
], A_Memory.prototype, _h2, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(A_MemoryContext))
], A_Memory.prototype, _g2, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Inject(A_MemoryContext))
], A_Memory.prototype, _f2, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(A_MemoryContext))
], A_Memory.prototype, _e2, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(A_MemoryContext))
], A_Memory.prototype, _d3, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(A_MemoryContext))
], A_Memory.prototype, _c3, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(A_MemoryContext))
], A_Memory.prototype, _b3, 1);
__decorateClass([
  aConcept.A_Feature.Extend(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(A_OperationContext)),
  __decorateParam(1, aConcept.A_Inject(A_MemoryContext))
], A_Memory.prototype, _a3, 1);

// src/lib/A-Schedule/A-Deferred.class.ts
var A_Deferred = class {
  /**
   * Creates a deferred promise
   * @returns A promise that can be resolved or rejected later
   */
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }
  resolve(value) {
    this.resolveFn(value);
  }
  reject(reason) {
    this.rejectFn(reason);
  }
};
var A_ScheduleObject = class {
  /**
   * Creates a scheduled object that will execute the action after specified milliseconds
   * 
   * 
   * @param ms - milliseconds to wait before executing the action
   * @param action - the action to execute
   * @param config - configuration options for the schedule object
   */
  constructor(ms, action, config) {
    this.config = {
      /**
       * If the timeout is cleared, should the promise resolve or reject?
       * BY Default it rejects
       * 
       * !!!NOTE: If the property is set to true, the promise will resolve with undefined
       */
      resolveOnClear: false
    };
    if (config)
      this.config = { ...this.config, ...config };
    this.deferred = new A_Deferred();
    this.timeout = setTimeout(
      () => action().then((...args) => this.deferred.resolve(...args)).catch((...args) => this.deferred.reject(...args)),
      ms
    );
  }
  get promise() {
    return this.deferred.promise;
  }
  clear() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      if (this.config.resolveOnClear)
        this.deferred.resolve(void 0);
      else
        this.deferred.reject(new aConcept.A_Error("Timeout Cleared"));
    }
  }
};

// src/lib/A-Schedule/A-Schedule.component.ts
var A_Schedule = class extends aConcept.A_Component {
  async schedule(date, callback, config) {
    const timestamp = aConcept.A_TypeGuards.isString(date) ? new Date(date).getTime() : date;
    return new A_ScheduleObject(
      timestamp - Date.now(),
      callback,
      config
    );
  }
  /**
   * Allows to execute callback after particular delay in milliseconds
   * So the callback will be executed after the specified delay
   * 
   * @param ms 
   */
  async delay(ms, callback, config) {
    return new A_ScheduleObject(
      ms,
      callback,
      config
    );
  }
};

exports.A_CONSTANTS__CONFIG_ENV_VARIABLES = A_CONSTANTS__CONFIG_ENV_VARIABLES;
exports.A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY = A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY;
exports.A_Channel = A_Channel;
exports.A_ChannelError = A_ChannelError;
exports.A_ChannelFeatures = A_ChannelFeatures;
exports.A_ChannelRequestStatuses = A_ChannelRequestStatuses;
exports.A_Command = A_Command;
exports.A_CommandError = A_CommandError;
exports.A_CommandFeatures = A_CommandFeatures;
exports.A_CommandTransitions = A_CommandTransitions;
exports.A_Command_Status = A_Command_Status;
exports.A_Config = A_Config;
exports.A_ConfigError = A_ConfigError;
exports.A_ConfigLoader = A_ConfigLoader;
exports.A_Deferred = A_Deferred;
exports.A_Manifest = A_Manifest;
exports.A_ManifestChecker = A_ManifestChecker;
exports.A_ManifestError = A_ManifestError;
exports.A_Memory = A_Memory;
exports.A_Schedule = A_Schedule;
exports.A_ScheduleObject = A_ScheduleObject;
exports.A_TYPES__ConfigFeature = A_TYPES__ConfigFeature;
exports.ENVConfigReader = ENVConfigReader;
exports.FileConfigReader = FileConfigReader;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map