import '../../../chunk-EQQGB2QZ.mjs';
import { A_ProcessPolyfillBase } from '../base/A-Process-Polyfill.base';

class A_ProcessPolyfill extends A_ProcessPolyfillBase {
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

export { A_ProcessPolyfill };
//# sourceMappingURL=A-Process-Polyfill.mjs.map
//# sourceMappingURL=A-Process-Polyfill.mjs.map