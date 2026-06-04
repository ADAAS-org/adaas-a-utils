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
exports.InspectFeatureCommand = class InspectFeatureCommand extends aCommand.A_Command {
  static get entity() {
    return "inspect-feature";
  }
};
exports.InspectFeatureCommand = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Returns the resolved feature template (stage steps) for a given component + feature + scope, exactly as A_Feature would execute it."
  })
], exports.InspectFeatureCommand);
//# sourceMappingURL=InspectFeatureCommand.js.map
//# sourceMappingURL=InspectFeatureCommand.js.map