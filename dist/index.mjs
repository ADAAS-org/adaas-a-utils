import { A_Inject, A_Scope, A_Feature, A_Concept, A_Container, A_Error, A_TypeGuards, A_Fragment, A_Component, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_CommonHelper, A_FormatterHelper, A_Context, A_IdentityHelper, A_Entity, A_ScopeError } from '@adaas/a-concept';

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
var A_ChannelRequest = class extends A_Fragment {
  constructor(params = {}) {
    super();
    this._errors = /* @__PURE__ */ new Set();
    this._status = "PENDING" /* PENDING */;
    this._params = params;
  }
  /**
   * Returns the status of the request
   */
  get status() {
    return this._status;
  }
  /**
   * Returns the parameters of the request
   */
  get failed() {
    return this._errors.size > 0;
  }
  /**
   * Returns the Params of the Request
   */
  get params() {
    return this._params;
  }
  /**
   * Returns the Result of the Request
   */
  get data() {
    return this._result;
  }
  get errors() {
    return this._errors.size > 0 ? this._errors : void 0;
  }
  // ==========================================================
  // ==================== Mutations ===========================
  // ==========================================================
  /**
   * Adds an error to the context
   * 
   * @param error 
   */
  fail(error) {
    this._status = "FAILED" /* FAILED */;
    this._errors.add(error);
  }
  /**
   * Sets the result of the request
   * 
   * @param result 
   */
  succeed(result) {
    this._status = "SUCCESS" /* SUCCESS */;
    this._result = result;
  }
  /**
   * Serializes the context to a JSON object
   * 
   * @returns 
   */
  toJSON() {
    return {
      params: this._params,
      result: this._result,
      status: this._status,
      errors: this.errors ? Array.from(this._errors).map((err) => err.toString()) : void 0
    };
  }
};

// src/lib/A-Channel/A-Channel.error.ts
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
    if (context instanceof A_ChannelRequest)
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

// src/lib/A-Config/A-Config.constants.ts
var A_CONSTANTS__CONFIG_ENV_VARIABLES = {};
var A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY = [];

