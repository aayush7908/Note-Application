const { httpStatusCode } = require('./httpStatusCodes');

class BaseError extends Error { 
    constructor(httpStatusCode, description) {
        super(description);
        this.httpStatusCode = httpStatusCode;
        this.description = description;
        this.isCustomError = true;
    }
}

class UnauthorizedAccessError extends BaseError {
    constructor(description = 'Unauthorized Access') {
        super(httpStatusCode.UNAUTHORIZED_ACCESS, description);
    }
}

class ValidationError extends BaseError {
    constructor(description = 'Invalid Data Supplied') {
        super(httpStatusCode.INVALID_DATA, description);
    }
}

class DuplicateDataError extends BaseError {
    constructor(description = 'Duplicate Data Supplied') {
        super(httpStatusCode.DUPLICATE_DATA, description);
    }
}

class InternalServerError extends BaseError {
    constructor(err) {
        super(httpStatusCode.INTERNAL_SERVER, 'Internal Server Error');
        this.isCritical = true;
        this.stack = err.stack;
    }
}

class NotFoundError extends BaseError {
    constructor(description = '404 Not Found') {
        super(httpStatusCode.NOT_FOUND, description);
    }
}

class BadRequestError extends BaseError {
    constructor(description = 'Bad Request') {
        super(httpStatusCode.BAD_REQUEST, description);
    }
}

module.exports = {
    UnauthorizedAccessError, 
    ValidationError, 
    DuplicateDataError, 
    InternalServerError, 
    NotFoundError, 
    BadRequestError
};