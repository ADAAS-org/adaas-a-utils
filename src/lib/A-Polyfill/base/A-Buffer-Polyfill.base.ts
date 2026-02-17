import type { A_Logger } from "@adaas/a-utils/a-logger";
import { IbufferInterface } from "../A-Polyfill.types";

export abstract class A_BufferPolyfillBase {
    protected _buffer!: IbufferInterface;
    protected _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {}

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<IbufferInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._buffer;
    }

    protected async init(): Promise<void> {
        try {
            await this.initImplementation();
            this._initialized = true;
        } catch (error) {
            this.logger.error('Failed to initialize buffer polyfill', error);
            throw error;
        }
    }

    protected abstract initImplementation(): Promise<void>;
}