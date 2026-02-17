import type { A_Logger } from "@adaas/a-utils/a-logger";
import { IpathInterface } from "../A-Polyfill.types";

export abstract class A_PathPolyfillBase {
    protected _path!: IpathInterface;
    protected _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {}

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(): Promise<IpathInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._path;
    }

    protected async init(): Promise<void> {
        try {
            await this.initImplementation();
            this._initialized = true;
        } catch (error) {
            this.logger.error('Failed to initialize path polyfill', error);
            throw error;
        }
    }

    protected abstract initImplementation(): Promise<void>;
}