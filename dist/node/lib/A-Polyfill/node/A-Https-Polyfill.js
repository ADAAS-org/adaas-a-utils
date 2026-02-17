'use strict';

var AHttpsPolyfill_base = require('../base/A-Https-Polyfill.base');
var httpsModule = require('https');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var httpsModule__default = /*#__PURE__*/_interopDefault(httpsModule);

class A_HttpsPolyfill extends AHttpsPolyfill_base.A_HttpsPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._https = {
      request: httpsModule__default.default.request,
      get: httpsModule__default.default.get,
      createServer: httpsModule__default.default.createServer
    };
  }
}

exports.A_HttpsPolyfill = A_HttpsPolyfill;
//# sourceMappingURL=A-Https-Polyfill.js.map
//# sourceMappingURL=A-Https-Polyfill.js.map