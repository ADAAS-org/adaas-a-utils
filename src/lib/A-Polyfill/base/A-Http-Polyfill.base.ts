import type { A_Logger } from "@adaas/a-utils/a-logger";
import { IhttpInterface } from "../A-Polyfill.types";

export abstract class A_HttpPolyfillBase {
    protected _http!: IhttpInterface;
    protected _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {}

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<IhttpInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._http;
    }

    protected async init(): Promise<void> {
        try {
            await this.initImplementation();
            this._initialized = true;
        } catch (error) {
            this.logger.error('Failed to initialize http polyfill', error);
            throw error;
        }
    }

    protected abstract initImplementation(): Promise<void>;
}