const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = require('../../models/User');
const authenticate = require('../../middleware/authenticate');
const { authorizeAdmin } = require('../../middleware/authorize');
const { UnauthorizedAccessError, DuplicateDataError, ValidationError, NotFoundError } = require('../../utils/error-handler/error');
const { httpStatusCode } = require('../../utils/error-handler/httpStatusCodes');
const Note = require('../../models/Note');


router.get('/get-data', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const users = await User.find({ email: { $ne: req.user.email } }, { id: 1, email: 1, name: 1, totalNotes: 1, date: 1 }).sort({ date: -1 });
        const data = {
            users: users
        };
        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS, data: data });
    } catch (error) {
        next(error);
    }
});

router.delete('/remove-user/:userID', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const userID = req.params.userID;
        await User.findByIdAndDelete(userID);
        await Note.deleteMany({ user: userID });
        return res.status(httpStatusCode.SUCCESS).json({ success: true, status: httpStatusCode.SUCCESS });
    } catch (error) {
        next(error);
    }
});

module.exports = router;