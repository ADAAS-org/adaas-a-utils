import type { A_Logger } from "@adaas/a-utils/a-logger";
import { Ifspolyfill } from "../A-Polyfill.types";

export abstract class A_FSPolyfillBase {
    protected _fs!: Ifspolyfill;
    protected _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {}

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<Ifspolyfill> {
        if (!this._initialized) {
            await this.init();
        }
        return this._fs;
    }

    protected async init(): Promise<void> {
        try {
            await this.initImplementation();
            this._initialized = true;
        } catch (error) {
            this.logger.error('Failed to initialize fs polyfill', error);
            throw error;
        }
    }

    protected abstract initImplementation(): Promise<void>;
}