const { sendErrorMail } = require('../utils/email/sendMail');
const {
    InternalServerError,
    UnauthorizedAccessError,
    BadRequestError
} = require('../utils/error-handler/error');

const centralizedErrorHandler = async (err, req, res, next) => {
    if (!err.isCustomError) {
        switch (err.name) {
            case 'JsonWebTokenError':
                err = new UnauthorizedAccessError();
                break;
            case 'CastError':
                err = new BadRequestError();
                break;
            default:
                console.log('Critical Error => ', err);
                err = new InternalServerError(err);
        }
    }

    sendMailIfCritical(err);

    return res.status(err.httpStatusCode).json({
        errors: [err.description]
    });
};

const sendMailIfCritical = async (err) => {
    if (err.isCritical) {
        await sendErrorMail(err.description, err.stack);
    }
}

module.exports = {
    centralizedErrorHandler
};