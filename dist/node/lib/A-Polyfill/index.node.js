'use strict';

var APolyfill_component_envNode = require('./A-Polyfill.component.env-node');
var base = require('./base');
var APolyfill_types = require('./A-Polyfill.types');
var node = require('./node');



Object.defineProperty(exports, "A_Polyfill", {
  enumerable: true,
  get: function () { return APolyfill_component_envNode.A_Polyfill; }
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
Object.keys(node).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return node[k]; }
  });
});
//# sourceMappingURL=index.node.js.map
//# sourceMappingURL=index.node.js.map