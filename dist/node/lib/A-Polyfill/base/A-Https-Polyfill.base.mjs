import '../../../chunk-EQQGB2QZ.mjs';

class A_HttpsPolyfillBase {
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
}

export { A_HttpsPolyfillBase };
//# sourceMappingURL=A-Https-Polyfill.base.mjs.map
//# sourceMappingURL=A-Https-Polyfill.base.mjs.map