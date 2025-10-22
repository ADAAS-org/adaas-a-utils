


export class A_PolyfillClass {

    private _fs!: Ifspolyfill;
    private _crypto!: IcryptoInterface;

    // eslint-disable-next-line no-use-before-define
    private fsName = 'fs'
    private cryptoName = 'crypto'


    async fs() {
        if (!this._fs) {
            await this.init();
        }
        return this._fs;
    }

    async crypto() {
        if (!this._crypto) {
            await this.init();
        }
        return this._crypto;
    }


    get env(): 'server' | 'browser' {
        let testEnvironment: 'server' | 'browser' = 'browser';

        try {
            testEnvironment = window.location ? 'browser' : 'server';

        } catch (error) {

            testEnvironment = 'server';
        }

        return testEnvironment;
    }


    private async init() {
        try {
            if (this.env === 'server') {
                // eslint-disable-next-line no-use-before-define
                this._fs = await import('' + this.fsName) as Ifspolyfill;
                // eslint-disable-next-line no-use-before-define
                this._crypto = {
                    createTextHash: () => Promise.resolve(''),
                    createFileHash: (filePath: string, algorithm: string = 'sha384') => new Promise(async (resolve, reject) => {
                        try {
                            const crypto = await import('' + this.cryptoName);

                            const hash = crypto.createHash(algorithm);
                            const fileStream = this._fs.createReadStream(filePath);

                            fileStream.on('data', (data) => hash.update(data));
                            fileStream.on('end', () => resolve(`${algorithm}-${hash.digest('base64')}`));
                            fileStream.on('error', (err) => reject(err));

                        } catch (error) {
                            return reject(error);
                        }

                    })
                }
            }
            else {
                throw new Error('Not Server Environment');
            }
        } catch (error) {

            this._fs = {
                readFileSync: (path: string, encoding: string) => '',
                existsSync: (path: string) => false,
                createReadStream: (path: string) => ''
            };

            this._crypto = {
                createFileHash: () => Promise.resolve(''),
                createTextHash: (text: string, algorithm: string = 'SHA-384') => new Promise<string>(async (resolve, reject) => {
                    try {
                        const encoder = new TextEncoder();
                        const data = encoder.encode(text);
                        const hashBuffer = await crypto.subtle.digest(algorithm, data);
                        const hashArray = Array.from(new Uint8Array(hashBuffer));
                        const hashBase64 = btoa(String.fromCharCode(...hashArray.map(byte => String.fromCharCode(byte) as any)));
                        return resolve(`${algorithm}-${hashBase64}`);
                    } catch (error) {
                        return reject(error);
                    }
                })
            };
        }
    }
}
