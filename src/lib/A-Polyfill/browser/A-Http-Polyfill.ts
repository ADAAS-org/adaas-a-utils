import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_HttpPolyfillBase } from "../base/A-Http-Polyfill.base";

export class A_HttpPolyfill extends A_HttpPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
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