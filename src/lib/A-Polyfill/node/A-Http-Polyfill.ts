import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_HttpPolyfillBase } from "../base/A-Http-Polyfill.base";
import httpModule from 'http';

export class A_HttpPolyfill extends A_HttpPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._http = {
            request: httpModule.request,
            get: httpModule.get,
            createServer: httpModule.createServer
        };
    }
}