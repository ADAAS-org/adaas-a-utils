import '../../../chunk-EQQGB2QZ.mjs';
import { A_HttpsPolyfillBase } from '../base/A-Https-Polyfill.base';
import httpsModule from 'https';

class A_HttpsPolyfill extends A_HttpsPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._https = {
      request: httpsModule.request,
      get: httpsModule.get,
      createServer: httpsModule.createServer
    };
  }
}

export { A_HttpsPolyfill };
//# sourceMappingURL=A-Https-Polyfill.mjs.map
//# sourceMappingURL=A-Https-Polyfill.mjs.map