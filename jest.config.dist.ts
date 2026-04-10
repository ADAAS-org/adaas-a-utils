import type { Config } from '@jest/types';

// Run tests against the compiled dist output instead of source files.
const config: Config.InitialOptions = {
    verbose: true,
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@adaas/a-utils/a-channel$': '<rootDir>/dist/node/lib/A-Channel',
        '^@adaas/a-utils/a-command$': '<rootDir>/dist/node/lib/A-Command',
        '^@adaas/a-utils/a-config$': '<rootDir>/dist/node/lib/A-Config',
        '^@adaas/a-utils/a-execution$': '<rootDir>/dist/node/lib/A-Execution',
        '^@adaas/a-utils/a-logger$': '<rootDir>/dist/node/lib/A-Logger',
        '^@adaas/a-utils/a-manifest$': '<rootDir>/dist/node/lib/A-Manifest',
        '^@adaas/a-utils/a-memory$': '<rootDir>/dist/node/lib/A-Memory',
        '^@adaas/a-utils/a-operation$': '<rootDir>/dist/node/lib/A-Operation',
        '^@adaas/a-utils/a-polyfill$': '<rootDir>/dist/node/lib/A-Polyfill/index.node',
        '^@adaas/a-utils/a-route$': '<rootDir>/dist/node/lib/A-Route',
        '^@adaas/a-utils/a-schedule$': '<rootDir>/dist/node/lib/A-Schedule',
        '^@adaas/a-utils/a-service$': '<rootDir>/dist/node/lib/A-Service',
        '^@adaas/a-utils/a-signal$': '<rootDir>/dist/node/lib/A-Signal',
        '^@adaas/a-utils/a-state-machine$': '<rootDir>/dist/node/lib/A-StateMachine',

        '^@adaas/a-utils/helpers/(.*)$': '<rootDir>/dist/node/helpers/$1',
    }
};
export default config;
