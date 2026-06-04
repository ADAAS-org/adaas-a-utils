import { __decorateClass, __decorateParam } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Caller, A_Component } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';
import { A_Command, A_CommandFeatures } from '@adaas/a-utils/a-command';
import { A_InspectorError } from '../A-Inspector.error';
import { InspectorChannel } from '../transport/InspectorChannel';

let InspectorClientForwarder = class extends A_Component {
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
        unwrapped instanceof A_InspectorError ? unwrapped : new A_InspectorError({
          title: A_InspectorError.InspectorTransportError,
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
  A_Feature.Extend({
    name: A_CommandFeatures.onExecute,
    scope: [A_Command]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(InspectorChannel))
], InspectorClientForwarder.prototype, "forward", 1);
InspectorClientForwarder = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side onExecute extension that forwards any A_Command it sees to a remote inspector server via the registered InspectorChannel."
  })
], InspectorClientForwarder);
function unwrapInspectorError(err) {
  let current = err;
  let found;
  const seen = /* @__PURE__ */ new Set();
  while (current && !seen.has(current)) {
    seen.add(current);
    if (current instanceof A_InspectorError) found = current;
    current = current.originalError ?? current._originalError ?? current.cause;
  }
  return found ?? err;
}

export { InspectorClientForwarder };
//# sourceMappingURL=InspectorClientForwarder.component.mjs.map
//# sourceMappingURL=InspectorClientForwarder.component.mjs.map