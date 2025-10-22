import './jest.setup';
import { A_Scope } from '@adaas/a-concept';
import { A_Polyfill } from '@adaas/a-utils/lib/A-Polyfill/A-Polyfill.component';
import { config } from 'dotenv';
config();
jest.retryTimes(0);

describe('A-Polyfill Tests', () => {
    it('It Should allow to create A-polyfill component', async () => {
        const testScope = new A_Scope({
            components: [A_Polyfill]
        });

        const polyfill = testScope.resolve(A_Polyfill);

        await polyfill.load();

        expect(polyfill).toBeInstanceOf(A_Polyfill);

    });

    it('It Should return fs', async () => {

        const testScope = new A_Scope({
            components: [A_Polyfill]
        });

        const polyfill = testScope.resolve(A_Polyfill);
        await polyfill.load();

        const fs = await polyfill.fs();

        expect(fs).toBeDefined();
    });
    it('It Should return crypto', async () => {

        const testScope = new A_Scope({
            components: [A_Polyfill]
        });

        const polyfill = testScope.resolve(A_Polyfill);
        await polyfill.load();

        const crypto = await polyfill.crypto();

        expect(crypto).toBeDefined();
    });

    it('Crypto should calculate Hash', async () => {

        const testScope = new A_Scope({
            components: [A_Polyfill]
        });

        const polyfill = testScope.resolve(A_Polyfill);
        await polyfill.load();

        const crypto = await polyfill.crypto();

        const hash = await crypto.createFileHash('./index.ts', 'sha-256');

        expect(hash).toBeDefined();

    });


});