'use strict';

var AFSPolyfill_base = require('../base/A-FS-Polyfill.base');
var fs = require('fs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);

class A_FSPolyfill extends AFSPolyfill_base.A_FSPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._fs = fs__default.default;
  }
}

exports.A_FSPolyfill = A_FSPolyfill;
//# sourceMappingURL=A-FS-Polyfill.js.map
//# sourceMappingURL=A-FS-Polyfill.js.map