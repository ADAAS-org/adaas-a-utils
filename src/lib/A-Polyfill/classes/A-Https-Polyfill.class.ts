import { A_Context } from "@adaas/a-concept";
import { IhttpsInterface } from "../A-Polyfill.types";
import { A_Logger } from "../../A-Logger/A-Logger.component";

export class A_HttpsPolyfillClass {
    private _https!: IhttpsInterface;
    private _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {

    }

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<IhttpsInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._https;
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
        const httpsModule = await import('https');
        this._https = {
            request: httpsModule.request,
            get: httpsModule.get,
            createServer: httpsModule.createServer
        };
    }

    private initBrowser(): void {
        this._https = {
            request: (options: any, callback?: (res: any) => void) => {
                this.logger.warning('https.request not available in browser/test environment, use fetch instead');
                return this.createMockRequest(options, callback, true);
            },
            get: (url: string | any, callback?: (res: any) => void) => {
                this.logger.warning('https.get not available in browser/test environment, use fetch instead');
                return this.createMockRequest(typeof url === 'string' ? { hostname: url } : url, callback, true);
            },
            createServer: () => {
                this.logger.error('https.createServer not available in browser/test environment');
                return null;
            }
        };
    }

    private createMockRequest(options: any, callback?: (res: any) => void, isHttps: boolean = true) {
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