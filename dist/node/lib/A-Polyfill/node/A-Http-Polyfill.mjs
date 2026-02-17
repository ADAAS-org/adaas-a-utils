import '../../../chunk-EQQGB2QZ.mjs';
import { A_HttpPolyfillBase } from '../base/A-Http-Polyfill.base';
import httpModule from 'http';

class A_HttpPolyfill extends A_HttpPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._http = {
      request: httpModule.request,
      get: httpModule.get,
      createServer: httpModule.createServer
    };
  }
}

export { A_HttpPolyfill };
//# sourceMappingURL=A-Http-Polyfill.mjs.map
//# sourceMappingURL=A-Http-Polyfill.mjs.map