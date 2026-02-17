import '../../../chunk-EQQGB2QZ.mjs';
import { A_FSPolyfillBase } from '../base/A-FS-Polyfill.base';
import fs from 'fs';

class A_FSPolyfill extends A_FSPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._fs = fs;
  }
}

export { A_FSPolyfill };
//# sourceMappingURL=A-FS-Polyfill.mjs.map
//# sourceMappingURL=A-FS-Polyfill.mjs.map