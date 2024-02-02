const { request } = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


// This middleware will be attached to every request, which requires a user authentication
// This middleware decrypts the jwt-token, extracts payload from the token and attaches the payload data to request object
// So, any other middleware/end-point called after this middleware will be able to get user-id from request object
// If request header doesnot contain any token, the access is denied

const fetchuser = (req, res, next) => {
    // Fetch token from the request header and if it doesnot exist deny the access
    const token = req.header('authToken');
    if (!token) {
        return res.json({ success: false, status: 401, errors: ['Unauthorized access'] });
    }
    
    try {
        // Extract payload from the token and attach user object to request
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload.user;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, status: 401, errors: ['Unauthorized access'] });
    }
};

module.exports = fetchuser;