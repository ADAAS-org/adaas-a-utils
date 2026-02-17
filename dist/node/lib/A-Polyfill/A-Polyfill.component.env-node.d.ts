import { Ifspolyfill, IcryptoInterface, IhttpInterface, IhttpsInterface, IpathInterface, IurlInterface, IbufferInterface, IprocessInterface } from './A-Polyfill.types.js';
import { A_Component } from '@adaas/a-concept';
import { A_Logger } from '../A-Logger/A-Logger.component.js';
import { A_CryptoPolyfill } from './node/A-Crypto-Polyfill.js';
import { A_HttpPolyfill } from './node/A-Http-Polyfill.js';
import { A_HttpsPolyfill } from './node/A-Https-Polyfill.js';
import { A_PathPolyfill } from './node/A-Path-Polyfill.js';
import { A_UrlPolyfill } from './node/A-Url-Polyfill.js';
import { A_BufferPolyfill } from './node/A-Buffer-Polyfill.js';
import { A_ProcessPolyfill } from './node/A-Process-Polyfill.js';
import { A_FSPolyfill } from './node/A-FS-Polyfill.js';
import './base/A-Buffer-Polyfill.base.js';
import './base/A-Crypto-Polyfill.base.js';
import './base/A-FS-Polyfill.base.js';
import './base/A-Http-Polyfill.base.js';
import './base/A-Https-Polyfill.base.js';
import './base/A-Path-Polyfill.base.js';
import './base/A-Process-Polyfill.base.js';
import './base/A-Url-Polyfill.base.js';
import '../A-Logger/A-Logger.types.js';
import '../A-Logger/A-Logger.env.js';
import '../A-Config/A-Config.context.js';
import '../A-Config/A-Config.types.js';
import '../A-Execution/A-Execution.context.js';
import '../A-Config/A-Config.constants.js';

declare class A_Polyfill extends A_Component {
    protected logger: A_Logger;
    protected _fsPolyfill: A_FSPolyfill;
    protected _cryptoPolyfill: A_CryptoPolyfill;
    protected _httpPolyfill: A_HttpPolyfill;
    protected _httpsPolyfill: A_HttpsPolyfill;
    protected _pathPolyfill: A_PathPolyfill;
    protected _urlPolyfill: A_UrlPolyfill;
    protected _bufferPolyfill: A_BufferPolyfill;
    protected _processPolyfill: A_ProcessPolyfill;
    protected _initializing: Promise<void> | null;
    /**
     * Indicates whether the channel is connected
     */
    protected _initialized?: Promise<void>;
    constructor(logger: A_Logger);
    /**
     * Indicates whether the channel is connected
     */
    get ready(): Promise<void>;
    load(): Promise<void>;
    attachToWindow(): Promise<void>;
    protected _loadInternal(): Promise<void>;
    /**
     * Allows to use the 'fs' polyfill methods regardless of the environment
     * This method loads the 'fs' polyfill and returns its instance
     *
     * @returns
     */
    fs(): Promise<Ifspolyfill>;
    /**
     * Allows to use the 'crypto' polyfill methods regardless of the environment
     * This method loads the 'crypto' polyfill and returns its instance
     *
     * @returns
     */
    crypto(): Promise<IcryptoInterface>;
    /**
     * Allows to use the 'http' polyfill methods regardless of the environment
     * This method loads the 'http' polyfill and returns its instance
     *
     * @returns
     */
    http(): Promise<IhttpInterface>;
    /**
     * Allows to use the 'https' polyfill methods regardless of the environment
     * This method loads the 'https' polyfill and returns its instance
     *
     * @returns
     */
    https(): Promise<IhttpsInterface>;
    /**
     * Allows to use the 'path' polyfill methods regardless of the environment
     * This method loads the 'path' polyfill and returns its instance
     *
     * @returns
     */
    path(): Promise<IpathInterface>;
    /**
     * Allows to use the 'url' polyfill methods regardless of the environment
     * This method loads the 'url' polyfill and returns its instance
     *
     * @returns
     */
    url(): Promise<IurlInterface>;
    /**
     * Allows to use the 'buffer' polyfill methods regardless of the environment
     * This method loads the 'buffer' polyfill and returns its instance
     *
     * @returns
     */
    buffer(): Promise<IbufferInterface>;
    /**
     * Allows to use the 'process' polyfill methods regardless of the environment
     * This method loads the 'process' polyfill and returns its instance
     *
     * @returns
     */
    process(): Promise<IprocessInterface>;
}

export { A_Polyfill };
