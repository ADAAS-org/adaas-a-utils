import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_UrlPolyfillBase } from "../base/A-Url-Polyfill.base";
import urlModule from 'url';

export class A_UrlPolyfill extends A_UrlPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._url = {
            parse: urlModule.parse,
            format: urlModule.format,
            resolve: urlModule.resolve,
            URL: (urlModule.URL || globalThis.URL) as any,
            URLSearchParams: (urlModule.URLSearchParams || globalThis.URLSearchParams) as any
        };
    }
}