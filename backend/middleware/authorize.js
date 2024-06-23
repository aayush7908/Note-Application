const Note = require('../models/Note');

const authorizeUserNote = async (req, res, next) => {
    try {
        // Fetch user-id and note-id
        const userID = req.user.id;
        const noteID = req.params.noteID;

        // Fetch note by noteID and if it doesnot exist, return error
        const note = await Note.findById(noteID);
        if (!note) {
            throw new NotFoundError('Note Not Found');
        }

        // If user in Note and user-id from token doesnot match, return error
        if (note.user.toString() !== userID) {
            throw new UnauthorizedAccessError();
        }

        req.note = note;
        next();
    } catch(error) {
        next(error);
    }
}

module.exports = {
    authorizeUserNote
};