const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const VALID_TOKEN_DURATION = 1000 * 60 * 60 * 24 * 7;   // 1 week

const generateJWT = (userID) => {
    const payload = {
        user: {
            id: userID
        },
        expiresAt: new Date(Date.now() + VALID_TOKEN_DURATION)
    }
    return jwt.sign(payload, JWT_SECRET);
};

module.exports = {
    generateJWT
};