import { A_Error } from '@adaas/a-concept';

declare class A_Service_Error extends A_Error {
    static readonly ServiceLoadError = "Service load error";
    static readonly ServiceStartError = "Service start error";
    static readonly ServiceStopError = "Service stop error";
}

export { A_Service_Error };
