// Integration test for `A_ConceptInspector`.
//
// Architecture:
//   1) ONE inspector CHILD process spawned for the whole describe block.
//      It hosts the inspector server + a sample target app (concept
//      `inspector-child-concept`, container `inspector-test-target-app`).
//   2) The TEST process plays the CLIENT role. A SINGLE A_Concept +
//      A_ConceptInspectorClient is booted for the happy-path test and
//      drives all four commands sequentially through the same socket.
//   3) A separate, freshly-booted client concept with the wrong secret
//      exercises the auth-failure path.
//
// This used to be split across many tests/files; the multi-command
// sequential case is the regression we care about (a single client must
// be able to issue Ping -> InspectConcept -> InspectScope ->
// InspectFeature without the framework picking a stale caller from a
// previous command).

import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

import { A_Concept } from '@adaas/a-concept';

import {
    A_ConceptInspectorClient,
    InspectorClientConfig,
    InspectorPingCommand,
    InspectConceptCommand,
    InspectScopeCommand,
    InspectFeatureCommand,
    A_InspectorError,
} from '@adaas/a-utils/a-inspector';


jest.setTimeout(30_000);

const FIXTURE = path.resolve(__dirname, 'fixtures', 'inspector-child.ts');
const SECRET = 'inspector-test-secret-1234';

type Child = {
    proc: ChildProcess;
    address: { host: string; port: number };
};

