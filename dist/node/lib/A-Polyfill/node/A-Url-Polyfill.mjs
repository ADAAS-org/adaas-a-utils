import '../../../chunk-EQQGB2QZ.mjs';
import { A_UrlPolyfillBase } from '../base/A-Url-Polyfill.base';
import urlModule from 'url';

class A_UrlPolyfill extends A_UrlPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._url = {
      parse: urlModule.parse,
      format: urlModule.format,
      resolve: urlModule.resolve,
      URL: urlModule.URL || globalThis.URL,
      URLSearchParams: urlModule.URLSearchParams || globalThis.URLSearchParams
    };
  }
}

export { A_UrlPolyfill };
//# sourceMappingURL=A-Url-Polyfill.mjs.map
//# sourceMappingURL=A-Url-Polyfill.mjs.map