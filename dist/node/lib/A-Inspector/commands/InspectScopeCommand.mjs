import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Command } from '@adaas/a-utils/a-command';
import { A_Frame } from '@adaas/a-frame/core';

let InspectScopeCommand = class extends A_Command {
  static get entity() {
    return "inspect-scope";
  }
};
InspectScopeCommand = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Returns a snapshot of a single scope (components, fragments, entities, errors, imports) by name."
  })
], InspectScopeCommand);

export { InspectScopeCommand };
//# sourceMappingURL=InspectScopeCommand.mjs.map
//# sourceMappingURL=InspectScopeCommand.mjs.map