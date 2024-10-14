const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const Note = require('../../models/Note');
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


// ROUTE: 1 => Authenticate user by JWT Token: GET '/api/v2/user/authenticate'
router.get('/authenticate', authenticate, async (req, res, next) => {
    try {
        // Authentication middleware will deal with authentication
        return res.status(httpStatusCode.SUCCESS).json({
            user: {
                name: req.user.name,
                email: req.user.email,
                totalNotes: req.user.totalNotes,
                isAdmin: req.user.isAdmin,
                accountCreatedOn: req.user.accountCreatedOn
            }
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 2 => Update Name: PATCH '/api/v2/user/update/name'
router.patch('/update/name',
    authenticate,
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    async (req, res, next) => {
        try {
            // Fetch user from request object
            const user = req.user;

            // Update name
            user.name = req.body.name;

            // Save updated user in database
            await user.save();

            return res.status(httpStatusCode.SUCCESS).json({
                user: {
                    name: user.name,
                    email: user.email,
                    totalNotes: user.totalNotes,
                    isAdmin: user.isAdmin,
                    accountCreatedOn: user.accountCreatedOn
                }
            });

        } catch (error) {
            next(error);
        }
    });


// ROUTE: 3 => Delete User: DELETE '/api/v2/user/delete'
router.delete('/delete',
    authenticate,
    body('password', 'Enter a valid password').isStrongPassword(),
    async (req, res, next) => {
        try {
            // If password is not valid, return error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.errors[0].msg);
            }

            // Extract password from request body
            const password = req.body.password;

            // Fetch user from request object
            const user = req.user;

            // Compare password entered by user with the hash value
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new UnauthorizedAccessError('Incorrect credentials');
            }

            // Delete User
            await User.findByIdAndDelete(user.id);

            // Delete all Notes created by the User
            await Note.deleteMany({ createdBy: user.id });

            return res.status(httpStatusCode.SUCCESS).json({
                isUserDeleted: true
            });

        } catch (error) {
            next(error);
        }
    });


module.exports = router;