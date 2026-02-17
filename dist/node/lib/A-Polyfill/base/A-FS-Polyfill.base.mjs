import '../../../chunk-EQQGB2QZ.mjs';

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

export { A_FSPolyfillBase };
//# sourceMappingURL=A-FS-Polyfill.base.mjs.map
//# sourceMappingURL=A-FS-Polyfill.base.mjs.map