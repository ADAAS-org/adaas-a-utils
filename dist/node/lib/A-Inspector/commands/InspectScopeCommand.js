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
exports.InspectScopeCommand = class InspectScopeCommand extends aCommand.A_Command {
  static get entity() {
    return "inspect-scope";
  }
};
exports.InspectScopeCommand = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Returns a snapshot of a single scope (components, fragments, entities, errors, imports) by name."
  })
], exports.InspectScopeCommand);
//# sourceMappingURL=InspectScopeCommand.js.map
//# sourceMappingURL=InspectScopeCommand.js.map