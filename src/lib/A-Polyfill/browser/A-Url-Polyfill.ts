import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_UrlPolyfillBase } from "../base/A-Url-Polyfill.base";

export class A_UrlPolyfill extends A_UrlPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._url = {
            parse: (urlString: string) => {
                try {
                    const url = new URL(urlString);
                    return {
                        protocol: url.protocol,
                        hostname: url.hostname,
                        port: url.port,
                        pathname: url.pathname,
                        search: url.search,
                        hash: url.hash,
                        host: url.host,
                        href: url.href
                    };
                } catch {
                    return {};
                }
            },
            format: (urlObject: any) => {
                try {
                    return new URL('', urlObject.href || `${urlObject.protocol}//${urlObject.host}${urlObject.pathname}${urlObject.search}${urlObject.hash}`).href;
                } catch {
                    return '';
                }
            },
            resolve: (from: string, to: string) => {
                try {
                    return new URL(to, from).href;
                } catch {
                    return to;
                }
            },
            URL: globalThis.URL,
            URLSearchParams: globalThis.URLSearchParams
        };
    }
}