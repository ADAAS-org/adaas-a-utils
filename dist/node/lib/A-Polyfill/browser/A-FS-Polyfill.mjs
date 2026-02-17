import '../../../chunk-EQQGB2QZ.mjs';
import { A_FSPolyfillBase } from '../base/A-FS-Polyfill.base';

class A_FSPolyfill extends A_FSPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._fs = {
      readFileSync: (path, encoding) => {
        this.logger.warning("fs.readFileSync not available in browser environment");
        return "";
      },
      existsSync: (path) => {
        this.logger.warning("fs.existsSync not available in browser environment");
        return false;
      },
      createReadStream: (path) => {
        this.logger.warning("fs.createReadStream not available in browser environment");
        return null;
      }
    };
  }
}

export { A_FSPolyfill };
//# sourceMappingURL=A-FS-Polyfill.mjs.map
//# sourceMappingURL=A-FS-Polyfill.mjs.map