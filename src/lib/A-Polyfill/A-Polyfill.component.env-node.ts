import { A_Component, A_Concept, A_Context, A_Inject } from "@adaas/a-concept";
import type { A_Logger } from "@adaas/a-utils/a-logger";
import { A_CryptoPolyfill } from "./node/A-Crypto-Polyfill";
import { A_HttpPolyfill } from "./node/A-Http-Polyfill";
import { A_HttpsPolyfill } from "./node/A-Https-Polyfill";
import { A_PathPolyfill } from "./node/A-Path-Polyfill";
import { A_UrlPolyfill } from "./node/A-Url-Polyfill";
import { A_BufferPolyfill } from "./node/A-Buffer-Polyfill";
import { A_ProcessPolyfill } from "./node/A-Process-Polyfill";
import { A_FSPolyfill } from "./node/A-FS-Polyfill";
import { A_Frame } from "@adaas/a-frame";



@A_Frame.Component({
    namespace: 'A-Utils',
    name: 'A-Polyfill',
    description: 'Polyfill component that provides cross-environment compatibility for Node.js core modules such as fs, crypto, http, https, path, url, buffer, and process. It dynamically loads appropriate polyfills based on the execution environment (Node.js or browser), enabling seamless usage of these modules in different contexts.'
})
export class A_Polyfill extends A_Component {

    protected _fsPolyfill!: A_FSPolyfill;
    protected _cryptoPolyfill!: A_CryptoPolyfill;
    protected _httpPolyfill!: A_HttpPolyfill;
    protected _httpsPolyfill!: A_HttpsPolyfill;
    protected _pathPolyfill!: A_PathPolyfill;
    protected _urlPolyfill!: A_UrlPolyfill;
    protected _bufferPolyfill!: A_BufferPolyfill;
    protected _processPolyfill!: A_ProcessPolyfill;

    protected _initializing: Promise<void> | null = null;
    /**
     * Indicates whether the channel is connected
     */
    protected _initialized?: Promise<void>;


    constructor(
        @A_Inject('A_Logger') protected logger: A_Logger
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
    }


    protected async _loadInternal() {

        this._fsPolyfill = new A_FSPolyfill(this.logger);
        this._cryptoPolyfill = new A_CryptoPolyfill(this.logger);
        this._httpPolyfill = new A_HttpPolyfill(this.logger);
        this._httpsPolyfill = new A_HttpsPolyfill(this.logger);
        this._pathPolyfill = new A_PathPolyfill(this.logger);
        this._urlPolyfill = new A_UrlPolyfill(this.logger);
        this._bufferPolyfill = new A_BufferPolyfill(this.logger);
        this._processPolyfill = new A_ProcessPolyfill(this.logger);

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