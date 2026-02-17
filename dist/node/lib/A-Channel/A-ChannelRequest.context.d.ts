import { A_OperationContext } from '../A-Operation/A-Operation.context.js';
import { A_ChannelRequestStatuses } from './A-Channel.constants.js';
import '@adaas/a-concept';
import '../A-Operation/A-Operation.types.js';
import '../A-Execution/A-Execution.context.js';

declare class A_ChannelRequest<_ParamsType extends Record<string, any> = Record<string, any>, _ResultType extends Record<string, any> = Record<string, any>> extends A_OperationContext<'request', _ParamsType, {
    data?: _ResultType;
    status?: A_ChannelRequestStatuses;
}> {
    constructor(params?: _ParamsType);
    get status(): A_ChannelRequestStatuses | undefined;
    get data(): _ResultType | undefined;
    succeed(result: _ResultType): void;
}

export { A_ChannelRequest };
