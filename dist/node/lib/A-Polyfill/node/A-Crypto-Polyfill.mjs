import '../../../chunk-EQQGB2QZ.mjs';
import { A_CryptoPolyfillBase } from '../base/A-Crypto-Polyfill.base';
import crypto from 'crypto';

class A_CryptoPolyfill extends A_CryptoPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._crypto = {
      createTextHash: (text, algorithm = "sha384") => Promise.resolve(
        `${algorithm}-${crypto.createHash(algorithm).update(text).digest("base64")}`
      ),
      createFileHash: (filePath, algorithm = "sha384") => new Promise(async (resolve, reject) => {
        try {
          if (!this._fsPolyfill) {
            throw new Error("FS polyfill is required for file hashing");
          }
          const hash = crypto.createHash(algorithm);
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

export { A_CryptoPolyfill };
//# sourceMappingURL=A-Crypto-Polyfill.mjs.map
//# sourceMappingURL=A-Crypto-Polyfill.mjs.map