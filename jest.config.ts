import type { Config } from '@jest/types';

// Sync object
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
        '^@adaas/a-utils/a-channel$': '<rootDir>/src/lib/A-Channel',
        '^@adaas/a-utils/a-command$': '<rootDir>/src/lib/A-Command',
        '^@adaas/a-utils/a-config$': '<rootDir>/src/lib/A-Config',
        '^@adaas/a-utils/a-execution$': '<rootDir>/src/lib/A-Execution',
        '^@adaas/a-utils/a-logger$': '<rootDir>/src/lib/A-Logger',
        '^@adaas/a-utils/a-manifest$': '<rootDir>/src/lib/A-Manifest',
        '^@adaas/a-utils/a-memory$': '<rootDir>/src/lib/A-Memory',
        '^@adaas/a-utils/a-operation$': '<rootDir>/src/lib/A-Operation',
        // Note: A-Polyfill is a special case with separate entry points for Node and browser, so we alias it directly to the Node version here. Consumers can import the browser version directly if needed.
        '^@adaas/a-utils/a-polyfill$': '<rootDir>/src/lib/A-Polyfill/index.node',
        '^@adaas/a-utils/a-route$': '<rootDir>/src/lib/A-Route',
        '^@adaas/a-utils/a-schedule$': '<rootDir>/src/lib/A-Schedule',
        '^@adaas/a-utils/a-service$': '<rootDir>/src/lib/A-Service',
        '^@adaas/a-utils/a-signal$': '<rootDir>/src/lib/A-Signal',
        '^@adaas/a-utils/a-state-machine$': '<rootDir>/src/lib/A-StateMachine'
    }
};
export default config;