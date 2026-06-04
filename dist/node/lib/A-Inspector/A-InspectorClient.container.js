'use strict';

var aConcept = require('@adaas/a-concept');
var core = require('@adaas/a-frame/core');
var InspectorChannelProcessor_component = require('./transport/InspectorChannelProcessor.component');
var InspectorClientForwarder_component = require('./commands/InspectorClientForwarder.component');
var InspectorPingCommand = require('./commands/InspectorPingCommand');
var InspectConceptCommand = require('./commands/InspectConceptCommand');
var InspectScopeCommand = require('./commands/InspectScopeCommand');
var InspectFeatureCommand = require('./commands/InspectFeatureCommand');
var InspectorChannel = require('./transport/InspectorChannel');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_ConceptInspectorClient = class A_ConceptInspectorClient extends aConcept.A_Container {
  constructor(config) {
    super({
      name: "inspector-client",
      components: [InspectorChannel.InspectorChannel, InspectorChannelProcessor_component.InspectorChannelProcessor, InspectorClientForwarder_component.InspectorClientForwarder],
      entities: [
        InspectorPingCommand.InspectorPingCommand,
        InspectConceptCommand.InspectConceptCommand,
        InspectScopeCommand.InspectScopeCommand,
        InspectFeatureCommand.InspectFeatureCommand
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
    const channel = this.scope.resolve(InspectorChannel.InspectorChannel);
    if (!channel) return Promise.resolve();
    return await channel.disconnect();
  }
};
exports.A_ConceptInspectorClient = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side running bundle for the A-Concept inspector: ships the channel transport processor + a polymorphic onExecute forwarder so any A_Command executed under its scope is shipped to a remote inspector server."
  })
], exports.A_ConceptInspectorClient);
//# sourceMappingURL=A-InspectorClient.container.js.map
//# sourceMappingURL=A-InspectorClient.container.js.map