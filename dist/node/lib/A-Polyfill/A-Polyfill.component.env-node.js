'use strict';

var aConcept = require('@adaas/a-concept');
var ACryptoPolyfill = require('./node/A-Crypto-Polyfill');
var AHttpPolyfill = require('./node/A-Http-Polyfill');
var AHttpsPolyfill = require('./node/A-Https-Polyfill');
var APathPolyfill = require('./node/A-Path-Polyfill');
var AUrlPolyfill = require('./node/A-Url-Polyfill');
var ABufferPolyfill = require('./node/A-Buffer-Polyfill');
var AProcessPolyfill = require('./node/A-Process-Polyfill');
var AFSPolyfill = require('./node/A-FS-Polyfill');
var aFrame = require('@adaas/a-frame');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
exports.A_Polyfill = class A_Polyfill extends aConcept.A_Component {
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
    if (aConcept.A_Context.environment !== "browser") return;
  }
  async _loadInternal() {
    this._fsPolyfill = new AFSPolyfill.A_FSPolyfill(this.logger);
    this._cryptoPolyfill = new ACryptoPolyfill.A_CryptoPolyfill(this.logger);
    this._httpPolyfill = new AHttpPolyfill.A_HttpPolyfill(this.logger);
    this._httpsPolyfill = new AHttpsPolyfill.A_HttpsPolyfill(this.logger);
    this._pathPolyfill = new APathPolyfill.A_PathPolyfill(this.logger);
    this._urlPolyfill = new AUrlPolyfill.A_UrlPolyfill(this.logger);
    this._bufferPolyfill = new ABufferPolyfill.A_BufferPolyfill(this.logger);
    this._processPolyfill = new AProcessPolyfill.A_ProcessPolyfill(this.logger);
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
  aConcept.A_Concept.Load()
], exports.A_Polyfill.prototype, "load", 1);
__decorateClass([
  aConcept.A_Concept.Load()
], exports.A_Polyfill.prototype, "attachToWindow", 1);
exports.A_Polyfill = __decorateClass([
  aFrame.A_Frame.Component({
    namespace: "A-Utils",
    name: "A-Polyfill",
    description: "Polyfill component that provides cross-environment compatibility for Node.js core modules such as fs, crypto, http, https, path, url, buffer, and process. It dynamically loads appropriate polyfills based on the execution environment (Node.js or browser), enabling seamless usage of these modules in different contexts."
  }),
  __decorateParam(0, aConcept.A_Inject("A_Logger"))
], exports.A_Polyfill);
//# sourceMappingURL=A-Polyfill.component.env-node.js.map
//# sourceMappingURL=A-Polyfill.component.env-node.js.map