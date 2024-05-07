import React, { useState } from "react";
import NoteContext from "./noteContext";
import { addNoteAPI, deleteNoteAPI, editNoteAPI, getAllNotesAPI, modifyForSearchAPI } from "../../utils/api-calls/notes";

const NoteState = (props) => {
    const pageSize = 12;
    const [notes, setNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalNotes, setTotalNotes] = useState(0);
    const [fetchingNotes, setFetchingNotes] = useState(true);
    const [searchText, setSearchText] = useState("");

    // Fetch all the notes
    const getAllNotes = async () => {
        // API call
        const data = await getAllNotesAPI(currentPage, pageSize, searchText);

        // Check the response from server and do the following:
        // If success === true, set the state of notes to the notes array of response
        // Else show error
        if (data.success) {
            setNotes(notes.concat(data.notes));
            if(currentPage === 0) setTotalNotes(data.totalNotes);
            setCurrentPage(currentPage + 1);
        }
        setFetchingNotes(false);
    };

    // Add a new note
    const addNote = async (title, description, tag) => {
        // Creating an object
        const newNote = {
            title: title,
            description: description,
            tag: tag
        }

        // API Call
        const data = await addNoteAPI(newNote);

        // Check the response
        if (data.success) {
            setNotes(notes.concat(data.note));
            setTotalNotes(totalNotes + 1);
        }

        return {
            success: data.success,
            errors: data.errors
        };
    };

    // Edit a note
    const editNote = async (noteID, title, description, tag) => {
        // Creating an object
        const updatedNote = {
            title: title,
            description: description,
            tag: tag
        }

        // API Call
        const data = await editNoteAPI(noteID, updatedNote);

        // Check the response
        if (data.success) {
            const notesAfterEdit = JSON.parse(JSON.stringify(notes));
            for (let i = 0; i < notesAfterEdit.length; i++) {
                if (notesAfterEdit[i]._id === noteID) {
                    notesAfterEdit[i] = data.note;
                    break;
                }
            }
            setNotes(notesAfterEdit);
        }

        return {
            success: data.success,
            errors: data.errors
        };
    };

    // Delete a note
    const deleteNote = async (noteID) => {
        // API Call
        const data = await deleteNoteAPI(noteID);

        // Check the response
        if (data.success) {
            const notesAfterDelete = notes.filter((element) => {
                return (element._id !== noteID);
            });
            setNotes(notesAfterDelete);
            setTotalNotes(totalNotes - 1);
        }

        return {
            success: data.success,
            errors: data.errors
        };
    };

    // Search Notes
    const modifyForSearch = async (search) => {
        setNotes([]);
        setCurrentPage(1);
        setTotalNotes(0);
        setSearchText(search);
        setFetchingNotes(true);

        // API call
        const data = await modifyForSearchAPI(pageSize, search);

        // Check the response from server and do the following:
        // If success === true, set the state of notes to the notes array of response
        // Else show error
        if (data.success) {
            setNotes(data.notes);
            setTotalNotes(data.totalNotes);
        }
        setFetchingNotes(false);

        return { errors: data.errors };
    };

    const resetValues = () => {
        setNotes([]);
        setCurrentPage(0);
        setTotalNotes(0);
        setSearchText("");
    }

    return (
        <NoteContext.Provider value={{ fetchingNotes, totalNotes, notes, searchText, setNotes, getAllNotes, addNote, deleteNote, editNote, modifyForSearch, resetValues }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;