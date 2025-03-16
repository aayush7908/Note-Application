const jwt = require('jsonwebtoken');

const { AUTH_TOKEN_VALID_DURATION, JWT_SECRET } = require('../config/settings');


const generateAuthToken = (userID) => {
    const payload = {
        user: {
            id: userID
        },
        expiresOn: Date.now() + AUTH_TOKEN_VALID_DURATION
    }
    return jwt.sign(payload, JWT_SECRET);
};

module.exports = {
    generateAuthToken
};