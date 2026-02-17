'use strict';

var APathPolyfill_base = require('../base/A-Path-Polyfill.base');
var pathModule = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var pathModule__default = /*#__PURE__*/_interopDefault(pathModule);

class A_PathPolyfill extends APathPolyfill_base.A_PathPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._path = {
      basename: pathModule__default.default.basename,
      dirname: pathModule__default.default.dirname,
      extname: pathModule__default.default.extname,
      join: pathModule__default.default.join,
      resolve: pathModule__default.default.resolve,
      relative: pathModule__default.default.relative,
      normalize: pathModule__default.default.normalize,
      isAbsolute: pathModule__default.default.isAbsolute,
      parse: pathModule__default.default.parse,
      format: pathModule__default.default.format,
      sep: pathModule__default.default.sep,
      delimiter: pathModule__default.default.delimiter
    };
  }
}

exports.A_PathPolyfill = A_PathPolyfill;
//# sourceMappingURL=A-Path-Polyfill.js.map
//# sourceMappingURL=A-Path-Polyfill.js.map