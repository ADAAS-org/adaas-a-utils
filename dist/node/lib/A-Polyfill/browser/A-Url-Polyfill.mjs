import '../../../chunk-EQQGB2QZ.mjs';
import { A_UrlPolyfillBase } from '../base/A-Url-Polyfill.base';

class A_UrlPolyfill extends A_UrlPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._url = {
      parse: (urlString) => {
        try {
          const url = new URL(urlString);
          return {
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            host: url.host,
            href: url.href
          };
        } catch {
          return {};
        }
      },
      format: (urlObject) => {
        try {
          return new URL("", urlObject.href || `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}${urlObject.search}${urlObject.hash}`).href;
        } catch {
          return "";
        }
      },
      resolve: (from, to) => {
        try {
          return new URL(to, from).href;
        } catch {
          return to;
        }
      },
      URL: globalThis.URL,
      URLSearchParams: globalThis.URLSearchParams
    };
  }
}

export { A_UrlPolyfill };
//# sourceMappingURL=A-Url-Polyfill.mjs.map
//# sourceMappingURL=A-Url-Polyfill.mjs.map