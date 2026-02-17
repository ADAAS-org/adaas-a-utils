import { __decorateClass, __decorateParam } from './chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Inject, A_Component, A_Context } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

// src/lib/A-Polyfill/base/A-FS-Polyfill.base.ts
var A_FSPolyfillBase = class {
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
      await this.initImplementation();
      this._initialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize fs polyfill", error);
      throw error;
    }
  }
};

// src/lib/A-Polyfill/browser/A-FS-Polyfill.ts
var A_FSPolyfill = class extends A_FSPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
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

// src/lib/A-Polyfill/base/A-Crypto-Polyfill.base.ts
var A_CryptoPolyfillBase = class {
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
      await this.initImplementation();
      this._initialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize crypto polyfill", error);
      throw error;
    }
  }
};

// src/lib/A-Polyfill/browser/A-Crypto-Polyfill.ts
var A_CryptoPolyfill = class extends A_CryptoPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
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

// src/lib/A-Polyfill/base/A-Http-Polyfill.base.ts
var A_HttpPolyfillBase = class {
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
      await this.initImplementation();
      this._initialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize http polyfill", error);
      throw error;
    }
  }
};

// src/lib/A-Polyfill/browser/A-Http-Polyfill.ts
var A_HttpPolyfill = class extends A_HttpPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
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

// src/lib/A-Polyfill/base/A-Https-Polyfill.base.ts
var A_HttpsPolyfillBase = class {
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
      await this.initImplementation();
      this._initialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize https polyfill", error);
      throw error;
    }
  }
};

// src/lib/A-Polyfill/browser/A-Https-Polyfill.ts
var A_HttpsPolyfill = class extends A_HttpsPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
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

// src/lib/A-Polyfill/base/A-Path-Polyfill.base.ts
var A_PathPolyfillBase = class {
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
      await this.initImplementation();
      this._initialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize path polyfill", error);
      throw error;
    }
  }
};

// src/lib/A-Polyfill/browser/A-Path-Polyfill.ts
var A_PathPolyfill = class extends A_PathPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
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

// src/lib/A-Polyfill/base/A-Url-Polyfill.base.ts
var A_UrlPolyfillBase = class {
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
      await this.initImplementation();
      this._initialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize url polyfill", error);
      throw error;
    }
  }
};

// src/lib/A-Polyfill/browser/A-Url-Polyfill.ts
var A_UrlPolyfill = class extends A_UrlPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
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

// src/lib/A-Polyfill/base/A-Buffer-Polyfill.base.ts
var A_BufferPolyfillBase = class {
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
      await this.initImplementation();
      this._initialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize buffer polyfill", error);
      throw error;
    }
  }
};

// src/lib/A-Polyfill/browser/A-Buffer-Polyfill.ts
var A_BufferPolyfill = class extends A_BufferPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
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

// src/lib/A-Polyfill/base/A-Process-Polyfill.base.ts
var A_ProcessPolyfillBase = class {
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
      await this.initImplementation();
      this._initialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize process polyfill", error);
      throw error;
    }
  }
};

// src/lib/A-Polyfill/browser/A-Process-Polyfill.ts
var A_ProcessPolyfill = class extends A_ProcessPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
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
    this._fsPolyfill = new A_FSPolyfill(this.logger);
    this._cryptoPolyfill = new A_CryptoPolyfill(this.logger);
    this._httpPolyfill = new A_HttpPolyfill(this.logger);
    this._httpsPolyfill = new A_HttpsPolyfill(this.logger);
    this._pathPolyfill = new A_PathPolyfill(this.logger);
    this._urlPolyfill = new A_UrlPolyfill(this.logger);
    this._bufferPolyfill = new A_BufferPolyfill(this.logger);
    this._processPolyfill = new A_ProcessPolyfill(this.logger);
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
  A_Frame.Component({
    namespace: "A-Utils",
    name: "A-Polyfill",
    description: "Polyfill component that provides cross-environment compatibility for Node.js core modules such as fs, crypto, http, https, path, url, buffer, and process. It dynamically loads appropriate polyfills based on the execution environment (Node.js or browser), enabling seamless usage of these modules in different contexts."
  }),
  __decorateParam(0, A_Inject("A_Logger"))
], A_Polyfill);

export { A_BufferPolyfill, A_BufferPolyfillBase, A_CryptoPolyfill, A_CryptoPolyfillBase, A_FSPolyfill, A_FSPolyfillBase, A_HttpPolyfillBase, A_HttpsPolyfill, A_HttpsPolyfillBase, A_PathPolyfill, A_PathPolyfillBase, A_Polyfill, A_ProcessPolyfill, A_ProcessPolyfillBase, A_UrlPolyfill, A_UrlPolyfillBase };
//# sourceMappingURL=chunk-J6CLHXFQ.mjs.map
//# sourceMappingURL=chunk-J6CLHXFQ.mjs.map