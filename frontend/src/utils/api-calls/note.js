import { getToken } from "../cookie/cookie-utils";

const pageSize = 12;


export const createNoteAPI = async (body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/note/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            return {
                success: true,
                data: data.note
            }
        }

        return {
            success: false,
            errors: data.errors
        }

    } catch (err) {
        return {
            success: false,
            errors: ["Something Went Wrong !!!"]
        }
    }
}

export const updateNoteAPI = async (id, body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/note/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            return {
                success: true,
                data: data.note
            }
        }

        return {
            success: false,
            errors: data.errors
        }

    } catch (err) {
        return {
            success: false,
            errors: ["Something Went Wrong !!!"]
        }
    }
}

export const deleteNoteAPI = async (id) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/note/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            }
        });
        const data = await res.json();

        if (res.ok) {
            return {
                success: true
            }
        }

        return {
            success: false,
            errors: data.errors
        }

    } catch (err) {
        return {
            success: false,
            errors: ["Something Went Wrong !!!"]
        }
    }
}

export const getAllNotesAPI = async (pageNumber, searchKeyword) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/note/get/all?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKeyword=${searchKeyword}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            }
        });
        const data = await res.json();

        if (res.ok) {
            return {
                success: true,
                data: data.notes
            }
        }

        return {
            success: false,
            errors: data.errors
        }

    } catch (err) {
        return {
            success: false,
            errors: ["Something Went Wrong !!!"]
        }
    }
}

export const getNoteAPI = async (id) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/note/get/one/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            }
        });
        const data = await res.json();

        if (res.ok) {
            return {
                success: true,
                data: data.note
            }
        }

        return {
            success: false,
            errors: data.errors
        }

    } catch (err) {
        return {
            success: false,
            errors: ["Something Went Wrong !!!"]
        }
    }
}