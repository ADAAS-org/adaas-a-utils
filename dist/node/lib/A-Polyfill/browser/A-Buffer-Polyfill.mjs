import '../../../chunk-EQQGB2QZ.mjs';
import { A_BufferPolyfillBase } from '../base/A-Buffer-Polyfill.base';

class A_BufferPolyfill extends A_BufferPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._buffer = {
      from: (data, encoding) => {
        if (typeof data === "string") {
          return new TextEncoder().encode(data);
        }
        return new Uint8Array(data);
      },
      alloc: (size, fill) => {
        const buffer = new Uint8Array(size);
        if (fill !== void 0) {
          buffer.fill(fill);
        }
        return buffer;
      },
      allocUnsafe: (size) => {
        return new Uint8Array(size);
      },
      isBuffer: (obj) => {
        return obj instanceof Uint8Array || obj instanceof ArrayBuffer;
      },
      concat: (list, totalLength) => {
        const length = totalLength || list.reduce((sum, buf) => sum + buf.length, 0);
        const result = new Uint8Array(length);
        let offset = 0;
        for (const buf of list) {
          result.set(buf, offset);
          offset += buf.length;
        }
        return result;
      }
    };
  }
}

export { A_BufferPolyfill };
//# sourceMappingURL=A-Buffer-Polyfill.mjs.map
//# sourceMappingURL=A-Buffer-Polyfill.mjs.map