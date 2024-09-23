import { A_TYPES__ServerError } from '../types/A_ServerError.types';
import { AxiosError } from 'axios';
import { A_TYPES__Error } from '../types/A_Error.types';
import { A_CONSTANTS__ERROR_CODES } from '../constants/errors.constants';


export class A_Error extends Error {

    code!: string;
    description!: string;
    originalError?: Error | any
    link?: string;


    constructor(
        params: A_TYPES__Error | Error | AxiosError | any
    ) {
        super(params?.message || 'Oops... Something went wrong');
        this.identifyErrorType(params);
        
    }


    get id(): string | undefined {
        return this.code.split('@')[1]
    }


    protected identifyErrorType(error: Error | AxiosError | A_TYPES__Error) {

        if ((error as A_TYPES__ServerError).code &&
            (error as A_TYPES__ServerError).description &&
            (error as A_TYPES__ServerError).serverCode) {

            const target = error as A_TYPES__ServerError;

            this.message = target.message;
            this.code = target.code;
            this.description = target.description;
            this.originalError = target.originalError;
            this.link = target.link;
        }
        else if (error instanceof Error) {
            this.message = error.message;
            this.code = A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = 'If you see this error please let us know.';
            this.originalError = error;
            this.link = 'https://support.adaas.org/error/' + this.id;


        } else if (error instanceof AxiosError) {
            this.message = error.response?.data.message || error.message;
            this.code = error.response?.data.code || A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = error.response?.data.description || 'If you see this error please let us know.';
            this.originalError = error.response;
            this.link = 'https://support.adaas.org/error/' + this.id;
        }
    }


    get compilingData(): A_TYPES__Error {
        return {
            message: this.message,
            code: this.code,
            description: this.description,
            originalError: this.originalError
        }
    }

    toJSON(): A_TYPES__Error {
        return this.compilingData;
    }
}


