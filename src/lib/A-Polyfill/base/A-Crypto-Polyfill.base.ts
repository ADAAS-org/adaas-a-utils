import type { A_Logger } from "@adaas/a-utils/a-logger";
import { IcryptoInterface, Ifspolyfill } from "../A-Polyfill.types";

export abstract class A_CryptoPolyfillBase {
    protected _crypto!: IcryptoInterface;
    protected _initialized: boolean = false;
    protected _fsPolyfill?: Ifspolyfill;

    constructor(
        protected logger: A_Logger
    ) {}

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(fsPolyfill?: Ifspolyfill): Promise<IcryptoInterface> {
        if (!this._initialized) {
            this._fsPolyfill = fsPolyfill;
            await this.init();
        }
        return this._crypto;
    }

    protected async init(): Promise<void> {
        try {
            await this.initImplementation();
            this._initialized = true;
        } catch (error) {
            this.logger.error('Failed to initialize crypto polyfill', error);
            throw error;
        }
    }

    protected abstract initImplementation(): Promise<void>;
}