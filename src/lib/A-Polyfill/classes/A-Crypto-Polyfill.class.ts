import { A_Context } from "@adaas/a-concept";
import { IcryptoInterface, Ifspolyfill } from "../A-Polyfill.types";
import { A_Logger } from "../../A-Logger/A-Logger.component";

export class A_CryptoPolyfillClass {
    private _crypto!: IcryptoInterface;
    private _initialized: boolean = false;
    private _fsPolyfill?: Ifspolyfill;

    constructor(
        protected logger: A_Logger
    ) {
    }

    get isInitialized(): boolean {
        return this._initialized;
    }

    async get(fsPolyfill?: Ifspolyfill): Promise<IcryptoInterface> {
        if (!this._initialized) {
            this._fsPolyfill = fsPolyfill;
            await this.init();
        }
        return this._crypto;
    }

    private async init(): Promise<void> {
        try {
            if (A_Context.environment === 'server') {
                await this.initServer();
            } else {
                this.initBrowser();
            }
            this._initialized = true;
        } catch (error) {
            this.initBrowser();
            this._initialized = true;
        }
    }

    private async initServer(): Promise<void> {
        const crypto = await import('crypto');
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

    private initBrowser(): void {
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