import { A_Error } from '@adaas/a-concept';

declare class A_ManifestError extends A_Error {
    static readonly ManifestInitializationError = "A-Manifest Initialization Error";
}

export { A_ManifestError };
