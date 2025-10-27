

export type A_ChannelRequestContext_Serialized<
    _ParamsType extends Record<string, any> = Record<string, any>,
    _ResultType extends Record<string, any> = Record<string, any>,
> = {
    params: _ParamsType;
    result?: _ResultType;
    status: string;
    errors?: string[];
};