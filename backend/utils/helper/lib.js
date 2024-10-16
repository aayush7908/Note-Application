const generateUserDto = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        totalNotes: user.totalNotes || 0,
        isAdmin: user.isAdmin,
        accountCreatedOn: user.accountCreatedOn
    };
}

const generateNoteDto = (note) => {
    return {
        _id: note._id,
        title: note.title,
        description: note.description,
        tag: note.tag,
        lastModifiedOn: note.lastModifiedOn,
        createdBy: note.createdBy,
        totalNotes: note.totalNotes || 0
    };
}

module.exports = {
    generateUserDto,
    generateNoteDto
}