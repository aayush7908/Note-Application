const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Note = require('../../models/Note');
const User = require('../../models/User');
const authenticate = require('../../middleware/authenticate');
const { ValidationError, BadRequestError } = require('../../utils/error-handler/error');
const { authorizeUserNote } = require('../../middleware/authorize');
const defaultTag = "general";
const defaultPageSize = 12;

// ROUTE: 1 => Get all the notes created by an authenticated user using: GET '/api/notes/get-all-notes'
router.get('/get-all-notes', authenticate, async (req, res, next) => {
    try {
        // Fetch user-id from user object put in request object by 'authenticate' middleware
        const userID = req.user.id;

        // Fetch page and pageSize from query, and a logic to determine their combinations
        let page = req.query.page;
        let pageSize = req.query.pageSize;
        let search = req.query.search;
        if (page <= 0 || pageSize <= 0 || pageSize > 20) {
            throw new BadRequestError();
        }
        if (!page) {
            page = 1;
            if (!pageSize) pageSize = 0;
        } else {
            if (!pageSize) pageSize = defaultPageSize;
        }

        // Fetch all notes corresponding to that userID
        let notes = [];
        let totalNotesExist = -1;
        if (search) {
            notes = await Note.find({ user: userID, $or: [{ title: { $regex: search, "$options": "i" } }, { description: { $regex: search, "$options": "i" } }, { tag: { $regex: search, "$options": "i" } }] })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .select("-user -__v");
            if (page == 1) {
                totalNotesExist = await Note.countDocuments({ user: userID, description: search });
            }
        } else {
            notes = await Note.find({ user: userID })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .select("-user -__v");
            // Fetch total number of notes that user has created
            if (page == 1) {
                const { totalNotes } = await User.findById(userID)
                    .select("-_id totalNotes");
                totalNotesExist = totalNotes;
            }
        }


        return res.json({ success: true, status: 200, totalNotes: totalNotesExist, notes: notes });
    } catch (error) {
        next(error);
    }
});


// ROUTE: 2 => Save a note created by an authenticated user using: POST '/api/notes/create-note'
router.post('/create-note',
    authenticate, [
    body('title', 'Title must contain atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description must contain atleast 5 characters').isLength({ min: 5 }),
    body('tag', 'Tag can contain atmost 10 characters').isLength({ max: 10 })
],
    (req, res, next) => {
        try {
            // If title and description arenot valid, return errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError();
            }

            // Fetch user-id from user object put in request object by 'authenticate' middleware
            const userID = req.user.id;

            // Create a new note and save it
            const { title, description, tag } = req.body;
            Note.create({
                user: userID,
                title: title,
                description: description,
                tag: tag || defaultTag
            })
                .then(async (note) => {
                    await User.findByIdAndUpdate(userID, { $inc: { totalNotes: 1 } });
                    return res.json({ success: true, status: 200, msg: 'Note saved successfully', note: note });
                })
        } catch (error) {
            next(error);
        }
    });


// ROUTE: 3 => Update an existing note using: PATCH '/api/notes/update-note'
router.patch('/update-note/:noteID', authenticate, authorizeUserNote, async (req, res, next) => {
    try {
        // Fetch title and description from request body
        const { title, description, tag } = req.body;
        const note = req.note;

        // Update the values in note object fetched earlier
        note.title = title || note.title;
        note.description = description || note.description;
        note.tag = tag || defaultTag;
        note.date = Date.now();

        // Save the updated data of Note
        await note.save();
        return res.json({ success: true, status: 200, msg: 'Note updated successfully', note: note });
    } catch (error) {
        next(error);
    }
});


// ROUTE: 4 => Delete an existing note using: DELETE '/api/notes/delete-note'
router.delete('/delete-note/:noteID', authenticate, authorizeUserNote, async (req, res, next) => {
    try {
        const userID = req.user.id;
        const noteID = req.note.id;
        // Delete the note using noteID
        Note.findByIdAndDelete(noteID)
            .then(async () => {
                await User.findByIdAndUpdate(userID, { $inc: { totalNotes: -1 } });
            });
        return res.json({ success: true, status: 200, msg: 'Note deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;