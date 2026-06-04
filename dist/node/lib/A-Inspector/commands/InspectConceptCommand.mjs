import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Command } from '@adaas/a-utils/a-command';
import { A_Frame } from '@adaas/a-frame/core';

let InspectConceptCommand = class extends A_Command {
  static get entity() {
    return "inspect-concept";
  }
};
InspectConceptCommand = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Returns a snapshot of the running concept: name, environment, root scope, and all allocated containers."
  })
], InspectConceptCommand);

export { InspectConceptCommand };
//# sourceMappingURL=InspectConceptCommand.mjs.map
//# sourceMappingURL=InspectConceptCommand.mjs.map