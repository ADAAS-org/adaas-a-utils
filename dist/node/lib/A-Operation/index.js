'use strict';

var AOperation_context = require('./A-Operation.context');
var AOperation_types = require('./A-Operation.types');



Object.defineProperty(exports, "A_OperationContext", {
  enumerable: true,
  get: function () { return AOperation_context.A_OperationContext; }
});
Object.keys(AOperation_types).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return AOperation_types[k]; }
  });
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map