const mongoose = require('mongoose');


const otpSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresOn: {
        type: Date,
        required: true
    }
});

const OTP = mongoose.model('otp', otpSchema);

module.exports = OTP;