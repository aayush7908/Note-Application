const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Note = require('../../models/Note');
const User = require('../../models/User');
const authenticate = require('../../middleware/authenticate');
const { ValidationError, BadRequestError } = require('../../utils/error-handler/error');
const { authorizeUserNote } = require('../../middleware/authorize');
const { httpStatusCode } = require('../../utils/error-handler/httpStatusCodes');
const { default: mongoose } = require('mongoose');
const defaultTag = 'general';
const maxPageSize = 10;


// ROUTE: 1 => Create Note: POST '/api/v2/note/create'
router.post('/create', authenticate, [
    body('title', 'Title must contain atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description must contain atleast 5 characters').isLength({ min: 5 }),
    body('tag', 'Tag can contain atmost 10 characters').isLength({ max: 10 })
], async (req, res, next) => {
    try {
        // If title and description arenot valid, return errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError();
        }

        // Extract user-id from user object put in request object by 'authenticate' middleware
        const userID = req.user.id;

        // Create a new note and save it
        const { title, description, tag } = req.body;
        const note = await Note.create({
            createdBy: userID,
            title: title,
            description: description,
            tag: tag || defaultTag
        })

        // Increment `totalNotes` attribute of User
        await User.findByIdAndUpdate(userID, { $inc: { totalNotes: 1 } });

        return res.status(httpStatusCode.SUCCESS).json({
            note: {
                id: note._id,
                title: note.title,
                description: note.description,
                tag: note.tag,
                lastModifiedOn: note.lastModifiedOn,
                createdBy: note.createdBy
            }
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 2 => Update Note: PUT '/api/v2/note/update/:noteID'
router.put('/update/:noteID', authenticate, authorizeUserNote, [
    body('title', 'Title must contain atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description must contain atleast 5 characters').isLength({ min: 5 }),
    body('tag', 'Tag can contain atmost 10 characters').isLength({ max: 10 })
], async (req, res, next) => {
    try {
        // Extract noteID from request params
        const noteID = req.params.noteID;

        // Extract title and description from request body
        const { title, description, tag } = req.body;

        // Update the values in note object
        const note = await Note.findByIdAndUpdate(noteID, {
            title: title,
            description: description,
            tag: tag || defaultTag,
            lastModifiedOn: Date.now()
        }, {
            new: true
        });

        return res.status(httpStatusCode.SUCCESS).json({
            note: {
                id: note._id,
                title: note.title,
                description: note.description,
                tag: note.tag,
                lastModifiedOn: note.lastModifiedOn,
                createdBy: note.createdBy
            }
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 3 => Delete Note: DELETE '/api/v2/note/delete/:noteID'
router.delete('/delete/:noteID', authenticate, authorizeUserNote, async (req, res, next) => {
    try {
        const userID = req.user.id;
        const noteID = req.params.noteID;

        // Delete the note using noteID
        await Note.findByIdAndDelete(noteID);

        // Decrement `totalNotes` attribute of User
        await User.findByIdAndUpdate(userID, { $inc: { totalNotes: -1 } });

        return res.status(httpStatusCode.SUCCESS).json({
            isNoteDeleted: true
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 4 => Get a particular Note: GET '/api/v2/note/get/one/:noteID'
router.get('/get/one/:noteID', authenticate, authorizeUserNote, async (req, res, next) => {
    try {
        // Extract noteID from request params
        const noteID = req.params.noteID;

        // Fetch Note from database
        const note = await Note.findById(noteID);

        return res.status(httpStatusCode.SUCCESS).json({
            note: {
                id: note._id,
                title: note.title,
                description: note.description,
                tag: note.tag,
                lastModifiedOn: note.lastModifiedOn,
                createdBy: note.createdBy
            }
        });

    } catch (error) {
        next(error);
    }
});


// ROUTE: 5 => Get All Notes with Search Query: GET '/api/v2/note/get/all'
router.get('/get/all', authenticate, async (req, res, next) => {
    try {
        // Get authenticated user
        const userID = req.user._id;

        // Extract searchKeyword, pageNumber and pageSize from request query
        const searchKeyword = req.query.searchKeyword || '';
        const pageNumber = Number(req.query.pageNumber) || 0;
        const pageSize = Number(req.query.pageSize) || maxPageSize;

        // Validate pageNumber
        if (pageNumber < 0) {
            throw new BadRequestError('Invalid Page Number');
        }

        // Validate pageSize
        if (pageSize <= 0 || pageSize > maxPageSize) {
            throw new BadRequestError('Invalid Page Size');
        }

        // Fetch notes created by the authenticated user
        const notes = await Note.aggregate([
            {
                $match: {
                    $or: [
                        {
                            title: {
                                $regex: searchKeyword,
                                $options: 'i'
                            }
                        }, {
                            description: {
                                $regex: searchKeyword,
                                $options: 'i'
                            }
                        }, {
                            tag: {
                                $regex: searchKeyword,
                                $options: 'i'
                            }
                        }
                    ],
                    createdBy: userID
                }
            }, {
                $project: {
                    _id: 1,
                    title: {
                        $substr: ['$title', 0, 20]
                    },
                    description: {
                        $substr: ['$description', 0, 100]
                    },
                    tag: 1,
                    lastModifiedOn: 1,
                    createdBy: 1
                }
            }, {
                $skip: pageNumber * pageSize
            }, {
                $limit: pageSize
            }
        ]);

        return res.status(httpStatusCode.SUCCESS).json({
            notes: notes
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;