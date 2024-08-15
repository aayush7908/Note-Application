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
const { sendMail } = require('../../utils/emailjs/sendMail');
const JWT_SECRET = process.env.JWT_SECRET;
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
        User.create({
            name: name,
            email: email,
            password: hash
        })
            .then((user) => {
                // Generate a token by attaching a payload object which contains _id of the user
                const payload = {
                    user: {
                        id: user.id
                    }
                };
                const token = jwt.sign(payload, JWT_SECRET);
                res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, authToken: token });
            })
        // .catch((error) => {
        //     throw new InternalServerError();
        // });
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

        // Generate a token by attaching a payload which contains _id of the user
        const payload = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(payload, JWT_SECRET);
        res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, authToken: token });
    } catch (error) {
        next(error);
    }
});


// ROUTE: 3 => Fetch details of a logged in user by his/her authToken using: POST '/api/auth/get-user'
router.get('/get-user', authenticate, async (req, res, next) => {
    try {
        // Fetch the user id from the user object attached to request object by the 'fetchser' middleware
        const userID = req.user.id;

        // Find the user using id
        const user = await User.findById(userID).select("-password -_id -__v");

        if (!user) {
            throw new NotFoundError('User Not Found');
        }

        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, user: user });
    } catch (error) {
        next(error);
    }
});

// ROUTE: 4 => Authenticate user by his/her authToken using: POST '/api/auth/get-user'
router.get('/authenticate-user', authenticate, async (req, res, next) => {
    try {
        // Fetch the user id from the user object attached to request object by the 'fetchser' middleware
        const userID = req.user.id;

        // Find the user using id
        const user = await User.findById(userID).select("-password -_id -__v");

        if (!user) {
            throw new NotFoundError('User Not Found');
        }

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
        const user = await User.find({ email: email });
        if (user.length === 0) {
            throw new NotFoundError('User Not Found');
        }

        // Create an OTP and store it in database
        const otpId = await OTP.exists({ userEmail: email });
        const newOtp = {
            userEmail: email,
            otp: generateOTP(),
            expiresOn: new Date(Date.now() + validationTimeLimit)
        };
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
router.post('/verify-otp', [body('email', 'Enter a valid email address').isEmail(), body('otp', 'Enter a valid otp').isNumeric()], async (req, res, next) => {
    try {
        // Throw error if data is not valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.errors[0].msg);
        }

        // Find OTP corresponding to given inputs and check if it is valid
        const email = req.body.email;
        const otp = await OTP.find({ otp: req.body.otp, userEmail: email });
        if (otp.length === 0) {
            throw new ValidationError("Invalid OTP");
        }
        if ((new Date()) >= otp[0].expiresOn) {
            await OTP.findByIdAndDelete(otp[0]._id);
            throw new ValidationError("OTP Expired");
        }

        // Generate a password reset token and store it in database
        const tokenId = await PasswordResetToken.exists({ userEmail: email });
        const newToken = {
            userEmail: email,
            token: generateToken(),
            expiresOn: new Date(Date.now() + validationTimeLimit)
        };
        if (tokenId) {
            await PasswordResetToken.findByIdAndUpdate(tokenId, newToken);
        } else {
            await PasswordResetToken.create(newToken);
        }

        // Delete the validated OTP
        await OTP.findByIdAndDelete(otp[0]._id);

        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, token: newToken.token });
    } catch (error) {
        next(error);
    }
});

// ROUTE: 7 => Reset Password: POST '/api/auth/reset-password'
router.post('/reset-password', [body('email', 'Enter a valid email address').isEmail(), body('password', 'Enter a valid password').isStrongPassword()], async (req, res, next) => {
    try {
        // Throw error if data is not valid
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.errors[0].msg);
        }

        // Extract token from request header
        const reqToken = req.header('passwordResetToken');
        if (reqToken === "undefined") {
            throw new UnauthorizedAccessError();
        }

        // Check if token is valid
        const email = req.body.email;
        const token = await PasswordResetToken.find({ token: reqToken, userEmail: email });
        if (token.length === 0) {
            throw new UnauthorizedAccessError();
        }
        if ((new Date()) >= token[0].expiresOn) {
            await PasswordResetToken.findByIdAndDelete(token[0]._id);
            throw new UnauthorizedAccessError();
        }

        // Generate hash for password and store it in database
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        await User.findOneAndUpdate({ email: email }, { password: hash });

        // Delete validated token
        await PasswordResetToken.findByIdAndDelete(token[0]._id);

        // Send confirmation mail to user
        await sendMail("Password Changed", `Your password is changed successfully.</b>`, email);

        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS });
    } catch (error) {
        next(error);
    }
});

module.exports = router;