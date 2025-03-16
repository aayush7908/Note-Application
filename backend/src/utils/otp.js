const { OTP_LETTERS, OTP_VALID_DURATION } = require('../config/settings');


const generateOTP = (email) => {
    let otp = "";
    for (let i = 0; i < 8; i++) {
        otp += OTP_LETTERS[Math.floor(Math.random() * OTP_LETTERS.length)];
    }
    return {
        userEmail: email,
        otp: otp,
        expiresOn: Date.now() + OTP_VALID_DURATION
    };
}

module.exports = {
    generateOTP
}