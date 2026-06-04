// Inspector child fixture
//
// Spawned by `tests/A-Inspector.test.ts` via `ts-node` to verify the
// `A_ConceptInspector` actually exposes a separate Node process for
// remote introspection.
//
// On startup it prints a single line:
//
//     INSPECTOR_READY {"host":"127.0.0.1","port":54321}
//
// to stdout. The parent process parses that line to learn the
// ephemeral port chosen by the OS (`A_CONCEPT_INSPECTOR_PORT=0`),
// then performs queries via `A_ConceptInspector.query(...)`.
//
// SIGTERM cleanly stops the concept and exits.

import { A_Concept } from '@adaas/a-concept';

import { A_Config, ENVConfigReader } from '../../src/lib/A-Config';
import { A_Logger, A_LoggerEnvVariables } from '../../src/lib/A-Logger';
import { A_Polyfill } from '../../src/lib/A-Polyfill/index.node';
import {
    A_ConceptInspector,
    A_ConceptInspectorContainer,
    A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY,
} from '../../src/lib/A-Inspector';

import { TargetAppContainer } from './inspector-target-app';


async function main() {
    // Polyfill / Logger / ConfigReader live at the concept (root)
    // scope so that the pre-built `A_ConceptInspectorContainer` (and
    // its inherited scope) can resolve `A_Config` and `A_Logger` via
    // `@A_Inject`. The inspector container itself stays self-contained
    // — it only ships the snapshot helper, command repository, and the
    // four inspect commands.

    const config = new A_Config({
        variables: [...A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY],
        defaults: {
            [A_LoggerEnvVariables.A_LOGGER_LEVEL]: 'debug',
        },
    });

    const concept = new A_Concept({
        name: 'inspector-child-concept',
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
    if (!addr) {
        process.stderr.write('INSPECTOR_FAILED no address after start\n');
        process.exit(1);
    }

    process.stdout.write(`INSPECTOR_READY ${JSON.stringify(addr)}\n`);

    const shutdown = async () => {
        try { await concept.stop(); } catch { /* ignore */ }
        process.exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    // Keep the process alive.
    setInterval(() => { /* heartbeat */ }, 60_000);
}

main().catch((err) => {
    const detail = err?.originalError ?? err?._originalError ?? err;
    process.stderr.write(`INSPECTOR_FAILED ${err?.stack ?? err}\n`);
    if (detail && detail !== err) {
        process.stderr.write(`INSPECTOR_FAILED_CAUSE ${detail?.stack ?? detail}\n`);
    }
    process.exit(1);
});

// Silence "unused" lint — A_ConceptInspector is re-imported only so
// the inspector module's decorators always execute in this process.
void A_ConceptInspector;
