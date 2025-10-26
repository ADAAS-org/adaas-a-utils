import { A_Component, A_Concept, A_Context, A_Inject } from "@adaas/a-concept";
import { A_Logger } from "../A-Logger/A-Logger.component";
import { A_FSPolyfillClass } from "./classes/A-FS-Polyfill.class";
import { A_CryptoPolyfillClass } from "./classes/A-Crypto-Polyfill.class";
import { A_HttpPolyfillClass } from "./classes/A-Http-Polyfill.class";
import { A_HttpsPolyfillClass } from "./classes/A-Https-Polyfill.class";
import { A_PathPolyfillClass } from "./classes/A-Path-Polyfill.class";
import { A_UrlPolyfillClass } from "./classes/A-Url-Polyfill.class";
import { A_BufferPolyfillClass } from "./classes/A-Buffer-Polyfill.class";
import { A_ProcessPolyfillClass } from "./classes/A-Process-Polyfill.class";

export class A_Polyfill extends A_Component {

    protected _fsPolyfill!: A_FSPolyfillClass;
    protected _cryptoPolyfill!: A_CryptoPolyfillClass;
    protected _httpPolyfill!: A_HttpPolyfillClass;
    protected _httpsPolyfill!: A_HttpsPolyfillClass;
    protected _pathPolyfill!: A_PathPolyfillClass;
    protected _urlPolyfill!: A_UrlPolyfillClass;
    protected _bufferPolyfill!: A_BufferPolyfillClass;
    protected _processPolyfill!: A_ProcessPolyfillClass;

    protected _initializing: Promise<void> | null = null;
    /**
     * Indicates whether the channel is connected
     */
    protected _initialized?: Promise<void>;


    constructor(
        @A_Inject(A_Logger) protected logger: A_Logger
    ) {
        super();
    }

    /**
     * Indicates whether the channel is connected
     */
    get ready(): Promise<void> {
        if (!this._initialized) {
            this._initialized = this._loadInternal();
        }
        return this._initialized;
    }



    @A_Concept.Load()
    async load() {
        await this.ready;
    }

    @A_Concept.Load()
    async attachToWindow() {
        if (A_Context.environment !== 'browser') return;


        (globalThis as any).A_Polyfill = this;
        // attach env variables
        (globalThis as any).process = { env: { NODE_ENV: 'production' }, cwd: () => "/" };
        (globalThis as any).__dirname = "/";

    }


    protected async _loadInternal() {

        this._fsPolyfill = new A_FSPolyfillClass(this.logger);
        this._cryptoPolyfill = new A_CryptoPolyfillClass(this.logger);
        this._httpPolyfill = new A_HttpPolyfillClass(this.logger);
        this._httpsPolyfill = new A_HttpsPolyfillClass(this.logger);
        this._pathPolyfill = new A_PathPolyfillClass(this.logger);
        this._urlPolyfill = new A_UrlPolyfillClass(this.logger);
        this._bufferPolyfill = new A_BufferPolyfillClass(this.logger);
        this._processPolyfill = new A_ProcessPolyfillClass(this.logger);

        // Initialize all polyfills to ensure they're ready
        await this._fsPolyfill.get();
        await this._cryptoPolyfill.get(await this._fsPolyfill.get());
        await this._httpPolyfill.get();
        await this._httpsPolyfill.get();
        await this._pathPolyfill.get();
        await this._urlPolyfill.get();
        await this._bufferPolyfill.get();
        await this._processPolyfill.get();
    }

    /**
     * Allows to use the 'fs' polyfill methods regardless of the environment
     * This method loads the 'fs' polyfill and returns its instance
     * 
     * @returns 
     */
    async fs() {
        await this.ready;

        return await this._fsPolyfill.get();
    }

    /**
     * Allows to use the 'crypto' polyfill methods regardless of the environment
     * This method loads the 'crypto' polyfill and returns its instance
     * 
     * @returns 
     */
    async crypto() {
        await this.ready;

        return await this._cryptoPolyfill.get();
    }

    /**
     * Allows to use the 'http' polyfill methods regardless of the environment
     * This method loads the 'http' polyfill and returns its instance
     * 
     * @returns 
     */
    async http() {
        await this.ready;

        return await this._httpPolyfill.get();
    }

    /**
     * Allows to use the 'https' polyfill methods regardless of the environment
     * This method loads the 'https' polyfill and returns its instance
     * 
     * @returns 
     */
    async https() {
        await this.ready;

        return await this._httpsPolyfill.get();
    }

    /**
     * Allows to use the 'path' polyfill methods regardless of the environment
     * This method loads the 'path' polyfill and returns its instance
     * 
     * @returns 
     */
    async path() {
        await this.ready;

        return await this._pathPolyfill.get();
    }

    /**
     * Allows to use the 'url' polyfill methods regardless of the environment
     * This method loads the 'url' polyfill and returns its instance
     * 
     * @returns 
     */
    async url() {
        await this.ready;

        return await this._urlPolyfill.get();
    }

    /**
     * Allows to use the 'buffer' polyfill methods regardless of the environment
     * This method loads the 'buffer' polyfill and returns its instance
     * 
     * @returns 
     */
    async buffer() {
        await this.ready;

        return await this._bufferPolyfill.get();
    }

    /**
     * Allows to use the 'process' polyfill methods regardless of the environment
     * This method loads the 'process' polyfill and returns its instance
     * 
     * @returns 
     */
    async process() {
        await this.ready;

        return await this._processPolyfill.get();
    }
}