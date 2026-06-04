'use strict';

var aCommand = require('@adaas/a-utils/a-command');
var core = require('@adaas/a-frame/core');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.InspectorPingCommand = class InspectorPingCommand extends aCommand.A_Command {
  static get entity() {
    return "inspector-ping";
  }
};
exports.InspectorPingCommand = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Health-check / authentication-check command. Echoes back the token and the server timestamp."
  })
], exports.InspectorPingCommand);
//# sourceMappingURL=InspectorPingCommand.js.map
//# sourceMappingURL=InspectorPingCommand.js.map