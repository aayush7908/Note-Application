const VALID_OTP_DURATION = 1000 * 60 * 10;  // 10 mins
const letters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateOTP = (email) => {
    let otp = "";
    for (let i = 0; i < 8; i++) {
        otp += letters[Math.floor(Math.random() * letters.length)];
    }
    return {
        userEmail: email,
        otp: otp,
        expiresOn: Date.now() + VALID_OTP_DURATION
    };
}

module.exports = {
    generateOTP
}