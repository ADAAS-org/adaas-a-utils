'use strict';

class A_BufferPolyfillBase {
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
}

exports.A_BufferPolyfillBase = A_BufferPolyfillBase;
//# sourceMappingURL=A-Buffer-Polyfill.base.js.map
//# sourceMappingURL=A-Buffer-Polyfill.base.js.map