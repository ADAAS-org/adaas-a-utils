'use strict';

var ACryptoPolyfill_base = require('../base/A-Crypto-Polyfill.base');
var crypto = require('crypto');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var crypto__default = /*#__PURE__*/_interopDefault(crypto);

class A_CryptoPolyfill extends ACryptoPolyfill_base.A_CryptoPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._crypto = {
      createTextHash: (text, algorithm = "sha384") => Promise.resolve(
        `${algorithm}-${crypto__default.default.createHash(algorithm).update(text).digest("base64")}`
      ),
      createFileHash: (filePath, algorithm = "sha384") => new Promise(async (resolve, reject) => {
        try {
          if (!this._fsPolyfill) {
            throw new Error("FS polyfill is required for file hashing");
          }
          const hash = crypto__default.default.createHash(algorithm);
          const fileStream = this._fsPolyfill.createReadStream(filePath);
          fileStream.on("data", (data) => hash.update(data));
          fileStream.on("end", () => resolve(`${algorithm}-${hash.digest("base64")}`));
          fileStream.on("error", (err) => reject(err));
        } catch (error) {
          reject(error);
        }
      })
    };
  }
}

exports.A_CryptoPolyfill = A_CryptoPolyfill;
//# sourceMappingURL=A-Crypto-Polyfill.js.map
//# sourceMappingURL=A-Crypto-Polyfill.js.map