import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Container } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';
import { InspectorChannelProcessor } from './transport/InspectorChannelProcessor.component';
import { InspectorClientForwarder } from './commands/InspectorClientForwarder.component';
import { InspectorPingCommand } from './commands/InspectorPingCommand';
import { InspectConceptCommand } from './commands/InspectConceptCommand';
import { InspectScopeCommand } from './commands/InspectScopeCommand';
import { InspectFeatureCommand } from './commands/InspectFeatureCommand';
import { InspectorChannel } from './transport/InspectorChannel';

let A_ConceptInspectorClient = class extends A_Container {
  constructor(config) {
    super({
      name: "inspector-client",
      components: [InspectorChannel, InspectorChannelProcessor, InspectorClientForwarder],
      entities: [
        InspectorPingCommand,
        InspectConceptCommand,
        InspectScopeCommand,
        InspectFeatureCommand
      ],
      fragments: [
        config
      ]
    });
  }
  /**
   * Gracefully disconnects the client's channel, if any. After calling
   * 
   * @returns 
   */
  async disconnect() {
    const channel = this.scope.resolve(InspectorChannel);
    if (!channel) return Promise.resolve();
    return await channel.disconnect();
  }
};
A_ConceptInspectorClient = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side running bundle for the A-Concept inspector: ships the channel transport processor + a polymorphic onExecute forwarder so any A_Command executed under its scope is shipped to a remote inspector server."
  })
], A_ConceptInspectorClient);

export { A_ConceptInspectorClient };
//# sourceMappingURL=A-InspectorClient.container.mjs.map
//# sourceMappingURL=A-InspectorClient.container.mjs.map