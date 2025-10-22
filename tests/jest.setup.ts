import { A_Context } from '@adaas/a-concept';
import fs from 'fs';

// ==========================================================
// ====================Error Handlers========================

/**
 * Base hooks for tests
 */
beforeAll(async () => {

    return Promise.resolve();
});

afterAll(async () => {
    try {
        fs.unlinkSync(`a-concept.conf.json`);

    } catch (error) {

    }
    return Promise.resolve();
});

beforeEach(async () => {
    A_Context.reset();
    return Promise.resolve();
});

afterEach(async () => {
    A_Context.reset();
    return Promise.resolve();
});


