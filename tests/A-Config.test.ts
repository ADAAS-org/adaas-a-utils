import {
    A_Concept,
    A_CONSTANTS__DEFAULT_ENV_VARIABLES,
    A_Context,
} from '@adaas/a-concept';
import fs from 'fs';
import { A_Config } from '@adaas/a-utils/lib/A-Config/A-Config.context';
import { A_Polyfill } from '@adaas/a-utils/lib/A-Polyfill/A-Polyfill.component';
import { A_ConfigLoader } from '@adaas/a-utils/lib/A-Config/A-Config.container';
import { ENVConfigReader } from '@adaas/a-utils/lib/A-Config/components/ENVConfigReader.component';
import { FileConfigReader } from '@adaas/a-utils/lib/A-Config/components/FileConfigReader.component';
import { A_Logger } from '@adaas/a-utils/lib/A-Logger/A-Logger.component';

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
        // 1. create a config file
        fs.writeFileSync('a-concept.conf.json', JSON.stringify({
            testVar1: 'env1',
            testVar2: 'env2'
        }, null, 4));

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
            name: 'test-concept',
            containers: [configLoader]
        })

        await concept.load();

        expect(config.get('TEST_VAR1')).toBe('env1');
        expect(config.get('TEST_VAR1')).toBe('env1');

        // 3. delete the config file
        fs.unlinkSync('a-concept.conf.json');
    });
    it('Should Allow to create a config object with variables from File with different variable cases', async () => {

        // 1. create a config file
        fs.writeFileSync('a-concept.conf.json', JSON.stringify({
            testVar2: 'env2'
        }, null, 4));

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
            name: 'test-concept',
            containers: [configLoader]
        })

        await concept.load();



        expect(config.get('testVar1')).toBe('default1');
        expect(config.get('testVar2')).toBe('env2');

        // 3. delete the config file
        fs.unlinkSync('a-concept.conf.json');
    });
});