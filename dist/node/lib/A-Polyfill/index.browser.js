'use strict';

var APolyfill_component_envBrowser = require('./A-Polyfill.component.env-browser');
var base = require('./base');
var APolyfill_types = require('./A-Polyfill.types');
var browser = require('./browser');



Object.defineProperty(exports, "A_Polyfill", {
  enumerable: true,
  get: function () { return APolyfill_component_envBrowser.A_Polyfill; }
});
Object.keys(base).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return base[k]; }
  });
});
Object.keys(APolyfill_types).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return APolyfill_types[k]; }
  });
});
Object.keys(browser).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return browser[k]; }
  });
});
//# sourceMappingURL=index.browser.js.map
//# sourceMappingURL=index.browser.js.map