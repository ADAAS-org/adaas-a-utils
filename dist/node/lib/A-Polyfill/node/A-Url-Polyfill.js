'use strict';

var AUrlPolyfill_base = require('../base/A-Url-Polyfill.base');
var urlModule = require('url');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var urlModule__default = /*#__PURE__*/_interopDefault(urlModule);

class A_UrlPolyfill extends AUrlPolyfill_base.A_UrlPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._url = {
      parse: urlModule__default.default.parse,
      format: urlModule__default.default.format,
      resolve: urlModule__default.default.resolve,
      URL: urlModule__default.default.URL || globalThis.URL,
      URLSearchParams: urlModule__default.default.URLSearchParams || globalThis.URLSearchParams
    };
  }
}

exports.A_UrlPolyfill = A_UrlPolyfill;
//# sourceMappingURL=A-Url-Polyfill.js.map
//# sourceMappingURL=A-Url-Polyfill.js.map