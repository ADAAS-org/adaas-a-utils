import { A_Error } from '@adaas/a-concept';

declare class A_ConfigError extends A_Error {
    static readonly InitializationError = "A-Config Initialization Error";
}

export { A_ConfigError };
