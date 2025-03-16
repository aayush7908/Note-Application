const mongoose = require('mongoose');


const noteSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: 'general'
    },
    lastModifiedOn: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('note', noteSchema);

module.exports = Note;