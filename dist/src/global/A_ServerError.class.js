"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ServerError = void 0;
const axios_1 = require("axios");
const A_Error_class_1 = require("./A_Error.class");
const errors_constants_1 = require("../constants/errors.constants");
class A_ServerError extends A_Error_class_1.A_Error {
    constructor(params) {
        super(params);
        this.serverCode = 500;
        this.identifyErrorType(params);
    }
    identifyErrorType(error) {
        var _a, _b, _c, _d;
        if (error.code &&
            error.description &&
            error.serverCode) {
            const target = error;
            this.message = target.message;
            this.code = target.code;
            this.description = target.description;
            this.serverCode = target.serverCode;
            this.originalError = target.originalError;
            this.link = target.link;
        }
        else if (error instanceof Error) {
            this.message = error.message;
            this.code = errors_constants_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = 'If you see this error please let us know.';
            this.serverCode = 500;
            this.originalError = error;
            this.link = 'https://support.adaas.org/error/' + this.id;
        }
        else if (error instanceof axios_1.AxiosError) {
            this.message = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.message) || error.message;
            this.code = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data.code) || errors_constants_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
            this.description = ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data.description) || 'If you see this error please let us know.';
            this.serverCode = ((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) || 500;
            this.originalError = error.response;
            this.link = 'https://support.adaas.org/error/' + this.id;
        }
    }
    get compilingData() {
        return {
            message: this.message,
            code: this.code,
            description: this.description,
            serverCode: this.serverCode,
            originalError: this.originalError
        };
    }
    toJSON() {
        return this.compilingData;
    }
}
exports.A_ServerError = A_ServerError;
//# sourceMappingURL=A_ServerError.class.js.map