// src/lib/A-Config/A-Config.context.ts
var A_Config = class extends A_Fragment {
  constructor(config) {
    super({
      name: "A_Config"
    });
    this.VARIABLES = /* @__PURE__ */ new Map();
    this.DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
      ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
      ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];
    this.config = A_CommonHelper.deepCloneAndMerge(config, {
      strict: false,
      defaults: {},
      variables: A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY
    });
    this.CONFIG_PROPERTIES = this.config.variables ? this.config.variables : [];
    this.config.variables.forEach((variable) => {
      this.VARIABLES.set(
        A_FormatterHelper.toUpperSnakeCase(variable),
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
      return this.VARIABLES.get(A_FormatterHelper.toUpperSnakeCase(property));
    throw new Error("Property not exists or not allowed to read");
  }
  set(property, value) {
    const array = Array.isArray(property) ? property : typeof property === "string" ? [{ property, value }] : Object.keys(property).map((key) => ({
      property: key,
      value: property[key]
    }));
    for (const { property: property2, value: value2 } of array) {
      let targetValue = value2 ? value2 : this.config?.defaults ? this.config.defaults[property2] : void 0;
      this.VARIABLES.set(A_FormatterHelper.toUpperSnakeCase(property2), targetValue);
    }
  }
};

// src/lib/A-Logger/A-Logger.component.ts
var A_Logger = class extends A_Component {
  constructor(scope) {
    super();
    this.scope = scope;
    this.colors = {
      green: "32",
      blue: "34",
      red: "31",
      yellow: "33",
      gray: "90",
      magenta: "35",
      cyan: "36",
      white: "37",
      pink: "95"
    };
    this.config = this.scope.has(A_Config) ? this.scope.resolve(A_Config) : void 0;
  }
  get scopeLength() {
    return this.scope.name.length;
  }
  compile(color, ...args) {
    return [
      `\x1B[${this.colors[color]}m[${this.scope.name}] |${this.getTime()}|`,
      args.length > 1 ? `
${" ".repeat(this.scopeLength + 3)}|-------------------------------` : "",
      ...args.map((arg, i) => {
        switch (true) {
          case arg instanceof A_Error:
            return this.compile_A_Error(arg);
          case arg instanceof Error:
            return this.compile_Error(arg);
          case typeof arg === "object":
            return JSON.stringify(arg, null, 2).replace(/\n/g, `
${" ".repeat(this.scopeLength + 3)}| `);
          default:
            return String(
              (i > 0 || args.length > 1 ? "\n" : "") + arg
            ).replace(/\n/g, `
${" ".repeat(this.scopeLength + 3)}| `);
        }
      }),
      args.length > 1 ? `
${" ".repeat(this.scopeLength + 3)}|-------------------------------\x1B[0m` : "\x1B[0m"
    ];
  }
  get allowedToLog() {
    return this.config ? this.config.get("CONFIG_VERBOSE") !== void 0 && this.config.get("CONFIG_VERBOSE") !== "false" && this.config.get("CONFIG_VERBOSE") !== false : true;
  }
  log(param1, ...args) {
    if (!this.allowedToLog)
      return;
    if (typeof param1 === "string" && this.colors[param1]) {
      console.log(...this.compile(param1, ...args));
      return;
    } else {
      console.log(...this.compile("blue", param1, ...args));
    }
  }
  warning(...args) {
    if (!this.allowedToLog)
      return;
    console.log(...this.compile("yellow", ...args));
  }
  error(...args) {
    if (this.config && this.config.get("CONFIG_IGNORE_ERRORS"))
      return;
    return console.log(...this.compile("red", ...args));
  }
  log_A_Error(error) {
    const time = this.getTime();
    console.log(`\x1B[31m[${this.scope.name}] |${time}| ERROR ${error.code}
${" ".repeat(this.scopeLength + 3)}| ${error.message}
${" ".repeat(this.scopeLength + 3)}| ${error.description} 
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${" ".repeat(this.scopeLength + 3)}| ${error.stack?.split("\n").map((line, index) => index === 0 ? line : `${" ".repeat(this.scopeLength + 3)}| ${line}`).join("\n") || "No stack trace"}
${" ".repeat(this.scopeLength + 3)}|-------------------------------
\x1B[0m` + (error.originalError ? `\x1B[31m${" ".repeat(this.scopeLength + 3)}| Wrapped From  ${error.originalError.message}
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${" ".repeat(this.scopeLength + 3)}| ${error.originalError.stack?.split("\n").map((line, index) => index === 0 ? line : `${" ".repeat(this.scopeLength + 3)}| ${line}`).join("\n") || "No stack trace"}
${" ".repeat(this.scopeLength + 3)}|-------------------------------
\x1B[0m` : "") + (error.link ? `\x1B[31m${" ".repeat(this.scopeLength + 3)}| Read in docs: ${error.link}
${" ".repeat(this.scopeLength + 3)}|-------------------------------
\x1B[0m` : ""));
  }
  compile_A_Error(error) {
    this.getTime();
    return `
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${" ".repeat(this.scopeLength + 3)}|  Error:  | ${error.code}
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${" ".repeat(this.scopeLength + 3)}|${" ".repeat(10)}| ${error.message}
${" ".repeat(this.scopeLength + 3)}|${" ".repeat(10)}| ${error.description} 
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${" ".repeat(this.scopeLength + 3)}| ${error.stack?.split("\n").map((line, index) => index === 0 ? line : `${" ".repeat(this.scopeLength + 3)}| ${line}`).join("\n") || "No stack trace"}
${" ".repeat(this.scopeLength + 3)}|-------------------------------` + (error.originalError ? `${" ".repeat(this.scopeLength + 3)}| Wrapped From  ${error.originalError.message}
${" ".repeat(this.scopeLength + 3)}|-------------------------------
${" ".repeat(this.scopeLength + 3)}| ${error.originalError.stack?.split("\n").map((line, index) => index === 0 ? line : `${" ".repeat(this.scopeLength + 3)}| ${line}`).join("\n") || "No stack trace"}
${" ".repeat(this.scopeLength + 3)}|-------------------------------` : "") + (error.link ? `${" ".repeat(this.scopeLength + 3)}| Read in docs: ${error.link}
${" ".repeat(this.scopeLength + 3)}|-------------------------------` : "");
  }
  compile_Error(error) {
    return JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack?.split("\n").map((line, index) => index === 0 ? line : `${" ".repeat(this.scopeLength + 3)}| ${line}`).join("\n")
    }, null, 2).replace(/\n/g, `
${" ".repeat(this.scopeLength + 3)}| `).replace(/\\n/g, "\n");
  }
  getTime() {
    const now = /* @__PURE__ */ new Date();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(4, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  }
};
A_Logger = __decorateClass([
  __decorateParam(0, A_Inject(A_Scope))
], A_Logger);

// src/lib/A-Channel/A-Channel.component.ts
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
    const requestScope = new A_Scope({
      name: `a-channel@scope:request:${A_IdentityHelper.generateTimeId()}`
    });
    const context = new A_ChannelRequest(params);
    try {
      requestScope.inherit(A_Context.scope(this));
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
      await this.call("onError" /* onError */, requestScope);
      return context;
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
    });
    const context = new A_ChannelRequest(message);
    try {
      requestScope.inherit(A_Context.scope(this));
      requestScope.register(context);
      await this.call("onSend" /* onSend */, requestScope);
      this._processing = false;
    } catch (error) {
      this._processing = false;
      const channelError = new A_ChannelError(error);
      context.fail(channelError);
      await this.call("onError" /* onError */, requestScope);
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
    const requestScope = new A_Scope({ name: `a-channel@scope:consume:${A_IdentityHelper.generateTimeId()}` });
    const context = new A_ChannelRequest();
    try {
      requestScope.inherit(A_Context.scope(this));
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
  A_Feature.Extend({
    name: "onConnect" /* onConnect */
  })
], A_Channel.prototype, "onConnect", 1);
__decorateClass([
  A_Feature.Extend({
    name: "onDisconnect" /* onDisconnect */
  })
], A_Channel.prototype, "onDisconnect", 1);
__decorateClass([
  A_Feature.Extend({
    name: "onBeforeRequest" /* onBeforeRequest */
  })
], A_Channel.prototype, "onBeforeRequest", 1);
__decorateClass([
  A_Feature.Extend({
    name: "onRequest" /* onRequest */
  })
], A_Channel.prototype, "onRequest", 1);
__decorateClass([
  A_Feature.Extend({
    name: "onAfterRequest" /* onAfterRequest */
  })
], A_Channel.prototype, "onAfterRequest", 1);
__decorateClass([
  A_Feature.Extend({
    name: "onError" /* onError */
  })
], A_Channel.prototype, "onError", 1);
__decorateClass([
  A_Feature.Extend({
    name: "onSend" /* onSend */
  })
], A_Channel.prototype, "onSend", 1);
var HttpChannel = class extends A_Channel {
};
var PollyspotChannel = class extends HttpChannel {
  constructor() {
    super();
    this.baseUrl = "https://pollyspot.example.com";
  }
};
var GlobalErrorhandler = class extends A_Component {
  async handleError(context, logger, config) {
  }
  async anotherError(context, logger, config) {
  }
};
__decorateClass([
  A_Feature.Extend({
    name: "onError" /* onError */,
    scope: [PollyspotChannel]
  }),
  __decorateParam(0, A_Inject(A_ChannelRequest)),
  __decorateParam(1, A_Inject(A_Logger)),
  __decorateParam(2, A_Inject(A_Config))
], GlobalErrorhandler.prototype, "handleError", 1);
__decorateClass([
  A_Feature.Extend({
    name: "onError" /* onError */
  }),
  __decorateParam(0, A_Inject(A_ChannelRequest)),
  __decorateParam(1, A_Inject(A_Logger)),
  __decorateParam(2, A_Inject(A_Config))
], GlobalErrorhandler.prototype, "anotherError", 1);

