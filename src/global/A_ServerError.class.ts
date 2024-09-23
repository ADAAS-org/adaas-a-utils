import { A_TYPES__ServerError } from '../types/A_ServerError.types';
import { AxiosError } from 'axios';
import { A_Error } from './A_Error.class';
import { A_CONSTANTS__ERROR_CODES } from '../constants/errors.constants';


export class A_ServerError extends A_Error {

    code!: string;
    description!: string;
    serverCode: number = 500;
    originalError: Error | any


    constructor(params: A_TYPES__ServerError | Error | AxiosError | any) {
        super(params);
        this.identifyErrorType(params);
    }


    protected identifyErrorType(error: Error | AxiosError | A_TYPES__ServerError) {

        if ((error as A_TYPES__ServerError).code &&
            (error as A_TYPES__ServerError).description &&
            (error as A_TYPES__ServerError).serverCode) {

            const target = error as A_TYPES__ServerError;

            this.message = target.message;
            this.code = target.code;
            this.description = target.description;
            this.serverCode = target.serverCode;
            this.originalError = target.originalError;
            this.link = target.link;
        }
        else if (error instanceof Error) {
            this.message = error.message;
            this.code = A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = 'If you see this error please let us know.';
            this.serverCode = 500;
            this.originalError = error;
            this.link = 'https://support.adaas.org/error/' + this.id;

        } else if (error instanceof AxiosError) {
            this.message = error.response?.data.message || error.message;
            this.code = error.response?.data.code || A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = error.response?.data.description || 'If you see this error please let us know.';
            this.serverCode = error.response?.status || 500;
            this.originalError = error.response;
            this.link = 'https://support.adaas.org/error/' + this.id;
        }
    }


    get compilingData(): A_TYPES__ServerError {
        return {
            message: this.message,
            code: this.code,
            description: this.description,
            serverCode: this.serverCode,
            originalError: this.originalError
        }
    }

    toJSON(): A_TYPES__ServerError {
        return this.compilingData;
    }
}


