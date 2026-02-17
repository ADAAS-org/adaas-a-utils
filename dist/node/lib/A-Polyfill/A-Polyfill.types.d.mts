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

export type { IbufferInterface, IcryptoInterface, Ifspolyfill, IhttpInterface, IhttpsInterface, IpathInterface, IprocessInterface, IurlInterface };
