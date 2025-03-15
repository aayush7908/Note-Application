import { getToken } from "utils/cookie";
import { deleteRequest, getRequest, postRequest, putRequest } from "utils/api";

const pageSize = 12;


export const createNoteService = async (body) => {
    const res = await postRequest(
        `${process.env.REACT_APP_API_BASE_URL}/note/create`, 
        body, 
        getToken()
    );

    if (res.success) {
        return {
            success: true,
            data: res.data.note
        }
    }
    return res;
}

export const updateNoteService = async (id, body) => {
    const res = await putRequest(
        `${process.env.REACT_APP_API_BASE_URL}/note/update/${id}`, 
        body, 
        getToken()
    );

    if (res.success) {
        return {
            success: true,
            data: res.data.note
        }
    }
    return res;
}

export const deleteNoteService = async (id) => {
    const res = await deleteRequest(
        `${process.env.REACT_APP_API_BASE_URL}/note/delete/${id}`,
        getToken()
    );

    if (res.success) {
        return {
            success: true
        }
    }
    return res;
}

export const getAllNotesService = async (pageNumber, searchKeyword) => {
    const res = await getRequest(
        `${process.env.REACT_APP_API_BASE_URL}/note/get/all?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKeyword=${searchKeyword}`,
        getToken()
    );

    if (res.success) {
        return {
            success: true,
            data: res.data.notes
        }
    }
    return res;
}

export const getNoteService = async (id) => {
    const res = await getRequest(
        `${process.env.REACT_APP_API_BASE_URL}/note/get/one/${id}`,
        getToken()
    );

    if (res.success) {
        return {
            success: true,
            data: res.data.note
        }
    }
    return res;
}