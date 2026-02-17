import { __decorateClass } from './chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame';

var A_Route = class extends A_Fragment {
  constructor(url) {
    super();
    this.url = url instanceof RegExp ? url.source : url;
  }
  /**
   * Returns path only without query and hash
   */
  get path() {
    const p = this.url.split("?")[0].split("#")[0];
    if (p.includes("://")) {
      const pathStartIndex = p.indexOf("/", p.indexOf("://") + 3);
      if (pathStartIndex === -1) {
        return "/";
      } else {
        const path = p.slice(pathStartIndex);
        return path.endsWith("/") ? path.slice(0, -1) : path;
      }
    }
    return p.endsWith("/") ? p.slice(0, -1) : p;
  }
  /**
   * Returns array of parameter names in the route path
   */
  get params() {
    return this.path.match(/:([^\/]+)/g)?.map((param) => param.slice(1)) || [];
  }
  /**
   * Returns protocol based on URL scheme
   */
  get protocol() {
    switch (true) {
      case this.url.startsWith("http://"):
        return "http";
      case this.url.startsWith("https://"):
        return "https";
      case this.url.startsWith("ws://"):
        return "ws";
      case this.url.startsWith("wss://"):
        return "wss";
      default:
        return this.url.includes("://") ? this.url.split("://")[0] : "http";
    }
  }
  extractParams(url) {
    const cleanUrl = url.split("?")[0];
    const urlSegments = cleanUrl.split("/").filter(Boolean);
    const maskSegments = this.path.split("/").filter(Boolean);
    const params = {};
    for (let i = 0; i < maskSegments.length; i++) {
      const maskSegment = maskSegments[i];
      const urlSegment = urlSegments[i];
      if (maskSegment.startsWith(":")) {
        const paramName = maskSegment.slice(1);
        params[paramName] = urlSegment;
      } else if (maskSegment !== urlSegment) {
        return {};
      }
    }
    return params;
  }
  extractQuery(url) {
    const query = {};
    const queryString = url.split("?")[1];
    if (!queryString) return query;
    const cleanQuery = queryString.split("#")[0];
    for (const pair of cleanQuery.split("&")) {
      if (!pair) continue;
      const [key, value = ""] = pair.split("=");
      query[decodeURIComponent(key)] = decodeURIComponent(value);
    }
    return query;
  }
  toString() {
    return `${this.path}`;
  }
  toRegExp() {
    return new RegExp(`^${this.path.replace(/\/:([^\/]+)/g, "/([^/]+)")}$`);
  }
  toAFeatureExtension(extensionScope = []) {
    return new RegExp(`^${extensionScope.length ? `(${extensionScope.join("|")})` : ".*"}\\.${this.path.replace(/\/:([^\/]+)/g, "/([^/]+)")}$`);
  }
};
A_Route = __decorateClass([
  A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-Route",
    description: "Route fragment that defines URL patterns for routing purposes. It supports dynamic parameters and query extraction, allowing for flexible route definitions. This fragment can be used in routing systems to match incoming URLs against defined routes and extract relevant parameters and query strings."
  })
], A_Route);

export { A_Route };
//# sourceMappingURL=a-route.mjs.map
//# sourceMappingURL=a-route.mjs.map