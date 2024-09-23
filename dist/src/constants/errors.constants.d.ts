export declare enum A_CONSTANTS__ERROR_CODES {
    INCORRECT_A_ENTITY_CONSTRUCTOR = "ERR-A-Entity-0001",
    INVALID_ASEID = "ERR-ASEID-0001",
    UNEXPECTED_ERROR = "ERR-0001",
    METHOD_NOT_IMPLEMENTED = "ERR-0002",
    ROUTE_NOT_FOUND = "ERR-0003",
    TOKEN_NOT_PROVIDED = "ERR-0004",
    NOT_ALL_PARAMS_WAS_PROVIDED = "ERR-0005",
    CREDENTIALS_NOT_PROVIDED = "ERR-0006",
    CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ = "ERR-0007"
}
export declare const A_CONSTANTS__DEFAULT_ERRORS: {
    INCORRECT_A_ENTITY_CONSTRUCTOR: {
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
    };
    INVALID_ASEID: {
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
    };
    UNEXPECTED_ERROR: {
        serverCode: number;
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
    };
    METHOD_NOT_IMPLEMENTED: {
        serverCode: number;
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
        link: string;
    };
    ROUTE_NOT_FOUND: {
        serverCode: number;
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
    };
    TOKEN_NOT_PROVIDED: {
        serverCode: number;
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
    };
    NOT_ALL_PARAMS_WAS_PROVIDED: {
        serverCode: number;
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
    };
    CREDENTIALS_NOT_PROVIDED: {
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
    };
    CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ: {
        serverCode: number;
        code: A_CONSTANTS__ERROR_CODES;
        description: string;
        message: string;
    };
};
