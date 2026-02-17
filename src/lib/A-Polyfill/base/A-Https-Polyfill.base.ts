import type { A_Logger } from "@adaas/a-utils/a-logger";
import { IhttpsInterface } from "../A-Polyfill.types";

export abstract class A_HttpsPolyfillBase {
    protected _https!: IhttpsInterface;
    protected _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {}

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<IhttpsInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._https;
    }

    protected async init(): Promise<void> {
        try {
            await this.initImplementation();
            this._initialized = true;
        } catch (error) {
            this.logger.error('Failed to initialize https polyfill', error);
            throw error;
        }
    }

    protected abstract initImplementation(): Promise<void>;
}