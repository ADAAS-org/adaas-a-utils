'use strict';

class A_FSPolyfillBase {
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
}

exports.A_FSPolyfillBase = A_FSPolyfillBase;
//# sourceMappingURL=A-FS-Polyfill.base.js.map
//# sourceMappingURL=A-FS-Polyfill.base.js.map