'use strict';

var APathPolyfill_base = require('../base/A-Path-Polyfill.base');

class A_PathPolyfill extends APathPolyfill_base.A_PathPolyfillBase {
  constructor(logger) {
    super(logger);
  }
  async initImplementation() {
    this._path = {
      join: (...paths) => {
        return paths.join("/").replace(/\/+/g, "/");
      },
      resolve: (...paths) => {
        let resolvedPath = "";
        for (const path of paths) {
          if (path.startsWith("/")) {
            resolvedPath = path;
          } else {
            resolvedPath = this._path.join(resolvedPath, path);
          }
        }
        return resolvedPath || "/";
      },
      dirname: (path) => {
        const parts = path.split("/");
        return parts.slice(0, -1).join("/") || "/";
      },
      basename: (path, ext) => {
        const base = path.split("/").pop() || "";
        return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base;
      },
      extname: (path) => {
        const parts = path.split(".");
        return parts.length > 1 ? "." + parts.pop() : "";
      },
      relative: (from, to) => {
        return to.replace(from, "").replace(/^\//, "");
      },
      normalize: (path) => {
        return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
      },
      isAbsolute: (path) => {
        return path.startsWith("/") || /^[a-zA-Z]:/.test(path);
      },
      parse: (path) => {
        const ext = this._path.extname(path);
        const base = this._path.basename(path);
        const name = this._path.basename(path, ext);
        const dir = this._path.dirname(path);
        return { root: "/", dir, base, ext, name };
      },
      format: (pathObject) => {
        return this._path.join(pathObject.dir || "", pathObject.base || "");
      },
      sep: "/",
      delimiter: ":"
    };
  }
}

exports.A_PathPolyfill = A_PathPolyfill;
//# sourceMappingURL=A-Path-Polyfill.js.map
//# sourceMappingURL=A-Path-Polyfill.js.map