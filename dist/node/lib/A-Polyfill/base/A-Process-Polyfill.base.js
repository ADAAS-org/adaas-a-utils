'use strict';

class A_ProcessPolyfillBase {
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
}

exports.A_ProcessPolyfillBase = A_ProcessPolyfillBase;
//# sourceMappingURL=A-Process-Polyfill.base.js.map
//# sourceMappingURL=A-Process-Polyfill.base.js.map