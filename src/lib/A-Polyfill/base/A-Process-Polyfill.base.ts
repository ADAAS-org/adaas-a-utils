import type { A_Logger } from "@adaas/a-utils/a-logger";
import { IprocessInterface } from "../A-Polyfill.types";

export abstract class A_ProcessPolyfillBase {
    protected _process!: IprocessInterface;
    protected _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {}

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<IprocessInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._process;
    }

    protected async init(): Promise<void> {
        try {
            await this.initImplementation();
            this._initialized = true;
        } catch (error) {
            this.logger.error('Failed to initialize process polyfill', error);
            throw error;
        }
    }

    protected abstract initImplementation(): Promise<void>;
}