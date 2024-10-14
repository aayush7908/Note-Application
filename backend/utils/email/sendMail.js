const nodemailer = require('nodemailer');


const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_SENDER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


const sendMail = async (to, subject, html) => {
    try {
        await transport.sendMail({
            to: to,
            subject: subject,
            html: html,
        });
    } catch (error) {
        console.log("Could not send mail:", error);
    }
}


const sendErrorMail = async (title, msg) => {
    await sendMail(
        process.env.GMAIL_RECEIVER,
        `${title}: iNotebook`,
        `<b>ERROR: ${title}</b><p>${msg}<p>`
    );
}


const sendPasswordResetOtpMail = async (receiver, otp) => {
    await sendMail(
        receiver,
        'Forgot Password: iNotebook',
        `A request for password reset is received from your <b>iNotebook</b> account.<br />Enter the following OTP to proceed: <b>${otp}</b>`
    );
}


const sendConfirmationMail = async (receiver, title, msg) => {
    await sendMail(
        receiver,
        `${title}: iNotebook`,
        `This is a confirmation mail from iNotebook.<br />${msg}`
    );
}


const sendWelcomeMail = async (receiver) => {
    await sendMail(
        receiver,
        'Welcome: iNotebook',
        'Welcome to <b>iNotebook</b> !!!<br />This is to confirm that your account has been created successfully.'
    );
}


module.exports = {
    sendMail,
    sendErrorMail,
    sendPasswordResetOtpMail,
    sendConfirmationMail,
    sendWelcomeMail
};