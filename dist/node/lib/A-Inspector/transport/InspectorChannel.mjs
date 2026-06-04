import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Channel } from '@adaas/a-utils/a-channel';
import { A_Frame } from '@adaas/a-frame/core';

let InspectorChannel = class extends A_Channel {
  constructor() {
    super(...arguments);
    /** True once the auth handshake has been accepted by the server. */
    this.authed = false;
    /** Newline-delimited JSON read buffer. */
    this.readBuffer = "";
    /**
     * In-flight commands awaiting a Result/Error message correlated by id.
     */
    this.pending = /* @__PURE__ */ new Map();
  }
};
InspectorChannel = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side A_Channel for talking to a remote A_ConceptInspector server."
  })
], InspectorChannel);

export { InspectorChannel };
//# sourceMappingURL=InspectorChannel.mjs.map
//# sourceMappingURL=InspectorChannel.mjs.map