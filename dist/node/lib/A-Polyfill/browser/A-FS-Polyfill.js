'use strict';

var AFSPolyfill_base = require('../base/A-FS-Polyfill.base');

class A_FSPolyfill extends AFSPolyfill_base.A_FSPolyfillBase {
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

exports.A_FSPolyfill = A_FSPolyfill;
//# sourceMappingURL=A-FS-Polyfill.js.map
//# sourceMappingURL=A-FS-Polyfill.js.map