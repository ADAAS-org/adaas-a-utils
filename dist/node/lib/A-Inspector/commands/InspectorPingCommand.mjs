import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Command } from '@adaas/a-utils/a-command';
import { A_Frame } from '@adaas/a-frame/core';

let InspectorPingCommand = class extends A_Command {
  static get entity() {
    return "inspector-ping";
  }
};
InspectorPingCommand = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Health-check / authentication-check command. Echoes back the token and the server timestamp."
  })
], InspectorPingCommand);

export { InspectorPingCommand };
//# sourceMappingURL=InspectorPingCommand.mjs.map
//# sourceMappingURL=InspectorPingCommand.mjs.map