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

const sendMail = async (title, msg) => {
    transport.sendMail({
        to: process.env.GMAIL_RECEIVER,
        subject: 'iNotebook',
        html: `<b>ERROR: ${title}</b><p>${msg}<p>`,
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






// const emailjs = require('@emailjs/nodejs');
// const sendMail = async (title, msg) => {
//     emailjs
//         .send(
//             process.env.EMAILJS_SERVICE_ID,
//             process.env.EMAILJS_TEMPLATE_ID, {
//             title: title,
//             message: msg
//         }, {
//             publicKey: process.env.EMAILJS_PUBLIC_KEY
//         })
//         .then(() => {
//             console.log("E-Mail Sent to Developer");
//         })
//         .catch((error) => {
//             console.log("Could not send mail:", error);
//         });
// }