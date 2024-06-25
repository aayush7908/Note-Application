const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const authenticate = require('../../middleware/authenticate');
const { UnauthorizedAccessError, DuplicateDataError, ValidationError, NotFoundError } = require('../../utils/error-handler/error');
const { httpStatusCode } = require('../../utils/error-handler/httpStatusCodes');
const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE: 1 => Register a new User using: POST '/api/auth/signup'.
router.post('/signup', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Password must contain atleast 8 characters').isLength({ min: 8 })
], async (req, res, next) => {
    try {
        // If name, email or password are not valid return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError();
        }

        // If email address already exists, return error
        const { name, email, password } = req.body;
        const isRegistered = await User.exists({ email: email });
        if (isRegistered) {
            throw new DuplicateDataError();
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
    body('password', 'Password cannot be blank').exists()
], async (req, res, next) => {
    try {
        // If email address is not valid, return error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError();
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

module.exports = router;