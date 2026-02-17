import { A_Error } from '@adaas/a-concept';

declare class A_SignalBusError extends A_Error {
    static readonly SignalProcessingError = "Signal processing error";
}

export { A_SignalBusError };
