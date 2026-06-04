import { A_Error } from '@adaas/a-concept';

declare class A_InspectorError extends A_Error {
    static readonly InspectorStartError = "Inspector start error";
    static readonly InspectorStopError = "Inspector stop error";
    static readonly InspectorAuthError = "Inspector authentication failure";
    static readonly InspectorTransportError = "Inspector transport error";
    static readonly InspectorProtocolError = "Inspector protocol error";
    static readonly InspectorCommandNotFoundError = "Inspector command not found";
    static readonly InspectorDisabledError = "Inspector disabled";
    static readonly InspectorNotSupportedError = "Inspector not supported in this runtime";
}

export { A_InspectorError };
