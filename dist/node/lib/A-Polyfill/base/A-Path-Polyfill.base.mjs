import '../../../chunk-EQQGB2QZ.mjs';

class A_PathPolyfillBase {
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
}

export { A_PathPolyfillBase };
//# sourceMappingURL=A-Path-Polyfill.base.mjs.map
//# sourceMappingURL=A-Path-Polyfill.base.mjs.map