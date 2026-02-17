'use strict';

var ACommand_entity = require('./A-Command.entity');
var ACommand_error = require('./A-Command.error');
var ACommand_types = require('./A-Command.types');
var ACommand_constants = require('./A-Command.constants');



Object.defineProperty(exports, "A_Command", {
  enumerable: true,
  get: function () { return ACommand_entity.A_Command; }
});
Object.defineProperty(exports, "A_CommandError", {
  enumerable: true,
  get: function () { return ACommand_error.A_CommandError; }
});
Object.keys(ACommand_types).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return ACommand_types[k]; }
  });
});
Object.keys(ACommand_constants).forEach(function (k) {
  if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return ACommand_constants[k]; }
  });
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map