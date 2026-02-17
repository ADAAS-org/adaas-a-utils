import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Frame } from '@adaas/a-frame';
import { A_OperationContext } from '@adaas/a-utils/a-operation';
import { A_ChannelRequestStatuses } from './A-Channel.constants';

let A_ChannelRequest = class extends A_OperationContext {
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
      status: A_ChannelRequestStatuses.SUCCESS
    });
  }
};
A_ChannelRequest = __decorateClass([
  A_Frame.Fragment({
    name: "A-ChannelRequest",
    description: "Context for managing channel requests. It encapsulates the request parameters and the result including status and data."
  })
], A_ChannelRequest);

export { A_ChannelRequest };
//# sourceMappingURL=A-ChannelRequest.context.mjs.map
//# sourceMappingURL=A-ChannelRequest.context.mjs.map