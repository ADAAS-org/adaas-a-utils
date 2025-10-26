import { A_Context } from "@adaas/a-concept";
import { IurlInterface } from "../A-Polyfill.types";
import { A_Logger } from "../../A-Logger/A-Logger.component";

export class A_UrlPolyfillClass {
    private _url!: IurlInterface;
    private _initialized: boolean = false;

    get isInitialized(): boolean {
        return this._initialized;
    }

    constructor(
        protected logger: A_Logger
    ) {

    }

    async get(): Promise<IurlInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._url;
    }

    private async init(): Promise<void> {
        try {
            if (A_Context.environment === 'server') {
                await this.initServer();
            } else {
                this.initBrowser();
            }
            this._initialized = true;
        } catch (error) {
            this.initBrowser();
            this._initialized = true;
        }
    }

    private async initServer(): Promise<void> {
        const urlModule = await import('url');
        this._url = {
            parse: urlModule.parse,
            format: urlModule.format,
            resolve: urlModule.resolve,
            URL: (urlModule.URL || globalThis.URL) as any,
            URLSearchParams: (urlModule.URLSearchParams || globalThis.URLSearchParams) as any
        };
    }

    private initBrowser(): void {
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