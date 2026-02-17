import type { A_Logger } from "@adaas/a-utils/a-logger";
import { A_CryptoPolyfillBase } from "../base/A-Crypto-Polyfill.base";

export class A_CryptoPolyfill extends A_CryptoPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._crypto = {
            createFileHash: () => {
                this.logger.warning('File hash not available in browser environment');
                return Promise.resolve('');
            },
            createTextHash: (text: string, algorithm: string = 'SHA-384') => new Promise<string>(async (resolve, reject) => {
                try {
                    if (!crypto.subtle) {
                        throw new Error('SubtleCrypto not available');
                    }
                    const encoder = new TextEncoder();
                    const data = encoder.encode(text);
                    const hashBuffer = await crypto.subtle.digest(algorithm, data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashBase64 = btoa(String.fromCharCode(...hashArray));
                    resolve(`${algorithm}-${hashBase64}`);
                } catch (error) {
                    reject(error);
                }
            })
        };
    }
}