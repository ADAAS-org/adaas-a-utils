import { A_Component } from '@adaas/a-concept';
import { A as A_Logger } from './A-Logger.component-Be-LMV3I.mjs';
import './a-execution.mjs';

interface Ifspolyfill {
    readFileSync: (path: string, encoding: string) => string;
    existsSync: (path: string) => boolean;
    createReadStream: (path: string, options?: BufferEncoding) => any;
}
interface IcryptoInterface {
    createTextHash(text: string, algorithm: string): Promise<string>;
    createFileHash(filePath: string, algorithm: string): Promise<string>;
}
interface IhttpInterface {
    request: (options: any, callback?: (res: any) => void) => any;
    get: (url: string | any, callback?: (res: any) => void) => any;
    createServer: (requestListener?: (req: any, res: any) => void) => any;
}
interface IhttpsInterface {
    request: (options: any, callback?: (res: any) => void) => any;
    get: (url: string | any, callback?: (res: any) => void) => any;
    createServer: (options: any, requestListener?: (req: any, res: any) => void) => any;
}
interface IpathInterface {
    join: (...paths: string[]) => string;
    resolve: (...paths: string[]) => string;
    dirname: (path: string) => string;
    basename: (path: string, ext?: string) => string;
    extname: (path: string) => string;
    relative: (from: string, to: string) => string;
    normalize: (path: string) => string;
    isAbsolute: (path: string) => boolean;
    parse: (path: string) => any;
    format: (pathObject: any) => string;
    sep: string;
    delimiter: string;
}
interface IurlInterface {
    parse: (urlString: string) => any;
    format: (urlObject: any) => string;
    resolve: (from: string, to: string) => string;
    URL: typeof URL;
    URLSearchParams: typeof URLSearchParams;
}
interface IbufferInterface {
    from: (data: any, encoding?: string) => any;
    alloc: (size: number, fill?: any) => any;
    allocUnsafe: (size: number) => any;
    isBuffer: (obj: any) => boolean;
    concat: (list: any[], totalLength?: number) => any;
}
interface IprocessInterface {
    env: Record<string, string | undefined>;
    argv: string[];
    platform: string;
    version: string;
    versions: Record<string, string>;
    cwd: () => string;
    exit: (code?: number) => never;
    nextTick: (callback: Function, ...args: any[]) => void;
}

declare abstract class A_FSPolyfillBase {
    protected logger: A_Logger;
    protected _fs: Ifspolyfill;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<Ifspolyfill>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

declare class A_FSPolyfill extends A_FSPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
}

declare abstract class A_CryptoPolyfillBase {
    protected logger: A_Logger;
    protected _crypto: IcryptoInterface;
    protected _initialized: boolean;
    protected _fsPolyfill?: Ifspolyfill;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(fsPolyfill?: Ifspolyfill): Promise<IcryptoInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

declare class A_CryptoPolyfill extends A_CryptoPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
}

declare abstract class A_HttpPolyfillBase {
    protected logger: A_Logger;
    protected _http: IhttpInterface;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IhttpInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

declare class A_HttpPolyfill extends A_HttpPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
    private createMockRequest;
}

declare abstract class A_HttpsPolyfillBase {
    protected logger: A_Logger;
    protected _https: IhttpsInterface;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IhttpsInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

declare class A_HttpsPolyfill extends A_HttpsPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
    private createMockRequest;
}

declare abstract class A_PathPolyfillBase {
    protected logger: A_Logger;
    protected _path: IpathInterface;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IpathInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

declare class A_PathPolyfill extends A_PathPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
}

declare abstract class A_UrlPolyfillBase {
    protected logger: A_Logger;
    protected _url: IurlInterface;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IurlInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

declare class A_UrlPolyfill extends A_UrlPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
}

declare abstract class A_BufferPolyfillBase {
    protected logger: A_Logger;
    protected _buffer: IbufferInterface;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IbufferInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

declare class A_BufferPolyfill extends A_BufferPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
}

declare abstract class A_ProcessPolyfillBase {
    protected logger: A_Logger;
    protected _process: IprocessInterface;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IprocessInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

declare class A_ProcessPolyfill extends A_ProcessPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
}

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

export { A_BufferPolyfill, A_BufferPolyfillBase, A_CryptoPolyfill, A_CryptoPolyfillBase, A_FSPolyfill, A_FSPolyfillBase, A_HttpPolyfillBase, A_HttpsPolyfill, A_HttpsPolyfillBase, A_PathPolyfill, A_PathPolyfillBase, A_Polyfill, A_ProcessPolyfill, A_ProcessPolyfillBase, A_UrlPolyfill, A_UrlPolyfillBase, type IbufferInterface, type IcryptoInterface, type Ifspolyfill, type IhttpInterface, type IhttpsInterface, type IpathInterface, type IprocessInterface, type IurlInterface };
