const { Router } = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const Note = require('../models/note');
const authenticate = require('../middlewares/authenticate');
const { authorizeAdmin } = require('../middlewares/authorize');
const { HTTP_STATUS_CODES } = require('../utils/http-status-codes');
const { generateUserDto } = require('../utils/dto');


const router = Router();

// ROUTE: 1 => Get All Users: GET '/api/admin/user/get/all'
router.get('/user/get/all', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        // Fetch all users from database
        const users = await User.find({
            email: { $ne: req.user.email }
        }, {
            id: 1,
            email: 1,
            name: 1,
            accountCreatedOn: 1
        }).sort({ accountCreatedOn: -1 });

        // Make userDtos out of users
        const userDtos = users.map((user) => {
            return (
                generateUserDto(user)
            )
        });

        return res.status(HTTP_STATUS_CODES.SUCCESS).json({
            users: userDtos
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 2 => Update User Name: PATCH '/api/admin/user/update/name/:userID'
router.patch('/user/update/name/:userID',
    authenticate,
    authorizeAdmin,
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    async (req, res, next) => {
        try {
            // Extract userID from request param
            const userID = req.params.userID;

            // Fetch user from database
            const user = await User.findByIdAndUpdate(userID, {
                name: req.body.name
            }, {
                new: true
            });

            return res.status(HTTP_STATUS_CODES.SUCCESS).json({
                user: user
            });

        } catch (error) {
            next(error);
        }
    });


// ROUTE: 3 => Delete a User: DELETE '/api/user/delete/:userID'
router.delete('/user/delete/:userID', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        // Extract userID from request params
        const userID = req.params.userID;

        // Delete User from database
        await User.findByIdAndDelete(userID);

        // Delete all Notes created by the User
        await Note.deleteMany({ createdBy: userID });

        return res.status(HTTP_STATUS_CODES.SUCCESS).json({
            isUserDeleted: true
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;