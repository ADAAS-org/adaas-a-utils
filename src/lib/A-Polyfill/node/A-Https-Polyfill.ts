import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_HttpsPolyfillBase } from "../base/A-Https-Polyfill.base";
import httpsModule from 'https';


export class A_HttpsPolyfill extends A_HttpsPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._https = {
            request: httpsModule.request,
            get: httpsModule.get,
            createServer: httpsModule.createServer
        };
    }
}