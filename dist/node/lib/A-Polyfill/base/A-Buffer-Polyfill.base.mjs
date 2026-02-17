import '../../../chunk-EQQGB2QZ.mjs';

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

export { A_BufferPolyfillBase };
//# sourceMappingURL=A-Buffer-Polyfill.base.mjs.map
//# sourceMappingURL=A-Buffer-Polyfill.base.mjs.map