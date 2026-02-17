import '../../../chunk-EQQGB2QZ.mjs';
import { A_PathPolyfillBase } from '../base/A-Path-Polyfill.base';
import pathModule from 'path';

class A_PathPolyfill extends A_PathPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._path = {
      basename: pathModule.basename,
      dirname: pathModule.dirname,
      extname: pathModule.extname,
      join: pathModule.join,
      resolve: pathModule.resolve,
      relative: pathModule.relative,
      normalize: pathModule.normalize,
      isAbsolute: pathModule.isAbsolute,
      parse: pathModule.parse,
      format: pathModule.format,
      sep: pathModule.sep,
      delimiter: pathModule.delimiter
    };
  }
}

export { A_PathPolyfill };
//# sourceMappingURL=A-Path-Polyfill.mjs.map
//# sourceMappingURL=A-Path-Polyfill.mjs.map