import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_CryptoPolyfillBase } from "../base/A-Crypto-Polyfill.base";
import crypto from 'crypto';

export class A_CryptoPolyfill extends A_CryptoPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._crypto = {
            createTextHash: (text: string, algorithm: string = 'sha384') => Promise.resolve(
                `${algorithm}-${crypto.createHash(algorithm).update(text).digest('base64')}`
            ),
            createFileHash: (filePath: string, algorithm: string = 'sha384') => new Promise(async (resolve, reject) => {
                try {
                    if (!this._fsPolyfill) {
                        throw new Error('FS polyfill is required for file hashing');
                    }
                    const hash = crypto.createHash(algorithm);
                    const fileStream = this._fsPolyfill.createReadStream(filePath);
                    fileStream.on('data', (data: any) => hash.update(data));
                    fileStream.on('end', () => resolve(`${algorithm}-${hash.digest('base64')}`));
                    fileStream.on('error', (err: any) => reject(err));
                } catch (error) {
                    reject(error);
                }
            })
        };
    }
}