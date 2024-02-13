import React, { useState } from "react";
import NoteContext from "./noteContext";

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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/get-all-notes?page=${currentPage + 1}&pageSize=${pageSize}&search=${searchText}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            }
        });

        // Convert response into json data
        const data = await response.json();

        // Check the response from server and do the following:
        // If success === true, set the state of notes to the notes array of response
        // Else show error
        if (data.success) {
            setNotes(notes.concat(data.notes));
            if(currentPage === 0) setTotalNotes(data.totalNotes);
            setCurrentPage(currentPage + 1);
        } else {
            console.log("Error: ", data.errors);
        }
        setTimeout(() => { setFetchingNotes(false); }, 2000);
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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/create-note`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            },
            body: JSON.stringify(newNote)
        });

        // Convert response into json data
        const data = await response.json();

        // Check the response
        if (data.success) {
            setNotes(notes.concat(data.note));
            setTotalNotes(totalNotes + 1);
        } else {
            console.log("Error: ", data.errors);
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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/update-note/${noteID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            },
            body: JSON.stringify(updatedNote)
        });

        // Convert response into json data
        const data = await response.json();

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
        } else {
            console.log("Error: ", data.errors);
        }

        return {
            success: data.success,
            errors: data.errors
        };
    };

    // Delete a note
    const deleteNote = async (noteID) => {
        // API Call
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/delete-note/${noteID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            }
        });

        // Convert response into json data
        const data = await response.json();

        // Check the response
        if (data.success) {
            const notesAfterDelete = notes.filter((element) => {
                return (element._id !== noteID);
            });
            setNotes(notesAfterDelete);
            setTotalNotes(totalNotes - 1);
        } else {
            console.log("Error: ", data.errors);
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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/get-all-notes?page=1&pageSize=${pageSize}&search=${search}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            }
        });

        // Convert response into json data
        const data = await response.json();

        // Check the response from server and do the following:
        // If success === true, set the state of notes to the notes array of response
        // Else show error
        if (data.success) {
            setNotes(data.notes);
            setTotalNotes(data.totalNotes);
        } else {
            console.log("Error: ", data.errors);
        }
        setTimeout(() => { setFetchingNotes(false); }, 2000);

        return { errors: data.errors };
    };

    return (
        <NoteContext.Provider value={{ fetchingNotes, totalNotes, notes, setNotes, getAllNotes, addNote, deleteNote, editNote, modifyForSearch }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;