const { v4 } = require('uuid');
const VALID_PWD_RESET_TOKEN_DURATION = 1000 * 60 * 10;  // 10 mins

const generateToken = (email) => {
    const token = v4();
    return {
        userEmail: email,
        token: token,
        expiresOn: Date.now() + VALID_PWD_RESET_TOKEN_DURATION
    };
}

module.exports = {
    generateToken
}