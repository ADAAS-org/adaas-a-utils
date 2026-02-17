import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_HttpsPolyfillBase } from "../base/A-Https-Polyfill.base";

export class A_HttpsPolyfill extends A_HttpsPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
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