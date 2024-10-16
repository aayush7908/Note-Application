const Note = require('../models/Note');
const User = require('../models/User');
const { UnauthorizedAccessError, NotFoundError } = require('../utils/error-handler/error');
const { sendErrorMail } = require('../utils/email/sendMail');

const authorizeUserNote = async (req, res, next) => {
    try {
        // Fetch user-id and note-id
        const userID = req.user.id;
        const noteID = req.params.noteID;

        // Fetch note by noteID and if it doesnot exist, return error
        const note = await Note.findById(noteID, { _id: 1, createdBy: 1 });
        if (!note) {
            throw new NotFoundError('Note Not Found');
        }

        // If note is not created by authenticated user, return error
        if (note.createdBy.toString() !== userID) {
            throw new UnauthorizedAccessError();
        }
        req.note = note;

        next();

    } catch (error) {
        next(error);
    }
}

const authorizeAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.isAdmin) {
            sendErrorMail(
                'Unauthorized Admin Access',
                `Someone tried to access admin panel<br /><b>Name:</b> ${user.name}<br /><b>Email:</b> ${user.email}`
            );
            throw new UnauthorizedAccessError();
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    authorizeUserNote,
    authorizeAdmin
};