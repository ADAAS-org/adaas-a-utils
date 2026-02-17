'use strict';

var aFrame = require('@adaas/a-frame');
var aOperation = require('@adaas/a-utils/a-operation');
var AChannel_constants = require('./A-Channel.constants');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_ChannelRequest = class A_ChannelRequest extends aOperation.A_OperationContext {
  constructor(params) {
    super("request", params);
  }
  get status() {
    return this.result?.status;
  }
  get data() {
    return this.result?.data;
  }
  succeed(result) {
    const existed = this.result;
    super.succeed({
      ...existed,
      data: result,
      status: AChannel_constants.A_ChannelRequestStatuses.SUCCESS
    });
  }
};
exports.A_ChannelRequest = __decorateClass([
  aFrame.A_Frame.Fragment({
    name: "A-ChannelRequest",
    description: "Context for managing channel requests. It encapsulates the request parameters and the result including status and data."
  })
], exports.A_ChannelRequest);
//# sourceMappingURL=A-ChannelRequest.context.js.map
//# sourceMappingURL=A-ChannelRequest.context.js.map