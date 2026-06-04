// Standalone "fake app" that boots an A-Concept with the
// `A_ConceptInspectorContainer` listening on 127.0.0.1:33833.
//
// Run manually with:
//     npm run inspector:server
//
// Then poke at it with e.g. `tests/A-Inspector-auth.test.ts` or
// any other client.

import { A_Concept } from '@adaas/a-concept';

import { A_Config, ENVConfigReader } from '../src/lib/A-Config';
import { A_Logger, A_LoggerEnvVariables } from '../src/lib/A-Logger';
import { A_Polyfill } from '../src/lib/A-Polyfill/index.node';
import {
    A_ConceptInspector,
    A_ConceptInspectorContainer,
    A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY,
} from '../src/lib/A-Inspector';

import { TargetAppContainer } from '../tests/fixtures/inspector-target-app';


const HOST = '127.0.0.1';
const PORT = 33833;
const SECRET = 'inspector-dev-secret';


async function main() {
    process.env.A_CONCEPT_NAME ??= 'inspector-dev-concept';
    process.env.A_CONCEPT_INSPECTOR_ENABLED ??= '1';
    process.env.A_CONCEPT_INSPECTOR_HOST ??= HOST;
    process.env.A_CONCEPT_INSPECTOR_PORT ??= String(PORT);
    process.env.A_CONCEPT_DEBUG_SECRET ??= SECRET;

    const config = new A_Config({
        variables: [...A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY],
        defaults: {
            [A_LoggerEnvVariables.A_LOGGER_LEVEL]: 'debug',
        },
    });

    const concept = new A_Concept({
        name: 'inspector-dev-concept',
        components: [A_Polyfill, A_Logger, ENVConfigReader],
        fragments: [config],
        containers: [
            A_ConceptInspectorContainer,
            TargetAppContainer,
        ],
    });

    await concept.load();
    await concept.start();

    const addr = A_ConceptInspectorContainer.address;
    // eslint-disable-next-line no-console
    console.log(`\n[inspector-dev-server] listening on tcp://${addr?.host}:${addr?.port}`);
    // eslint-disable-next-line no-console
    console.log(`[inspector-dev-server] secret = ${SECRET}\n`);

    const shutdown = async () => {
        try { await concept.stop(); } catch { /* ignore */ }
        process.exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    // Keep alive.
    setInterval(() => { /* heartbeat */ }, 60_000);
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[inspector-dev-server] FAILED', err);
    process.exit(1);
});

void A_ConceptInspector;
