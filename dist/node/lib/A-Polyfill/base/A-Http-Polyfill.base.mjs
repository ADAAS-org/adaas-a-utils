import '../../../chunk-EQQGB2QZ.mjs';

class A_HttpPolyfillBase {
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
}

export { A_HttpPolyfillBase };
//# sourceMappingURL=A-Http-Polyfill.base.mjs.map
//# sourceMappingURL=A-Http-Polyfill.base.mjs.map