// src/lib/A-Command/A-Command.constants.ts
var A_TYPES__CommandMetaKey = /* @__PURE__ */ ((A_TYPES__CommandMetaKey2) => {
  A_TYPES__CommandMetaKey2["EXTENSIONS"] = "a-command-extensions";
  A_TYPES__CommandMetaKey2["FEATURES"] = "a-command-features";
  A_TYPES__CommandMetaKey2["ABSTRACTIONS"] = "a-command-abstractions";
  return A_TYPES__CommandMetaKey2;
})(A_TYPES__CommandMetaKey || {});
var A_CONSTANTS__A_Command_Status = /* @__PURE__ */ ((A_CONSTANTS__A_Command_Status2) => {
  A_CONSTANTS__A_Command_Status2["CREATED"] = "CREATED";
  A_CONSTANTS__A_Command_Status2["INITIALIZATION"] = "INITIALIZATION";
  A_CONSTANTS__A_Command_Status2["INITIALIZED"] = "INITIALIZED";
  A_CONSTANTS__A_Command_Status2["COMPILATION"] = "COMPILATION";
  A_CONSTANTS__A_Command_Status2["COMPILED"] = "COMPILED";
  A_CONSTANTS__A_Command_Status2["IN_PROGRESS"] = "IN_PROGRESS";
  A_CONSTANTS__A_Command_Status2["COMPLETED"] = "COMPLETED";
  A_CONSTANTS__A_Command_Status2["FAILED"] = "FAILED";
  return A_CONSTANTS__A_Command_Status2;
})(A_CONSTANTS__A_Command_Status || {});
var A_CONSTANTS_A_Command_Features = /* @__PURE__ */ ((A_CONSTANTS_A_Command_Features2) => {
  A_CONSTANTS_A_Command_Features2["INIT"] = "init";
  A_CONSTANTS_A_Command_Features2["COMPLIED"] = "complied";
  A_CONSTANTS_A_Command_Features2["EXECUTE"] = "execute";
  A_CONSTANTS_A_Command_Features2["COMPLETE"] = "complete";
  A_CONSTANTS_A_Command_Features2["FAIL"] = "fail";
  return A_CONSTANTS_A_Command_Features2;
})(A_CONSTANTS_A_Command_Features || {});
var A_Memory = class extends A_Fragment {
  /**
   * Memory object that allows to store intermediate values and errors
   * 
   * @param initialValues 
   */
  constructor(initialValues) {
    super();
    this._memory = new Map(Object.entries(initialValues || {}));
    this._errors = /* @__PURE__ */ new Set();
  }
  get Errors() {
    return this._errors.size > 0 ? this._errors : void 0;
  }
  /**
   * Verifies that all required keys are present in the proxy values
   * 
   * @param requiredKeys 
   * @returns 
   */
  async verifyPrerequisites(requiredKeys) {
    return requiredKeys.every((key) => this._memory.has(key));
  }
  /**
   * Adds an error to the context
   * 
   * @param error 
   */
  async error(error) {
    this._errors.add(error);
  }
  /**
   * Retrieves a value from the context memory
   * 
   * @param key 
   * @returns 
   */
  get(key) {
    return this._memory.get(key);
  }
  /**
   * Saves a value in the context memory
   * 
   * @param key 
   * @param value 
   */
  async set(key, value) {
    this._memory.set(key, value);
  }
  /**
   * Removes a value from the context memory by key
   * 
   * @param key 
   */
  async drop(key) {
    this._memory.delete(key);
  }
  /**
   * Clears all stored values in the context memory
   */
  async clear() {
    this._memory.clear();
  }
  /**
   * Converts all stored values to a plain object
   * 
   * [!] By default uses all saved in memory values 
   * 
   * @returns 
   */
  toJSON() {
    const obj = {};
    this._memory.forEach((value, key) => {
      obj[key] = typeof value === "object" && value !== null && "toJSON" in value && typeof value.toJSON === "function" ? value.toJSON() : value;
    });
    return obj;
  }
};
var A_CommandError = class extends A_Error {
};
A_CommandError.CommandScopeBindingError = "A-Command Scope Binding Error";