async function spawnInspectorChild(envOverrides: Record<string, string> = {}): Promise<Child> {
    const { NODE_OPTIONS, ...cleanEnv } = process.env;
    const proc = spawn(process.execPath, [
        '-r', 'ts-node/register/transpile-only',
        '-r', 'tsconfig-paths/register',
        FIXTURE,
    ], {
        cwd: path.resolve(__dirname, '..'),
        env: {
            ...cleanEnv,
            TS_NODE_TRANSPILE_ONLY: '1',
            A_CONCEPT_NAME: 'inspector-child-concept',
            A_CONCEPT_INSPECTOR_ENABLED: '1',
            A_CONCEPT_INSPECTOR_HOST: '127.0.0.1',
            A_CONCEPT_INSPECTOR_PORT: '0',
            A_CONCEPT_DEBUG_SECRET: SECRET,
            ...envOverrides,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    const stderrBuf: string[] = [];
    proc.stderr?.setEncoding('utf8');
    proc.stderr?.on('data', (d: string) => {
        stderrBuf.push(d);
        if (process.env.A_INSPECTOR_TEST_VERBOSE) process.stderr.write(`[child stderr] ${d}`);
    });

    return await new Promise<Child>((resolve, reject) => {
        let stdoutBuf = '';
        let settled = false;

        const onExit = (code: number | null) => {
            if (settled) return;
            settled = true;
            reject(new Error(
                `Inspector child exited early (code=${code})\nstderr:\n${stderrBuf.join('')}\nstdout:\n${stdoutBuf}`,
            ));
        };
        proc.once('exit', onExit);

        proc.stdout?.setEncoding('utf8');
        proc.stdout?.on('data', (chunk: string) => {
            stdoutBuf += chunk;
            if (process.env.A_INSPECTOR_TEST_VERBOSE) process.stderr.write(`[child stdout] ${chunk}`);

            const marker = 'INSPECTOR_READY ';
            let nl: number;
            while ((nl = stdoutBuf.indexOf('\n')) !== -1) {
                const line = stdoutBuf.slice(0, nl);
                stdoutBuf = stdoutBuf.slice(nl + 1);
                const idx = line.indexOf(marker);
                if (idx === -1) continue;

                try {
                    const addr = JSON.parse(line.slice(idx + marker.length));
                    settled = true;
                    proc.off('exit', onExit);
                    resolve({ proc, address: addr });
                } catch (err) {
                    settled = true;
                    reject(err);
                }
                return;
            }
        });
    });
}

async function killChild(child: ChildProcess | undefined): Promise<void> {
    if (!child || child.exitCode !== null) return;
    await new Promise<void>((resolve) => {
        child.once('exit', () => resolve());
        child.kill('SIGTERM');
        setTimeout(() => {
            if (child.exitCode === null) child.kill('SIGKILL');
        }, 2000);
    });
}

type ClientHandle = {
    client: A_ConceptInspectorClient;
    concept: A_Concept;
    run: <C extends { execute: () => Promise<any> }>(cmd: C) => Promise<C>;
    dispose: () => Promise<void>;
};

async function bootClient(
    address: { host: string; port: number },
    secret: string,
): Promise<ClientHandle> {
    const client = new A_ConceptInspectorClient(
        new InspectorClientConfig({
            host: address.host,
            port: address.port,
            secret,
        }),
    );
    const concept = new A_Concept({
        name: `inspector-client-concept-${address.port}-${Math.random().toString(36).slice(2, 8)}`,
        containers: [client],
    });

    await concept.load();
    await concept.start();

    const run = async <C extends { execute: () => Promise<any> }>(cmd: C): Promise<C> => {
        client.scope.register(cmd as any);
        await cmd.execute();
        return cmd;
    };

    const dispose = async () => {
        try { await client.disconnect(); } catch { /* ignore */ }
        try { await concept.stop(); } catch { /* ignore */ }
    };

    return { client, concept, run, dispose };
}

function unwrapInspectorError(e: any): A_InspectorError | undefined {
    const seen = new Set<any>();
    let cur = e;
    while (cur && !seen.has(cur)) {
        if (cur instanceof A_InspectorError) return cur;
        seen.add(cur);
        cur = cur.originalError ?? cur._originalError ?? cur.cause;
    }
    return undefined;
}


describe('A_ConceptInspector', () => {

    let child: Child;

    beforeAll(async () => {
        child = await spawnInspectorChild();
    });

    afterAll(async () => {
        await killChild(child?.proc);
    });

    it('runs all commands sequentially on one client and rejects bad auth on another', async () => {
        // ---- Happy path: a single client concept drives every command. ----
        const ok = await bootClient(child.address, SECRET);
        try {
            // 1) Ping
            const ping = await ok.run(new InspectorPingCommand({ token: 'hello-world' }));
            expect(ping.result?.pong).toBe(true);
            expect(ping.result?.token).toBe('hello-world');
            expect(typeof ping.result?.serverTime).toBe('string');

            // 2) InspectConcept
            const concept = await ok.run(new InspectConceptCommand({}));
            const conceptSnap = concept.result?.snapshot;
            expect(conceptSnap).toBeDefined();
            expect(conceptSnap!.name).toBe('inspector-child-concept');
            expect(Array.isArray(conceptSnap!.containers)).toBe(true);
            expect(conceptSnap!.containers.map((c: any) => c.name)).toEqual(
                expect.arrayContaining([
                    'A_ConceptInspector',
                    'inspector-test-target-app',
                ]),
            );

            // 3) InspectScope
            const scope = await ok.run(new InspectScopeCommand({
                scope: 'inspector-test-target-app',
            }));
            const scopeSnap = scope.result?.snapshot;
            expect(scopeSnap).toBeDefined();
            expect(scopeSnap!.name).toBe('inspector-test-target-app');
            expect(scopeSnap!.allowedComponents ?? []).toEqual(
                expect.arrayContaining(['CounterRepository', 'GreetingService']),
            );
            expect(scopeSnap!.allowedEntities ?? []).toEqual(
                expect.arrayContaining(['Counter']),
            );

            // 4) InspectFeature
            const feature = await ok.run(new InspectFeatureCommand({
                component: 'GreetingService',
                feature: 'greeting.hello',
                scope: 'inspector-test-target-app',
            }));
            const featureSnap = feature.result?.snapshot;
            expect(featureSnap).toBeDefined();
            expect(featureSnap!.feature).toBe('greeting.hello');
            expect(featureSnap!.component).toBeDefined();
            expect((featureSnap!.steps ?? []).length).toBeGreaterThan(0);
        } finally {
            await ok.dispose();
        }

        // ---- Auth failure: fresh client concept with the wrong secret. ----
        const bad = await bootClient(child.address, 'WRONG-SECRET');
        try {
            const ping = new InspectorPingCommand({ token: 'nope' });

            let caught: any;
            try {
                await bad.run(ping);
            } catch (err) {
                caught = err;
            }

            const recordedError = (ping as any).error ?? caught;
            expect(recordedError).toBeDefined();
            expect(unwrapInspectorError(recordedError)).toBeInstanceOf(A_InspectorError);
        } finally {
            await bad.dispose();
        }
    });

});
