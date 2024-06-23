const { sendMail } = require('../utils/emailjs/sendMail');
const { InternalServerError } = require('../utils/error-handler/error');

const centralizedErrorHandler = async (err, req, res, next) => {
    if(!err.isCustomError) {
        err = new InternalServerError(err);
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
    if (err.isCritical) {
        await sendMail(err.description, err.stack);
    }
}

module.exports = {
    centralizedErrorHandler
};