import '../../../chunk-EQQGB2QZ.mjs';
import { A_CryptoPolyfillBase } from '../base/A-Crypto-Polyfill.base';

class A_CryptoPolyfill extends A_CryptoPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._crypto = {
      createFileHash: () => {
        this.logger.warning("File hash not available in browser environment");
        return Promise.resolve("");
      },
      createTextHash: (text, algorithm = "SHA-384") => new Promise(async (resolve, reject) => {
        try {
          if (!crypto.subtle) {
            throw new Error("SubtleCrypto not available");
          }
          const encoder = new TextEncoder();
          const data = encoder.encode(text);
          const hashBuffer = await crypto.subtle.digest(algorithm, data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashBase64 = btoa(String.fromCharCode(...hashArray));
          resolve(`${algorithm}-${hashBase64}`);
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