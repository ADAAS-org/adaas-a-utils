import '../../../chunk-EQQGB2QZ.mjs';

class A_UrlPolyfillBase {
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
}

export { A_UrlPolyfillBase };
//# sourceMappingURL=A-Url-Polyfill.base.mjs.map
//# sourceMappingURL=A-Url-Polyfill.base.mjs.map