'use strict';

var AService_container = require('./A-Service.container');
var AService_constants = require('./A-Service.constants');



Object.defineProperty(exports, "A_Service", {
  enumerable: true,
  get: function () { return AService_container.A_Service; }
});
Object.keys(AService_constants).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return AService_constants[k]; }
  });
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map