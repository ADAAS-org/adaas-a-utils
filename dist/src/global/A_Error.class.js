"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Error = void 0;
const axios_1 = require("axios");
const errors_constants_1 = require("../constants/errors.constants");
class A_Error extends Error {
    constructor(params) {
        super(typeof params === 'string'
            ? params :
            (params === null || params === void 0 ? void 0 : params.message) || 'Oops... Something went wrong');
        this.identifyErrorType(params);
    }
    get id() {
        return this.code.split('@')[1];
    }
    identifyErrorType(error) {
        var _a, _b, _c;
        if (typeof error === 'string') {
            this.message = error;
            this.code = errors_constants_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = 'If you see this error please let us know.';
            this.link = 'https://support.adaas.org/error/' + this.id;
            return;
        }
        if (error.code &&
            error.description &&
            error.serverCode) {
            const target = error;
            this.message = target.message;
            this.code = target.code;
            this.description = target.description;
            this.originalError = target.originalError;
            this.link = target.link;
        }
        else if (error instanceof Error) {
            this.message = error.message;
            this.code = errors_constants_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = 'If you see this error please let us know.';
            this.originalError = error;
            this.link = 'https://support.adaas.org/error/' + this.id;
        }
        else if (error instanceof axios_1.AxiosError) {
            this.message = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.message) || error.message;
            this.code = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data.code) || errors_constants_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data.description) || 'If you see this error please let us know.';
            this.originalError = error.response;
            this.link = 'https://support.adaas.org/error/' + this.id;
        }
    }
    get compilingData() {
        return {
            message: this.message,
            code: this.code,
            description: this.description,
            originalError: this.originalError
        };
    }
    toJSON() {
        return this.compilingData;
    }
}
exports.A_Error = A_Error;
//# sourceMappingURL=A_Error.class.js.map