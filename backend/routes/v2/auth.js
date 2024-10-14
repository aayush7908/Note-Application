const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const OTP = require('../../models/OTP');
const PasswordResetToken = require('../../models/PasswordResetToken');
const authenticate = require('../../middleware/authenticate');
const {
    UnauthorizedAccessError,
    DuplicateDataError,
    ValidationError,
    NotFoundError
} = require('../../utils/error-handler/error');
const { httpStatusCode } = require('../../utils/error-handler/httpStatusCodes');
const { generateOTP } = require('../../utils/helper/otp');
const { generateToken } = require('../../utils/helper/token');
const { generateJWT } = require('../../utils/helper/jwt');
const { sendMail, sendPasswordResetOtpMail, sendConfirmationMail, sendWelcomeMail } = require('../../utils/email/sendMail');
const validationTimeLimit = 1000 * 60 * 10; // 10 mins


// ROUTE: 1 => Register a new User: POST '/api/v2/auth/register'.
router.post('/register', [
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

        // Send Mail
        sendWelcomeMail(user.email);

        res.status(httpStatusCode.SUCCESS).json({
            authToken: token
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 2 => Authenticate a User with Email & Password: POST '/api/v2/auth/login'.
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
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new UnauthorizedAccessError('Please try to login with correct credentials');
        }

        // Generate JWT token
        const token = generateJWT(user.id);

        res.status(httpStatusCode.SUCCESS).json({
            authToken: token
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 3 => Send Forgot Password OTP: POST '/api/v2/auth/forgot-password/otp/send'
router.post('/forgot-password/otp/send',
    body('email', 'Enter a valid email address').isEmail(),
    async (req, res, next) => {
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
            await OTP.deleteOne({ userEmail: email });
            const { otp } = await OTP.create(newOtp);

            // Send email containing OTP to user
            sendPasswordResetOtpMail(
                email,
                otp
            );

            return res.status(httpStatusCode.SUCCESS).json({
                isOtpSent: true
            });

        } catch (error) {
            next(error);
        }
    });


// ROUTE: 4 => Verify Forgot Password OTP: POST '/api/v2/auth/forgot-password/otp/verify'
router.post('/forgot-password/otp/verify', [
    body('email', 'Enter a valid email address').isEmail(),
    body('otp', 'Enter a valid otp').isAlphanumeric()
], async (req, res, next) => {
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
        if (Date.now() >= otp.expiresOn) {
            await OTP.findByIdAndDelete(otp.id);
            throw new ValidationError("OTP Expired");
        }

        // Generate a password reset token and store it in database
        const newToken = generateToken(email);
        await PasswordResetToken.deleteOne({ userEmail: email });
        const { token } = await PasswordResetToken.create(newToken);

        // Delete the validated OTP
        await OTP.findByIdAndDelete(otp.id);

        return res.status(httpStatusCode.SUCCESS).json({
            token: token
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 5 => Reset Password: POST '/api/v2/auth/forgot-password/reset-password'
router.post('/forgot-password/reset-password', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isStrongPassword()
], async (req, res, next) => {
    try {
        // Throw error if data is not valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.errors[0].msg);
        }

        // Fetch token from the request header and if it doesnot exist deny the access
        const passwordResetToken = req.header('Authorization');
        if (!passwordResetToken) {
            throw new UnauthorizedAccessError();
        }

        // Check if token is valid
        const email = req.body.email;
        const token = await PasswordResetToken.findOne({ token: passwordResetToken, userEmail: email });
        if (token === null) {
            throw new UnauthorizedAccessError();
        }

        // Check token expiry
        if (Date.now() >= token.expiresOn) {
            await PasswordResetToken.findByIdAndDelete(token.id);
            throw new UnauthorizedAccessError();
        }

        // Generate hash for password and store it in database
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        await User.findOneAndUpdate({ email: email }, { password: hash });

        // Delete validated token
        await PasswordResetToken.findByIdAndDelete(token.id);

        // Send confirmation mail to user
        sendConfirmationMail(
            email,
            'Password Changed',
            `Password for your <b>iNotebook</b> has been changed successfully. Login again to continue using your account.`,
        );

        return res.status(httpStatusCode.SUCCESS).json({
            isPasswordReset: true
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;