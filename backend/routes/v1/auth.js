const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const fetchuser = require('../../middleware/fetchuser');
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
            return res.json({ success: false, status: 400, errors: errors });
        }

        // If email address already exists, return error
        const { name, email, password } = req.body;
        const isRegistered = await User.exists({ email: email });
        if (isRegistered) {
            return res.json({ success: false, status: 409, errors: ['Email address is already registered'] });
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
                res.json({ success: true, status: 200, authToken: token });
            })
            .catch((error) => {
                console.log(error);
                return res.json({ success: false, status: 400, errors: [error] });
            });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, status: 500, errors: ['Internal Server Error'] });
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
        if(!errors.isEmpty()) {
            return res.json({ success: false, status: 400, errors: [errors] });
        }

        // Fetch the user with given email and if no data is found, return error
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.json({ success: false, status: 400, errors: ['Please try to login with correct credentials'] });
        }

        // Compare password entered by user with the hash value
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            return res.json({ success: false, status: 400, errors: ['Please try to login with correct credentials'] });
        }

        // Generate a token by attaching a payload which contains _id of the user
        const payload = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(payload, JWT_SECRET);
        res.json({ success: true, status: 200, authToken: token });
    } catch(error) {
        console.log(error);
        return res.json({ success: false, status: 500, errors: ['Internal Server Error'] });
    }
});


// ROUTE: 3 => Fetch details of a logged in user by his/her authToken using: POST '/api/auth/get-user'
router.get('/get-user', fetchuser, async (req, res, next) => {
    try {
        // Fetch the user id from the user object attached to request object by the 'fetchser' middleware
        const userID = req.user.id;

        // Find the user using id
        const user = await User.findById(userID).select("-password -_id -__v");
        return res.json({ success: true, status: 200, user: user });
    } catch(error) {
        console.log(error);
        return res.json({ success: false, status: 500, errors: ['Internal Server Error'] });
    }
});

// ROUTE: 4 => Authenticate user by his/her authToken using: POST '/api/auth/get-user'
router.get('/authenticate-user', fetchuser, async (req, res, next) => {
    try {
        // Fetch the user id from the user object attached to request object by the 'fetchser' middleware
        const userID = req.user.id;

        // Find the user using id
        const user = await User.findById(userID).select("-password -_id -__v");
        return res.json({ success: true, status: 200 });
    } catch(error) {
        console.log(error);
        return res.json({ success: false, status: 500, errors: ['Internal Server Error'] });
    }
});

module.exports = router;