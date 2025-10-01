import { AxiosError } from 'axios';
import { A_TYPES__Error } from '../types/A_Error.types';
export declare class A_Error extends Error {
    code: string;
    description: string;
    originalError?: Error | any;
    link?: string;
    constructor(params: A_TYPES__Error | Error | AxiosError | string | any);
    get id(): string | undefined;
    protected identifyErrorType(error: Error | AxiosError | A_TYPES__Error | string | any): void;
    get compilingData(): A_TYPES__Error;
    toJSON(): A_TYPES__Error;
}
