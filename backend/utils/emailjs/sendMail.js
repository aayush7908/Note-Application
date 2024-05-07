const emailjs = require('@emailjs/nodejs');

const sendMail = async (title, msg) => {
    emailjs
        .send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID, {
            title: title,
            message: msg
        }, {
            publicKey: process.env.EMAILJS_PUBLIC_KEY
        })
        .then(() => {
            console.log("E-Mail Sent to Developer");
        })
        .catch((error) => {
            console.log("Could not send mail:", error);
        });
}

module.exports = {
    sendMail
};