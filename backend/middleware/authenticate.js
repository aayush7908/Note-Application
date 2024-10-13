const jwt = require('jsonwebtoken');
const { UnauthorizedAccessError } = require('../utils/error-handler/error');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;


// This middleware will be attached to every request, which requires a user authentication
// This middleware decrypts the jwt-token, extracts payload from the token and attaches the payload data to request object
// So, any other middleware/end-point called after this middleware will be able to get user-id from request object
// If request header doesnot contain any token, the access is denied

const authenticate = async (req, res, next) => {
    try {
        // Fetch token from the request header and if it doesnot exist deny the access
        const authToken = req.header('Authorization');
        if (!authToken) {
            throw new UnauthorizedAccessError();
        }

        // Extract jwtToken from authToken (Remove `Bearer `)
        const jwtToken = authToken.substring(7);

        // Extract payload from the token
        const payload = jwt.verify(jwtToken, JWT_SECRET);

        // Validate token expiry
        if ((new Date()) > (new Date(payload.expiresAt))) {
            throw new UnauthorizedAccessError();
        }

        // Check if user exists
        const user = await User.findById(payload.user.id, { password: 0, __v: 0 });
        if (user === null) {
            throw new UnauthorizedAccessError();
        }
        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;