import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
        "@adaas/a-utils/constants/(.*)": ["<rootDir>/src/constants/$1"],
        "@adaas/a-utils/lib/(.*)": ["<rootDir>/src/lib/$1"],
        "@adaas/a-utils/types/(.*)": ["<rootDir>/src/types/$1"],
        "@adaas/a-utils/helpers/(.*)": ["<rootDir>/src/helpers/$1"],
        "@adaas/a-utils/utils/(.*)": ["<rootDir>/src/utils/$1"],
    }

};
export default config;