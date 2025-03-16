const { HTTP_STATUS_CODES } = require('../utils/http-status-codes');


class BaseError extends Error { 
    constructor(HTTP_STATUS_CODES, description) {
        super(description);
        this.HTTP_STATUS_CODES = HTTP_STATUS_CODES;
        this.description = description;
        this.isCustomError = true;
    }
}

class UnauthorizedAccessError extends BaseError {
    constructor(description = 'Unauthorized Access') {
        super(HTTP_STATUS_CODES.UNAUTHORIZED_ACCESS, description);
    }
}

class ValidationError extends BaseError {
    constructor(description = 'Invalid Data') {
        super(HTTP_STATUS_CODES.INVALID_DATA, description);
    }
}

class DuplicateDataError extends BaseError {
    constructor(description = 'Duplicate Data') {
        super(HTTP_STATUS_CODES.DUPLICATE_DATA, description);
    }
}

class InternalServerError extends BaseError {
    constructor(err) {
        super(HTTP_STATUS_CODES.INTERNAL_SERVER, 'Internal Server Error');
        this.isCritical = true;
        this.stack = err.stack;
    }
}

class NotFoundError extends BaseError {
    constructor(description = '404 Not Found') {
        super(HTTP_STATUS_CODES.NOT_FOUND, description);
    }
}

class BadRequestError extends BaseError {
    constructor(description = 'Bad Request') {
        super(HTTP_STATUS_CODES.BAD_REQUEST, description);
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