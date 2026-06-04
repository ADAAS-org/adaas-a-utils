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
    // NOTE: do NOT unlink shared filenames here. Jest worker files share
    // process.cwd(); deleting a hardcoded path can race against another
    // worker that just wrote it (caused intermittent A-Config flakes).
    // Each test owns its own conf file with a unique name and cleans it
    // up in a `finally` block.
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


