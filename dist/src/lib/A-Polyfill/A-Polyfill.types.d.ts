export interface Ifspolyfill {
    readFileSync: (path: string, encoding: string) => string;
    existsSync: (path: string) => boolean;
    createReadStream: (path: string, options?: BufferEncoding) => any;
}
export interface IcryptoInterface {
    createTextHash(text: string, algorithm: string): Promise<string>;
    createFileHash(filePath: string, algorithm: string): Promise<string>;
}
