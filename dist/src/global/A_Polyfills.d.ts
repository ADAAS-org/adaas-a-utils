interface Ifspolyfill {
    readFileSync: (path: string, encoding: string) => string;
    existsSync: (path: string) => boolean;
    createReadStream: (path: string, options?: BufferEncoding) => any;
}
interface ICryptoInterface {
    createTextHash(text: string, algorithm: string): Promise<string>;
    createFileHash(filePath: string, algorithm: string): Promise<string>;
}
declare class A_PolyfillsClass {
    private _fs;
    private _crypto;
    private fsName;
    private cryptoName;
    fs(): Promise<Ifspolyfill>;
    crypto(): Promise<ICryptoInterface>;
    get env(): 'server' | 'browser';
    private init;
}
export declare const A_Polyfills: A_PolyfillsClass;
export {};
