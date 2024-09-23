import { config } from 'dotenv';
import { A_Polyfills } from '../src/global/A_Polyfills'
config();
jest.retryTimes(0);

describe('Polyfill Tests', () => {

    it('It Should return fs', async () => {

        const fs = await A_Polyfills.fs();


        console.log('fs: ', fs)


    });
    it('It Should return crypto', async () => {

        const crypto = await A_Polyfills.crypto();

        console.log('crypto: ', crypto)

    });

    it('Crypto should calculate Hash', async () => {

        const crypto = await A_Polyfills.crypto();

        const hash = await crypto.createFileHash('./index.ts', 'sha-256');

        console.log('hash: ', hash)

        
    });


});