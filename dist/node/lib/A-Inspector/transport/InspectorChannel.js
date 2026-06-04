'use strict';

var aChannel = require('@adaas/a-utils/a-channel');
var core = require('@adaas/a-frame/core');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.InspectorChannel = class InspectorChannel extends aChannel.A_Channel {
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
exports.InspectorChannel = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Client-side A_Channel for talking to a remote A_ConceptInspector server."
  })
], exports.InspectorChannel);
//# sourceMappingURL=InspectorChannel.js.map
//# sourceMappingURL=InspectorChannel.js.map