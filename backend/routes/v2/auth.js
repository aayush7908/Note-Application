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
const { sendMail } = require('../../utils/emailjs/sendMail');
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


module.exports = router;