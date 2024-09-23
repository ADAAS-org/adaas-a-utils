import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,

    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
        "@adaas/a-utils/constants/(.*)": ["<rootDir>/src/constants/$1"],
        "@adaas/a-utils/global/(.*)": ["<rootDir>/src/global/$1"],
        "@adaas/a-utils/types/(.*)": ["<rootDir>/src/types/$1"],
        "@adaas/a-utils/helpers/(.*)": ["<rootDir>/src/helpers/$1"],
        "@adaas/a-utils/decorators/(.*)": ["<rootDir>/src/decorators/$1"],
    }

};
export default config;