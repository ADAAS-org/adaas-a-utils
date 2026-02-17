'use strict';

var AHttpPolyfill_base = require('../base/A-Http-Polyfill.base');
var httpModule = require('http');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var httpModule__default = /*#__PURE__*/_interopDefault(httpModule);

class A_HttpPolyfill extends AHttpPolyfill_base.A_HttpPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._http = {
      request: httpModule__default.default.request,
      get: httpModule__default.default.get,
      createServer: httpModule__default.default.createServer
    };
  }
}

exports.A_HttpPolyfill = A_HttpPolyfill;
//# sourceMappingURL=A-Http-Polyfill.js.map
//# sourceMappingURL=A-Http-Polyfill.js.map