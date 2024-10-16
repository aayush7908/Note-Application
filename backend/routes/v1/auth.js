const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const OTP = require('../../models/OTP');
const PasswordResetToken = require('../../models/PasswordResetToken');
const authenticate = require('../../middleware/authenticate');
const { UnauthorizedAccessError, DuplicateDataError, ValidationError, NotFoundError } = require('../../utils/error-handler/error');
const { httpStatusCode } = require('../../utils/error-handler/httpStatusCodes');
const { generateOTP } = require('../../utils/helper/otp');
const { generateToken } = require('../../utils/helper/token');
const { generateJWT } = require('../../utils/helper/jwt');
const { sendMail } = require('../../utils/email/sendMail');
const validationTimeLimit = 1000 * 60 * 10; // 10 mins

// ROUTE: 1 => Register a new User using: POST '/api/auth/signup'.
router.post('/signup', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Enter a valid password').isStrongPassword()
], async (req, res, next) => {
    try {
        // If name, email or password are not valid return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.errors[0].msg);
        }

        // If email address already exists, return error
        const { name, email, password } = req.body;
        const isRegistered = await User.exists({ email: email });
        if (isRegistered) {
            throw new DuplicateDataError("User Already Exists");
        }

        // Generate salt and hash for plain text password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Save the data
        const user = await User.create({
            name: name,
            email: email,
            password: hash
        });

        // Generate JWT Token
        const token = generateJWT(user.id);

        res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, authToken: token });
    } catch (error) {
        next(error);
    }
});


// ROUTE: 2 => Authenticate a User using: POST '/api/auth/login'.
router.post('/login', [
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Enter a valid password').isStrongPassword()
], async (req, res, next) => {
    try {
        // If email address is not valid, return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.errors[0].msg);
        }

        // Fetch the user with given email and if no data is found, return error
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new UnauthorizedAccessError('Please try to login with correct credentials');
        }

        // Compare password entered by user with the hash value
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw new UnauthorizedAccessError('Please try to login with correct credentials');
        }

        // Generate JWT token
        const token = generateJWT(user.id);

        res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, authToken: token });
    } catch (error) {
        next(error);
    }
});


// ROUTE: 3 => Fetch details of a logged in user by his/her authToken using: POST '/api/auth/get-user'
router.get('/get-user', authenticate, async (req, res, next) => {
    try {
        // Fetch user attached to `req` object in `authenticate` middleware
        const user = req.user;

        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, user: user });
    } catch (error) {
        next(error);
    }
});

// ROUTE: 4 => Authenticate user by his/her authToken using: POST '/api/auth/get-user'
router.get('/authenticate-user', authenticate, async (req, res, next) => {
    try {
        // Authentication middleware will deal with this
        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS });
    } catch (error) {
        next(error);
    }
});

// ROUTE: 5 => Send OTP to user email for verification: POST '/api/auth/send-otp'
router.post('/send-otp', body('email', 'Enter a valid email address').isEmail(), async (req, res, next) => {
    try {
        // Throw error if data is not valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.errors[0].msg);
        }

        // Find user details from provided email and check if account exists
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (user === null) {
            throw new NotFoundError('User Not Found');
        }

        // Create an OTP and store it in database
        const newOtp = generateOTP(email);
        const otpId = await OTP.exists({ userEmail: email });
        if (otpId) {
            const otp = await OTP.findByIdAndUpdate(otpId, newOtp);
        } else {
            const otp = await OTP.create(newOtp);
        }

        // Send email containing OTP to user
        await sendMail("Password Reset", `Your request for password reset is received.<br />Your OTP is: <b>${newOtp.otp}</b>`, email);

        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS });
    } catch (error) {
        next(error);
    }
});

// ROUTE: 6 => Verify OTP: POST '/api/auth/verify-otp'
router.post('/verify-otp', [body('email', 'Enter a valid email address').isEmail(), body('otp', 'Enter a valid otp').isAlphanumeric()], async (req, res, next) => {
    try {
        // Throw error if data is not valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.errors[0].msg);
        }

        // Find OTP corresponding to given inputs
        const email = req.body.email;
        const otp = await OTP.findOne({ otp: req.body.otp, userEmail: email });
        if (otp === null) {
            throw new ValidationError("Invalid OTP");
        }

        // Check if OTP is expired
        if ((new Date()) >= otp.expiresOn) {
            await OTP.findByIdAndDelete(otp._id);
            throw new ValidationError("OTP Expired");
        }

        // Generate a password reset token and store it in database
        const tokenId = await PasswordResetToken.exists({ userEmail: email });
        const newToken = generateToken(email);
        if (tokenId) {
            await PasswordResetToken.findByIdAndUpdate(tokenId, newToken);
        } else {
            await PasswordResetToken.create(newToken);
        }

        // Delete the validated OTP
        await OTP.findByIdAndDelete(otp._id);

        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, token: newToken.token });
    } catch (error) {
        next(error);
    }
});

// ROUTE: 7 => Reset Password: POST '/api/auth/reset-password'
router.post('/reset-password', body('password', 'Enter a valid password').isStrongPassword(), async (req, res, next) => {
    try {
        // Throw error if data is not valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.errors[0].msg);
        }

        // Extract token from request header
        const reqToken = req.body.token;
        if (reqToken === "undefined") {
            throw new UnauthorizedAccessError();
        }

        // Check if token is valid
        const email = req.body.email;
        const token = await PasswordResetToken.findOne({ token: reqToken, userEmail: email });
        if (token === null) {
            throw new UnauthorizedAccessError();
        }

        // Check token expiry
        if ((new Date()) >= token.expiresOn) {
            await PasswordResetToken.findByIdAndDelete(token._id);
            throw new UnauthorizedAccessError();
        }

        // Generate hash for password and store it in database
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        await User.findOneAndUpdate({ email: email }, { password: hash });

        // Delete validated token
        await PasswordResetToken.findByIdAndDelete(token._id);

        // Send confirmation mail to user
        await sendMail("Password Changed", `Your password is changed successfully.</b>`, email);

        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS });
    } catch (error) {
        next(error);
    }
});

module.exports = router;