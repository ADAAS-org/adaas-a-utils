'use strict';

var AProcessPolyfill_base = require('../base/A-Process-Polyfill.base');

class A_ProcessPolyfill extends AProcessPolyfill_base.A_ProcessPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._process = {
      env: process.env,
      argv: process.argv,
      platform: process.platform,
      version: process.version,
      versions: process.versions,
      cwd: process.cwd,
      exit: process.exit,
      nextTick: process.nextTick
    };
  }
}

exports.A_ProcessPolyfill = A_ProcessPolyfill;
//# sourceMappingURL=A-Process-Polyfill.js.map
//# sourceMappingURL=A-Process-Polyfill.js.map