// src/lib/A-Command/A-Command.entity.ts
var A_Command = class extends A_Entity {
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
    this._listeners = /* @__PURE__ */ new Map();
  }
  // ====================================================================
  // ================== Static A-Command Information ====================
  // ====================================================================
  /**
   * Command Identifier that corresponds to the class name
   */
  static get code() {
    return super.entity;
  }
  /**
   * Execution Duration in milliseconds
   */
  get duration() {
    return this._endTime && this._startTime ? this._endTime.getTime() - this._startTime.getTime() : this._startTime ? (/* @__PURE__ */ new Date()).getTime() - this._startTime.getTime() : void 0;
  }
  /**
   * A shared scope between all features of the command during its execution
   */
  get scope() {
    return this._executionScope;
  }
  /**
   * Unique code identifying the command type
   * Example: 'user.create', 'task.complete', etc.
   * 
   */
  get code() {
    return this.constructor.code;
  }
  /**
   * Current status of the command
   */
  get status() {
    return this._status;
  }
  /**
   * Start time of the command execution
   */
  get startedAt() {
    return this._startTime;
  }
  /**
   * End time of the command execution
   */
  get endedAt() {
    return this._endTime;
  }
  /**
   * Result of the command execution stored in the context
   */
  get result() {
    return this._result;
  }
  /**
   * Errors encountered during the command execution stored in the context
   */
  get errors() {
    return this._errors;
  }
  /**
   * Parameters used to invoke the command
   */
  get params() {
    return this._params;
  }
  /**
   * Indicates if the command has failed
   */
  get isFailed() {
    return this._status === "FAILED" /* FAILED */;
  }
  /**
   * Indicates if the command has completed successfully
   */
  get isCompleted() {
    return this._status === "COMPLETED" /* COMPLETED */;
  }
  // --------------------------------------------------------------------------
  // A-Command Lifecycle Methods
  // --------------------------------------------------------------------------
  // should create a new Task in DB  with basic records
  async init() {
    if (this._status !== "CREATED" /* CREATED */) {
      return;
    }
    this._status = "INITIALIZATION" /* INITIALIZATION */;
    this._startTime = /* @__PURE__ */ new Date();
    this.checkScopeInheritance();
    this.emit("init");
    await this.call("init", this.scope);
    this._status = "INITIALIZED" /* INITIALIZED */;
  }
  // Should compile everything before execution
  async compile() {
    if (this._status !== "INITIALIZED" /* INITIALIZED */) {
      return;
    }
    this.checkScopeInheritance();
    this._status = "COMPILATION" /* COMPILATION */;
    this.emit("compile");
    await this.call("compile", this.scope);
    this._status = "COMPILED" /* COMPILED */;
  }
  /**
   * Processes the command execution
   * 
   * @returns 
   */
  async process() {
    if (this._status !== "COMPILED" /* COMPILED */)
      return;
    this._status = "IN_PROGRESS" /* IN_PROGRESS */;
    this.checkScopeInheritance();
    this.emit("execute");
    await this.call("execute", this.scope);
  }
  /**
   * Executes the command logic.
   */
  async execute() {
    this.checkScopeInheritance();
    try {
      await this.init();
      await this.compile();
      await this.process();
      await this.complete();
    } catch (error) {
      await this.fail();
    }
  }
  /**
   * Marks the command as completed
   */
  async complete() {
    this.checkScopeInheritance();
    this._status = "COMPLETED" /* COMPLETED */;
    this._endTime = /* @__PURE__ */ new Date();
    this._result = this.scope.resolve(A_Memory).toJSON();
    this.emit("complete");
    return await this.call("complete", this.scope);
  }
  /**
   * Marks the command as failed
   */
  async fail() {
    this.checkScopeInheritance();
    this._status = "FAILED" /* FAILED */;
    this._endTime = /* @__PURE__ */ new Date();
    this._errors = this.scope.resolve(A_Memory).Errors;
    this.emit("fail");
    return await this.call("fail", this.scope);
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
    this._listeners.get(event)?.forEach((listener) => {
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
    this._executionScope = new A_Scope();
    this._executionScope.register(new A_Memory());
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
    this._executionScope = new A_Scope();
    const memory = new A_Memory();
    this._executionScope.register(memory);
    if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
    if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);
    if (serialized.result) {
      Object.entries(serialized.result).forEach(([key, value]) => {
        memory.set(key, value);
      });
    }
    if (serialized.errors) {
      serialized.errors.forEach((err) => {
        memory.error(new A_Error(err));
      });
    }
    this._params = serialized.params;
    this._status = serialized.status || "CREATED" /* CREATED */;
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
      startedAt: this._startTime ? this._startTime.toISOString() : void 0,
      endedAt: this._endTime ? this._endTime.toISOString() : void 0,
      duration: this.duration,
      result: this.result,
      errors: this.errors ? Array.from(this.errors).map((err) => err.toJSON()) : void 0
    };
  }
  checkScopeInheritance() {
    let attachedScope;
    try {
      attachedScope = A_Context.scope(this);
    } catch (error) {
      throw new A_CommandError({
        title: A_CommandError.CommandScopeBindingError,
        description: `Command ${this.code} is not bound to any context scope. Ensure the command is properly registered within a context before execution.`,
        originalError: error
      });
    }
    if (!this.scope.isInheritedFrom(A_Context.scope(this))) {
      this.scope.inherit(A_Context.scope(this));
    }
  }
};
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
      if (A_Context.environment === "server") {
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
      if (A_Context.environment === "server") {
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
      if (A_Context.environment === "server") {
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
      if (A_Context.environment === "server") {
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
      if (A_Context.environment === "server") {
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
      if (A_Context.environment === "server") {
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
      if (A_Context.environment === "server") {
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
      if (A_Context.environment === "server") {
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
var A_Polyfill = class extends A_Component {
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
    if (A_Context.environment !== "browser") return;
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
  A_Concept.Load()
], A_Polyfill.prototype, "load", 1);
__decorateClass([
  A_Concept.Load()
], A_Polyfill.prototype, "attachToWindow", 1);
A_Polyfill = __decorateClass([
  __decorateParam(0, A_Inject(A_Logger))
], A_Polyfill);
var A_ConfigError = class extends A_Error {
};
A_ConfigError.InitializationError = "A-Config Initialization Error";
var ConfigReader = class extends A_Component {
  constructor(polyfill) {
    super();
    this.polyfill = polyfill;
  }
  async attachContext(container, feature) {
    if (!container.scope.has(A_Config)) {
      const newConfig = new A_Config({
        variables: [
          ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
          ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
        ],
        defaults: {}
      });
      container.scope.register(newConfig);
    }
    const config = container.scope.resolve(A_Config);
    const rootDir = await this.getProjectRoot();
    config.set("A_CONCEPT_ROOT_FOLDER", rootDir);
  }
  async initialize(config) {
    const data = await this.read([
      ...config.CONFIG_PROPERTIES,
      ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
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
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_Container)),
  __decorateParam(1, A_Inject(A_Feature))
], ConfigReader.prototype, "attachContext", 1);
__decorateClass([
  A_Concept.Load(),
  __decorateParam(0, A_Inject(A_Config))
], ConfigReader.prototype, "initialize", 1);
ConfigReader = __decorateClass([
  __decorateParam(0, A_Inject(A_Polyfill))
], ConfigReader);

// src/lib/A-Config/components/FileConfigReader.component.ts
var FileConfigReader = class extends ConfigReader {
  constructor() {
    super(...arguments);
    this.FileData = /* @__PURE__ */ new Map();
  }
  /**
   * Get the configuration property Name
   * @param property 
   */
  getConfigurationProperty_File_Alias(property) {
    return A_FormatterHelper.toCamelCase(property);
  }
  resolve(property) {
    return this.FileData.get(this.getConfigurationProperty_File_Alias(property));
  }
  async read(variables) {
    const fs = await this.polyfill.fs();
    try {
      const data = fs.readFileSync(`${A_Context.concept}.conf.json`, "utf8");
      const config = JSON.parse(data);
      this.FileData = new Map(Object.entries(config));
      return config;
    } catch (error) {
      return {};
    }
  }
};
var ENVConfigReader = class extends ConfigReader {
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
    return A_FormatterHelper.toUpperSnakeCase(property);
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
  A_Concept.Load({
    before: ["ENVConfigReader.initialize"]
  }),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_Polyfill)),
  __decorateParam(2, A_Inject(A_Feature))
], ENVConfigReader.prototype, "readEnvFile", 1);

// src/lib/A-Config/A-Config.container.ts
var A_ConfigLoader = class extends A_Container {
  async prepare(polyfill) {
    if (!this.scope.has(A_Config)) {
      const newConfig = new A_Config({
        variables: [
          ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
          ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
        ],
        defaults: {}
      });
      this.scope.register(newConfig);
    }
    const fs = await polyfill.fs();
    try {
      switch (true) {
        case (A_Context.environment === "server" && !!fs.existsSync(`${A_Context.concept}.conf.json`)):
          this.reader = this.scope.resolve(FileConfigReader);
          break;
        case (A_Context.environment === "server" && !fs.existsSync(`${A_Context.concept}.conf.json`)):
          this.reader = this.scope.resolve(ENVConfigReader);
          break;
        case A_Context.environment === "browser":
          this.reader = this.scope.resolve(ENVConfigReader);
          break;
        default:
          throw new A_ConfigError(
            A_ConfigError.InitializationError,
            `Environment ${A_Context.environment} is not supported`
          );
      }
    } catch (error) {
      if (error instanceof A_ScopeError) {
        throw new A_ConfigError({
          title: A_ConfigError.InitializationError,
          description: `Failed to initialize A_ConfigLoader. Reader not found for environment ${A_Context.environment}`,
          originalError: error
        });
      }
    }
  }
};
__decorateClass([
  A_Concept.Load({
    before: /.*/
  }),
  __decorateParam(0, A_Inject(A_Polyfill))
], A_ConfigLoader.prototype, "prepare", 1);

// src/lib/A-Config/A-Config.types.ts
var A_TYPES__ConfigFeature = /* @__PURE__ */ ((A_TYPES__ConfigFeature2) => {
  return A_TYPES__ConfigFeature2;
})(A_TYPES__ConfigFeature || {});
var A_ManifestError = class extends A_Error {
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
var A_Manifest = class extends A_Fragment {
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
    if (!A_TypeGuards.isArray(config))
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
    if (!A_TypeGuards.isComponentConstructor(item.component))
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
        this.deferred.reject(new A_Error("Timeout Cleared"));
    }
  }
};

// src/lib/A-Schedule/A-Schedule.component.ts
var A_Schedule = class extends A_Component {
  async schedule(date, callback, config) {
    const timestamp = A_TypeGuards.isString(date) ? new Date(date).getTime() : date;
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

export { A_CONSTANTS_A_Command_Features, A_CONSTANTS__A_Command_Status, A_CONSTANTS__CONFIG_ENV_VARIABLES, A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY, A_Channel, A_ChannelError, A_ChannelFeatures, A_ChannelRequest, A_ChannelRequestStatuses, A_Command, A_CommandError, A_Config, A_ConfigError, A_ConfigLoader, A_Deferred, A_Logger, A_Manifest, A_ManifestChecker, A_ManifestError, A_Memory, A_Polyfill, A_Schedule, A_ScheduleObject, A_TYPES__CommandMetaKey, A_TYPES__ConfigFeature, ConfigReader, ENVConfigReader, FileConfigReader };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map