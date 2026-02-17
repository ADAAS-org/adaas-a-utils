import { __decorateClass, __decorateParam } from '../../chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Inject, A_Component, A_Context } from '@adaas/a-concept';
import { A_FSPolyfill } from './browser/A-FS-Polyfill';
import { A_CryptoPolyfill } from './browser/A-Crypto-Polyfill';
import { A_HttpPolyfill } from './browser/A-Http-Polyfill';
import { A_HttpsPolyfill } from './browser/A-Https-Polyfill';
import { A_PathPolyfill } from './browser/A-Path-Polyfill';
import { A_UrlPolyfill } from './browser/A-Url-Polyfill';
import { A_BufferPolyfill } from './browser/A-Buffer-Polyfill';
import { A_ProcessPolyfill } from './browser/A-Process-Polyfill';
import { A_Frame } from '@adaas/a-frame';

let A_Polyfill = class extends A_Component {
  constructor(logger) {
    super();
    this.logger = logger;
    this._initializing = null;
  }
  /**
   * Indicates whether the channel is connected
   */
  get ready() {
    if (!this._initialized) {
      this._initialized = this._loadInternal();
    }
    return this._initialized;
  }
  async load() {
    await this.ready;
  }
  async attachToWindow() {
    if (A_Context.environment !== "browser") return;
    globalThis.A_Polyfill = this;
    globalThis.process = { env: { NODE_ENV: "production" }, cwd: () => "/" };
    globalThis.__dirname = "/";
  }
  async _loadInternal() {
    this._fsPolyfill = new A_FSPolyfill(this.logger);
    this._cryptoPolyfill = new A_CryptoPolyfill(this.logger);
    this._httpPolyfill = new A_HttpPolyfill(this.logger);
    this._httpsPolyfill = new A_HttpsPolyfill(this.logger);
    this._pathPolyfill = new A_PathPolyfill(this.logger);
    this._urlPolyfill = new A_UrlPolyfill(this.logger);
    this._bufferPolyfill = new A_BufferPolyfill(this.logger);
    this._processPolyfill = new A_ProcessPolyfill(this.logger);
    await this._fsPolyfill.get();
    await this._cryptoPolyfill.get(await this._fsPolyfill.get());
    await this._httpPolyfill.get();
    await this._httpsPolyfill.get();
    await this._pathPolyfill.get();
    await this._urlPolyfill.get();
    await this._bufferPolyfill.get();
    await this._processPolyfill.get();
  }
  /**
   * Allows to use the 'fs' polyfill methods regardless of the environment
   * This method loads the 'fs' polyfill and returns its instance
   * 
   * @returns 
   */
  async fs() {
    await this.ready;
    return await this._fsPolyfill.get();
  }
  /**
   * Allows to use the 'crypto' polyfill methods regardless of the environment
   * This method loads the 'crypto' polyfill and returns its instance
   * 
   * @returns 
   */
  async crypto() {
    await this.ready;
    return await this._cryptoPolyfill.get();
  }
  /**
   * Allows to use the 'http' polyfill methods regardless of the environment
   * This method loads the 'http' polyfill and returns its instance
   * 
   * @returns 
   */
  async http() {
    await this.ready;
    return await this._httpPolyfill.get();
  }
  /**
   * Allows to use the 'https' polyfill methods regardless of the environment
   * This method loads the 'https' polyfill and returns its instance
   * 
   * @returns 
   */
  async https() {
    await this.ready;
    return await this._httpsPolyfill.get();
  }
  /**
   * Allows to use the 'path' polyfill methods regardless of the environment
   * This method loads the 'path' polyfill and returns its instance
   * 
   * @returns 
   */
  async path() {
    await this.ready;
    return await this._pathPolyfill.get();
  }
  /**
   * Allows to use the 'url' polyfill methods regardless of the environment
   * This method loads the 'url' polyfill and returns its instance
   * 
   * @returns 
   */
  async url() {
    await this.ready;
    return await this._urlPolyfill.get();
  }
  /**
   * Allows to use the 'buffer' polyfill methods regardless of the environment
   * This method loads the 'buffer' polyfill and returns its instance
   * 
   * @returns 
   */
  async buffer() {
    await this.ready;
    return await this._bufferPolyfill.get();
  }
  /**
   * Allows to use the 'process' polyfill methods regardless of the environment
   * This method loads the 'process' polyfill and returns its instance
   * 
   * @returns 
   */
  async process() {
    await this.ready;
    return await this._processPolyfill.get();
  }
};
__decorateClass([
  A_Concept.Load()
], A_Polyfill.prototype, "load", 1);
__decorateClass([
  A_Concept.Load()
], A_Polyfill.prototype, "attachToWindow", 1);
A_Polyfill = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "A-Polyfill",
    description: "Polyfill component that provides cross-environment compatibility for Node.js core modules such as fs, crypto, http, https, path, url, buffer, and process. It dynamically loads appropriate polyfills based on the execution environment (Node.js or browser), enabling seamless usage of these modules in different contexts."
  }),
  __decorateParam(0, A_Inject("A_Logger"))
], A_Polyfill);

export { A_Polyfill };
//# sourceMappingURL=A-Polyfill.component.env-browser.mjs.map
//# sourceMappingURL=A-Polyfill.component.env-browser.mjs.map