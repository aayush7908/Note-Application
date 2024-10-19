const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const Note = require('../../models/Note');
const authenticate = require('../../middleware/authenticate');
const {
    UnauthorizedAccessError,
    ValidationError
} = require('../../utils/error-handler/error');
const { httpStatusCode } = require('../../utils/error-handler/httpStatusCodes');
const { generateUserDto } = require('../../utils/helper/lib');


// ROUTE: 1 => Authenticate user by JWT Token: GET '/api/v2/user/authenticate'
router.get('/authenticate', authenticate, async (req, res, next) => {
    try {
        // Authentication middleware will deal with authentication
        return res.status(httpStatusCode.SUCCESS).json({
            user: generateUserDto(req.user)
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 2 => Get user data: GET '/api/v2/user/get'
router.get('/get', authenticate, async (req, res, next) => {
    try {
        // Extract UserID
        const userID = req.user.id;

        // Fetch count of total notes created by user
        const totalNotes = await Note.countDocuments({ createdBy: userID });
        req.user.totalNotes = totalNotes;

        return res.status(httpStatusCode.SUCCESS).json({
            user: generateUserDto(req.user)
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 3 => Update Name: PATCH '/api/v2/user/update/name'
router.patch('/update/name',
    authenticate,
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    async (req, res, next) => {
        try {
            // Fetch user from request object
            const userID = req.user.id;

            // Update user in database
            const user = await User.findByIdAndUpdate(userID, { name: req.body.name });

            return res.status(httpStatusCode.SUCCESS).json({
                user: generateUserDto(user)
            });

        } catch (error) {
            next(error);
        }
    });


// ROUTE: 4 => Delete User: POST '/api/v2/user/delete'
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