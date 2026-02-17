import '../../../chunk-EQQGB2QZ.mjs';
import { A_HttpPolyfillBase } from '../base/A-Http-Polyfill.base';

class A_HttpPolyfill extends A_HttpPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._http = {
      request: (options, callback) => {
        this.logger.warning("http.request not available in browser/test environment, use fetch instead");
        return this.createMockRequest(options, callback, false);
      },
      get: (url, callback) => {
        this.logger.warning("http.get not available in browser/test environment, use fetch instead");
        return this.createMockRequest(typeof url === "string" ? { hostname: url } : url, callback, false);
      },
      createServer: () => {
        this.logger.error("http.createServer not available in browser/test environment");
        return null;
      }
    };
  }
  createMockRequest(options, callback, isHttps = false) {
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

export { A_HttpPolyfill };
//# sourceMappingURL=A-Http-Polyfill.mjs.map
//# sourceMappingURL=A-Http-Polyfill.mjs.map