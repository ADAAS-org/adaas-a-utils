'use strict';

var ABufferPolyfill_base = require('../base/A-Buffer-Polyfill.base');
var bufferModule = require('buffer');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var bufferModule__default = /*#__PURE__*/_interopDefault(bufferModule);

class A_BufferPolyfill extends ABufferPolyfill_base.A_BufferPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._buffer = {
      from: bufferModule__default.default.Buffer.from,
      alloc: bufferModule__default.default.Buffer.alloc,
      allocUnsafe: bufferModule__default.default.Buffer.allocUnsafe,
      isBuffer: bufferModule__default.default.Buffer.isBuffer,
      concat: bufferModule__default.default.Buffer.concat
    };
  }
}

exports.A_BufferPolyfill = A_BufferPolyfill;
//# sourceMappingURL=A-Buffer-Polyfill.js.map
//# sourceMappingURL=A-Buffer-Polyfill.js.map