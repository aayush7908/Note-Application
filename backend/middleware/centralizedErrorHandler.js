const { sendMail } = require('../utils/emailjs/sendMail');
const { httpStatusCode } = require('../utils/error-handler/httpStatusCodes');
const { InternalServerError } = require('../utils/error-handler/error');

const centralizedErrorHandler = async (err, req, res, next) => {
    if(!err.isCustomError) {
        err = new InternalServerError();
    }
    console.log("Handled Error =>", err);
    await sendMailIfCritical(err);
    return res.status(err.httpStatusCode).json({
        success: false,
        status: err.httpStatusCode,
        errors: [err.description]
    });
};

const sendMailIfCritical = async (err) => {
    if (err.httpStatusCode === httpStatusCode.INTERNAL_SERVER) {
        await sendMail(err.description, err.stack);
    }
}

module.exports = {
    centralizedErrorHandler
};