'use strict';

var AHttpsPolyfill_base = require('../base/A-Https-Polyfill.base');

class A_HttpsPolyfill extends AHttpsPolyfill_base.A_HttpsPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._https = {
      request: (options, callback) => {
        this.logger.warning("https.request not available in browser/test environment, use fetch instead");
        return this.createMockRequest(options, callback, true);
      },
      get: (url, callback) => {
        this.logger.warning("https.get not available in browser/test environment, use fetch instead");
        return this.createMockRequest(typeof url === "string" ? { hostname: url } : url, callback, true);
      },
      createServer: () => {
        this.logger.error("https.createServer not available in browser/test environment");
        return null;
      }
    };
  }
  createMockRequest(options, callback, isHttps = true) {
    const request = {
      end: () => {
        if (callback) {
          const mockResponse = {
            statusCode: 200,
            headers: {},
            on: (event, handler) => {
              if (event === "data") {
                setTimeout(() => handler("mock data"), 0);
              } else if (event === "end") {
                setTimeout(() => handler(), 0);
              }
            },
            pipe: (dest) => {
              if (dest.write) dest.write("mock data");
              if (dest.end) dest.end();
            }
          };
          setTimeout(() => callback(mockResponse), 0);
        }
      },
      write: (data) => {
      },
      on: (event, handler) => {
      }
    };
    return request;
  }
}

exports.A_HttpsPolyfill = A_HttpsPolyfill;
//# sourceMappingURL=A-Https-Polyfill.js.map
//# sourceMappingURL=A-Https-Polyfill.js.map