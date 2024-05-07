import { error } from "../error-handler/error";

const getAllNotesAPI = async (currentPage, pageSize, searchText) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/get-all-notes?page=${currentPage + 1}&pageSize=${pageSize}&search=${searchText}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            }
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

const addNoteAPI = async (newNote) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/create-note`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            },
            body: JSON.stringify(newNote)
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

const editNoteAPI = async (noteID, updatedNote) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/update-note/${noteID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            },
            body: JSON.stringify(updatedNote)
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

const deleteNoteAPI = async (noteID) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/delete-note/${noteID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            }
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

const modifyForSearchAPI = async (pageSize, search) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/notes/get-all-notes?page=1&pageSize=${pageSize}&search=${search}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            }
        });
        response = await response.json();
    } catch(err) {
        response = error(err);
    }
    return response;
}

export {
    getAllNotesAPI,
    addNoteAPI,
    editNoteAPI, 
    deleteNoteAPI, 
    modifyForSearchAPI
};