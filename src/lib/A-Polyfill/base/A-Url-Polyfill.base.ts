import type { A_Logger } from "@adaas/a-utils/a-logger";
import { IurlInterface } from "../A-Polyfill.types";

export abstract class A_UrlPolyfillBase {
    protected _url!: IurlInterface;
    protected _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {}

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<IurlInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._url;
    }

    protected async init(): Promise<void> {
        try {
            await this.initImplementation();
            this._initialized = true;
        } catch (error) {
            this.logger.error('Failed to initialize url polyfill', error);
            throw error;
        }
    }

    protected abstract initImplementation(): Promise<void>;
}