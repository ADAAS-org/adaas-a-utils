import '../../../chunk-EQQGB2QZ.mjs';
import { A_BufferPolyfillBase } from '../base/A-Buffer-Polyfill.base';
import bufferModule from 'buffer';

class A_BufferPolyfill extends A_BufferPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._buffer = {
      from: bufferModule.Buffer.from,
      alloc: bufferModule.Buffer.alloc,
      allocUnsafe: bufferModule.Buffer.allocUnsafe,
      isBuffer: bufferModule.Buffer.isBuffer,
      concat: bufferModule.Buffer.concat
    };
  }
}

export { A_BufferPolyfill };
//# sourceMappingURL=A-Buffer-Polyfill.mjs.map
//# sourceMappingURL=A-Buffer-Polyfill.mjs.map