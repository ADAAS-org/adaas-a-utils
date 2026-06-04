import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Command } from '@adaas/a-utils/a-command';
import { A_Frame } from '@adaas/a-frame/core';

let InspectFeatureCommand = class extends A_Command {
  static get entity() {
    return "inspect-feature";
  }
};
InspectFeatureCommand = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Returns the resolved feature template (stage steps) for a given component + feature + scope, exactly as A_Feature would execute it."
  })
], InspectFeatureCommand);

export { InspectFeatureCommand };
//# sourceMappingURL=InspectFeatureCommand.mjs.map
//# sourceMappingURL=InspectFeatureCommand.mjs.map