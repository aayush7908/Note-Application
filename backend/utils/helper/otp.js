const VALID_OTP_DURATION = 1000 * 60 * 10;  // 10 mins

const generateOTP = (email) => {
    const otp = "123456";
    return {
        userEmail: email,
        otp: otp,
        expiresOn: new Date(Date.now() + VALID_OTP_DURATION)
    };
}

module.exports = {
    generateOTP
}