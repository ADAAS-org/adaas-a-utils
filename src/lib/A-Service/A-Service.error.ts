import { A_Error } from "@adaas/a-concept";



export class A_Service_Error extends A_Error {

    static readonly ServiceStartError = 'Service start error';

    static readonly ServiceStopError = 'Service stop error';

}