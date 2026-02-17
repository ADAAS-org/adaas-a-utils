import '../../../chunk-EQQGB2QZ.mjs';
import { A_ProcessPolyfillBase } from '../base/A-Process-Polyfill.base';

class A_ProcessPolyfill extends A_ProcessPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._process = {
      env: {
        NODE_ENV: "browser",
        ...globalThis.process?.env || {}
      },
      argv: ["browser"],
      platform: "browser",
      version: "browser",
      versions: { node: "browser" },
      cwd: () => "/",
      exit: (code) => {
        this.logger.warning("process.exit not available in browser");
        throw new Error(`Process exit with code ${code}`);
      },
      nextTick: (callback, ...args) => {
        setTimeout(() => callback(...args), 0);
      }
    };
  }
}

export { A_ProcessPolyfill };
//# sourceMappingURL=A-Process-Polyfill.mjs.map
//# sourceMappingURL=A-Process-Polyfill.mjs.map