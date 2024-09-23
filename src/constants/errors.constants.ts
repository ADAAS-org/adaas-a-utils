
export enum A_CONSTANTS__ERROR_CODES {
    // Default Utils Errors 
    INCORRECT_A_ENTITY_CONSTRUCTOR = 'ERR-A-Entity-0001',
    INVALID_ASEID = 'ERR-ASEID-0001',


    UNEXPECTED_ERROR = 'ERR-0001',
    METHOD_NOT_IMPLEMENTED = 'ERR-0002',
    ROUTE_NOT_FOUND = 'ERR-0003',
    TOKEN_NOT_PROVIDED = 'ERR-0004',
    NOT_ALL_PARAMS_WAS_PROVIDED = 'ERR-0005',
    CREDENTIALS_NOT_PROVIDED = 'ERR-0006',
    CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ = 'ERR-0007',
};


export const A_CONSTANTS__DEFAULT_ERRORS = {
    // Default A-Utils Errors
    INCORRECT_A_ENTITY_CONSTRUCTOR: {
        code: A_CONSTANTS__ERROR_CODES.INCORRECT_A_ENTITY_CONSTRUCTOR,
        description: 'The A_Entity constructor was called with incorrect parameters.',
        message: 'Incorrect A_Entity constructor parameters.'
    },
    INVALID_ASEID: {
        code: A_CONSTANTS__ERROR_CODES.INVALID_ASEID,
        description: 'The provided ASEID is invalid.',
        message: 'Invalid ASEID provided.'
    },


    // Default Utils Server Errors
    UNEXPECTED_ERROR: {
        serverCode: 500,
        code: A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR,
        description: 'If you see this error please let us know.',
        message: 'Oops... Something went wrong',
    },
    METHOD_NOT_IMPLEMENTED: {
        serverCode: 500,
        code: A_CONSTANTS__ERROR_CODES.METHOD_NOT_IMPLEMENTED,
        description: 'If you see this error please let us know.',
        message: 'Oops... Something went wrong',
        link: 'https://support.adaas.org/error/' + A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR
    },
    ROUTE_NOT_FOUND: {
        serverCode: 404,
        code: A_CONSTANTS__ERROR_CODES.ROUTE_NOT_FOUND,
        description: 'We can not find the route you\'re looking for. Please make sure that you\'re using the correct path.',
        message: 'The target route is not found.'
    },
    TOKEN_NOT_PROVIDED: {
        serverCode: 401,
        code: A_CONSTANTS__ERROR_CODES.TOKEN_NOT_PROVIDED,
        description: 'The token is missed in the Authorization header. Please make sure that it\'s presented.',
        message: 'Token has not found in the authorization header.'
    },
    NOT_ALL_PARAMS_WAS_PROVIDED: {
        serverCode: 409,
        code: A_CONSTANTS__ERROR_CODES.NOT_ALL_PARAMS_WAS_PROVIDED,
        description: 'Not all required params provided in the request',
        message: 'Conflict in request'
    },
    CREDENTIALS_NOT_PROVIDED: {
        code: A_CONSTANTS__ERROR_CODES.CREDENTIALS_NOT_PROVIDED,
        description: 'The credentials are missed. Please make sure that they are presented.',
        message: 'Credentials has not found in the request.'
    },
    CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ: {
        serverCode: 403,
        code: A_CONSTANTS__ERROR_CODES.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ,
        description: 'The configuration property is not exists or not allowed to read.',
        message: 'Configuration property is not exists or not allowed to read.'
    }



}