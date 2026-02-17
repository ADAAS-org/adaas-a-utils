import { A_Frame } from "@adaas/a-frame";
import { A_OperationContext } from "@adaas/a-utils/a-operation";
import { A_ChannelRequestStatuses } from "./A-Channel.constants";



@A_Frame.Fragment({
    name: 'A-ChannelRequest',
    description: 'Context for managing channel requests. It encapsulates the request parameters and the result including status and data.'
})
export class A_ChannelRequest<
    _ParamsType extends Record<string, any> = Record<string, any>,
    _ResultType extends Record<string, any> = Record<string, any>,
> extends A_OperationContext<
    'request',
    _ParamsType,
    {
        data?: _ResultType;
        status?: A_ChannelRequestStatuses;
    }
> {

    constructor(
        params?: _ParamsType,
    ) {
        super('request', params);
    }


    get status(): A_ChannelRequestStatuses | undefined {
        return this.result?.status;
    }

    get data(): _ResultType | undefined {
        return this.result?.data;
    }


    succeed(result: _ResultType): void {
        const existed = this.result;

        super.succeed({
            ...existed,
            data: result,
            status: A_ChannelRequestStatuses.SUCCESS,
        });
    }

}    