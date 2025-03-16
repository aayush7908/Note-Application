const { v4 } = require('uuid');

const { PASSWORD_RESET_TOKEN_VALID_DURATION } = require('../config/settings');


const generateToken = (email) => {
    const token = v4();
    return {
        userEmail: email,
        token: token,
        expiresOn: Date.now() + PASSWORD_RESET_TOKEN_VALID_DURATION
    };
}

module.exports = {
    generateToken
}