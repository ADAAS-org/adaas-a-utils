import { A_Fragment } from '@adaas/a-concept';

declare class A_Route<_TParams extends Record<string, any> = Record<string, any>, _TQuery extends Record<string, any> = Record<string, any>> extends A_Fragment {
    url: string;
    constructor(url: string | RegExp);
    /**
     * Returns path only without query and hash
     */
    get path(): string;
    /**
     * Returns array of parameter names in the route path
     */
    get params(): string[];
    /**
     * Returns protocol based on URL scheme
     */
    get protocol(): string;
    extractParams(url: string): _TParams;
    extractQuery(url: string): _TQuery;
    toString(): string;
    toRegExp(): RegExp;
    toAFeatureExtension(extensionScope?: Array<string>): RegExp;
}

export { A_Route };
