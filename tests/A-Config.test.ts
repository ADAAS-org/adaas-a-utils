import {
    A_Concept,
    A_CONCEPT_ENV,
    A_CONSTANTS__DEFAULT_ENV_VARIABLES,
    A_Context,
} from '@adaas/a-concept';
import { A_Config, A_ConfigLoader, ENVConfigReader, FileConfigReader } from '@adaas/a-utils/a-config';
import { A_Logger } from '@adaas/a-utils/a-logger';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';
import fs from 'fs';
import path from 'path';

jest.retryTimes(0);

describe('A-Config tests', () => {
    it('Should Allow to create a config object', async () => {
        const config = new A_Config({
            variables: [],
            defaults: {}
        });
    });
    it('Should Allow to create a config object with default values', async () => {
        const config = new A_Config({
            variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
            defaults: {
                TEST_VAR1: 'default1',
            }
        });

        expect(config.get('TEST_VAR1')).toBe('default1');
        expect(config.get('TEST_VAR2')).toBeUndefined();
    });
    it('Should Allow to create a config object with ENV values', async () => {

        process.env['TEST_VAR1'] = 'env1';
        process.env['TEST_VAR2'] = 'env2';

        const config = new A_Config<['TEST_VAR1', 'TEST_VAR2']>({
            defaults: {
                TEST_VAR1: 'default1',
            }
        });

        const configLoader = new A_ConfigLoader({
            name: 'test-config-loader',
            fragments: [config],
            components: [A_Logger, A_Polyfill, FileConfigReader, ENVConfigReader]
        })

        const concept = new A_Concept({
            name: 'test-concept',
            containers: [configLoader]
        })

        await concept.load();

        expect(config.get('TEST_VAR1')).toBe('env1');
        expect(config.get('TEST_VAR2')).toBe('env2');

        delete process.env['TEST_VAR1'];
        delete process.env['TEST_VAR2'];
    });
    it('Should not Change Names of default env variables', async () => {
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] = 'my-project';
        process.env['TEST_VAR2'] = 'env2';

        const config = new A_Config({
            variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
            defaults: {
                TEST_VAR1: 'default1',
            }
        });

        const configLoader = new A_ConfigLoader({
            name: 'test-config-loader',
            fragments: [config],
            components: [A_Logger, A_Polyfill, ENVConfigReader]
        })

        const concept = new A_Concept({
            name: 'test-concept',
            containers: [configLoader]
        })


        await concept.load();

        expect(config.get('TEST_VAR1')).toBe('default1');
        expect(config.get('TEST_VAR2')).toBe('env2');
        expect(config.get('A_CONCEPT_NAME')).toBe('my-project');

        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME];
        delete process.env['TEST_VAR2'];
    });
    it('Should Throw an error if strict is true and variable is not defined', async () => {
        expect(() => {
            const config = new A_Config({
                strict: true,
                variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
                defaults: {
                    TEST_VAR1: 'default1',
                }
            });

            config.get('TEST_VAR3' as any);

        }).toThrowError();
    });
    it('Should Allow to create a config object with variables from File', async () => {
        // Use a unique concept name per test so the conf file path can never
        // collide with another test file running in a parallel jest worker
        // (workers share process.cwd()).
        const conceptName = `a-config-test-from-file-${Math.random().toString(36).slice(2, 8)}`;
        const confPath = `${conceptName}.conf.json`;
        const prevConcept = process.env.A_CONCEPT_NAME;
        process.env.A_CONCEPT_NAME = conceptName;

        // 1. create a config file
        fs.writeFileSync(confPath, JSON.stringify({
            testVar1: 'env1',
            testVar2: 'env2'
        }, null, 4));

        try {
            const config = new A_Config({
                variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
                defaults: {
                    TEST_VAR1: 'default1',
                }
            });

            const configLoader = new A_ConfigLoader({
                name: 'test-config-loader',
                fragments: [config],
                components: [A_Logger, A_Polyfill, FileConfigReader]
            })

            const concept = new A_Concept({
                name: conceptName,
                containers: [configLoader]
            })

            await concept.load();

            expect(config.get('TEST_VAR1')).toBe('env1');
            expect(config.get('TEST_VAR1')).toBe('env1');
        } finally {
            try { fs.unlinkSync(confPath); } catch { /* ignore */ }
            if (prevConcept === undefined) delete process.env.A_CONCEPT_NAME;
            else process.env.A_CONCEPT_NAME = prevConcept;
        }
    });
    it('Should Allow to create a config object with variables from File with different variable cases', async () => {
        const conceptName = `a-config-test-cases-${Math.random().toString(36).slice(2, 8)}`;
        const confPath = `${conceptName}.conf.json`;
        const prevConcept = process.env.A_CONCEPT_NAME;
        process.env.A_CONCEPT_NAME = conceptName;

        // 1. create a config file
        fs.writeFileSync(confPath, JSON.stringify({
            testVar2: 'env2'
        }, null, 4));

        try {
            const config = new A_Config({
                variables: ['testVar1', 'testVar2'] as const,
                defaults: {
                    testVar1: 'default1',
                }
            });

            const configLoader = new A_ConfigLoader({
                name: 'test-config-loader',
                fragments: [config],
                components: [A_Logger, A_Polyfill, FileConfigReader]
            })

            const concept = new A_Concept({
                name: conceptName,
                containers: [configLoader]
            })

            await concept.load();

            expect(config.get('testVar1')).toBe('default1');
            expect(config.get('testVar2')).toBe('env2');
        } finally {
            try { fs.unlinkSync(confPath); } catch { /* ignore */ }
            if (prevConcept === undefined) delete process.env.A_CONCEPT_NAME;
            else process.env.A_CONCEPT_NAME = prevConcept;
        }
    });
});


// ── A_CONCEPT_ROOT_FOLDER tests ────────────────────────────────────────────────

describe('A_CONCEPT_ROOT_FOLDER', () => {

    const ORIGINAL_ENV = process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER];

    afterEach(() => {
        // restore
        if (ORIGINAL_ENV === undefined) {
            delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER];
        } else {
            process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER] = ORIGINAL_ENV;
        }
    });

    it('defaults to process.cwd() when env var is not set', () => {
        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER];
        expect(A_CONCEPT_ENV.A_CONCEPT_ROOT_FOLDER).toBe(process.cwd());
    });

    it('returns the value set via env var', () => {
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER] = '/custom/path';
        expect(A_CONCEPT_ENV.A_CONCEPT_ROOT_FOLDER).toBe('/custom/path');
    });

    it('A_CONCEPT_ROOT_FOLDER points to a directory that contains package.json (current project)', () => {
        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER];
        const rootFolder = A_CONCEPT_ENV.A_CONCEPT_ROOT_FOLDER;
        const pkgPath = path.join(rootFolder, 'package.json');
        expect(fs.existsSync(pkgPath)).toBe(true);
    });
});