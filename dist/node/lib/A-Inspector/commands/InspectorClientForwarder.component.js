'use strict';

var aConcept = require('@adaas/a-concept');
var core = require('@adaas/a-frame/core');
var aCommand = require('@adaas/a-utils/a-command');
var AInspector_error = require('../A-Inspector.error');
var InspectorChannel = require('../transport/InspectorChannel');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
exports.InspectorClientForwarder = class InspectorClientForwarder extends aConcept.A_Component {
  async forward(command, channel) {
    await channel.initialize;
    const Ctor = command.constructor;
    const code = Ctor.entity ?? Ctor.code ?? Ctor.name;
    const payload = command.toJSON();
    let response;
    try {
      response = await channel.request({ code, payload });
    } catch (err) {
      const unwrapped = unwrapInspectorError(err);
      await command.fail(
        unwrapped instanceof AInspector_error.A_InspectorError ? unwrapped : new AInspector_error.A_InspectorError({
          title: AInspector_error.A_InspectorError.InspectorTransportError,
          description: err?.message ?? String(err),
          originalError: err
        })
      );
      return;
    }
    const remote = response?.data?.payload;
    const remoteResult = remote?.result;
    if (process.env.A_INSPECTOR_TEST_VERBOSE) {
      console.log("[forwarder] response.data=", JSON.stringify(response?.data));
      console.log("[forwarder] remote=", JSON.stringify(remote));
      console.log("[forwarder] remoteResult=", JSON.stringify(remoteResult));
    }
    await command.complete(remoteResult);
  }
};
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aCommand.A_CommandFeatures.onExecute,
    scope: [aCommand.A_Command]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(InspectorChannel.InspectorChannel))
], exports.InspectorClientForwarder.prototype, "forward", 1);
exports.InspectorClientForwarder = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side onExecute extension that forwards any A_Command it sees to a remote inspector server via the registered InspectorChannel."
  })
], exports.InspectorClientForwarder);
function unwrapInspectorError(err) {
  let current = err;
  let found;
  const seen = /* @__PURE__ */ new Set();
  while (current && !seen.has(current)) {
    seen.add(current);
    if (current instanceof AInspector_error.A_InspectorError) found = current;
    current = current.originalError ?? current._originalError ?? current.cause;
  }
  return found ?? err;
}
//# sourceMappingURL=InspectorClientForwarder.component.js.map
//# sourceMappingURL=InspectorClientForwarder.component.js.map