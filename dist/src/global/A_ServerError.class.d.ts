import { A_TYPES__ServerError } from '../types/A_ServerError.types';
import { AxiosError } from 'axios';
import { A_Error } from './A_Error.class';
export declare class A_ServerError extends A_Error {
    code: string;
    description: string;
    serverCode: number;
    originalError: Error | any;
    constructor(params: A_TYPES__ServerError | Error | AxiosError | any);
    protected identifyErrorType(error: Error | AxiosError | A_TYPES__ServerError): void;
    get compilingData(): A_TYPES__ServerError;
    toJSON(): A_TYPES__ServerError;
}
