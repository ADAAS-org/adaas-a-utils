import '../../../chunk-EQQGB2QZ.mjs';

class A_CryptoPolyfillBase {
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
}

export { A_CryptoPolyfillBase };
//# sourceMappingURL=A-Crypto-Polyfill.base.mjs.map
//# sourceMappingURL=A-Crypto-Polyfill.base.mjs.map