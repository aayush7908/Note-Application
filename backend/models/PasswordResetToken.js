const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    expiresOn: {
        type: Date,
        required: true
    }
});

const PasswordResetToken = mongoose.model('passwordResetToken', passwordResetTokenSchema);

module.exports = PasswordResetToken;