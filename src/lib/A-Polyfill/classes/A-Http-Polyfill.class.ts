import { A_Context } from "@adaas/a-concept";
import { IhttpInterface } from "../A-Polyfill.types";
import { A_Logger } from "../../A-Logger/A-Logger.component";

export class A_HttpPolyfillClass {
    private _http!: IhttpInterface;
    private _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {

    }

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<IhttpInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._http;
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
        const httpModule = await import('http');
        this._http = {
            request: httpModule.request,
            get: httpModule.get,
            createServer: httpModule.createServer
        };
    }

    private initBrowser(): void {
        this._http = {
            request: (options: any, callback?: (res: any) => void) => {
                this.logger.warning('http.request not available in browser/test environment, use fetch instead');
                return this.createMockRequest(options, callback, false);
            },
            get: (url: string | any, callback?: (res: any) => void) => {
                this.logger.warning('http.get not available in browser/test environment, use fetch instead');
                return this.createMockRequest(typeof url === 'string' ? { hostname: url } : url, callback, false);
            },
            createServer: () => {
                this.logger.error('http.createServer not available in browser/test environment');
                return null;
            }
        };
    }

    private createMockRequest(options: any, callback?: (res: any) => void, isHttps: boolean = false) {
        // Return a mock request that doesn't make real network calls
        const request = {
            end: () => {
                // Mock response for all environments
                if (callback) {
                    const mockResponse = {
                        statusCode: 200,
                        headers: {},
                        on: (event: string, handler: Function) => {
                            if (event === 'data') {
                                setTimeout(() => handler('mock data'), 0);
                            } else if (event === 'end') {
                                setTimeout(() => handler(), 0);
                            }
                        },
                        pipe: (dest: any) => {
                            if (dest.write) dest.write('mock data');
                            if (dest.end) dest.end();
                        }
                    };
                    setTimeout(() => callback(mockResponse), 0);
                }
            },
            write: (data: any) => {
                // Mock write
            },
            on: (event: string, handler: Function) => {
                // Mock event handling
            }
        };

        return request;
    }
}