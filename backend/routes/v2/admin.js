const router = require('express').Router();
const { body } = require('express-validator');
const User = require('../../models/User');
const authenticate = require('../../middleware/authenticate');
const { authorizeAdmin } = require('../../middleware/authorize');
const { httpStatusCode } = require('../../utils/error-handler/httpStatusCodes');
const { generateUserDto } = require('../../utils/helper/lib');
const Note = require('../../models/Note');


// ROUTE: 1 => Get All Users: GET '/api/v2/admin/user/get/all'
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

        return res.status(httpStatusCode.SUCCESS).json({
            users: userDtos
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 2 => Update User Name: PATCH '/api/v2/admin/user/update/name/:userID'
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

            return res.status(httpStatusCode.SUCCESS).json({
                user: user
            });

        } catch (error) {
            next(error);
        }
    });


// ROUTE: 3 => Delete a User: DELETE '/api/v2/user/delete/:userID'
router.delete('/user/delete/:userID', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        // Extract userID from request params
        const userID = req.params.userID;

        // Delete User from database
        await User.findByIdAndDelete(userID);

        // Delete all Notes created by the User
        await Note.deleteMany({ createdBy: userID });

        return res.status(httpStatusCode.SUCCESS).json({
            isUserDeleted: true
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;