import { getToken } from "utils/cookie";
import { deleteRequest, getRequest, patchRequest } from "utils/api";


export const authenticateUserService = async () => {
    const res = await getRequest(
        `${process.env.REACT_APP_API_BASE_URL}/user/authenticate`,
        getToken()
    );

    if (res.success) {
        return {
            success: true,
            data: res.data.user
        }
    }
    return res;
}

export const getUserService = async () => {
    const res = await getRequest(
        `${process.env.REACT_APP_API_BASE_URL}/user/get`,
        getToken()
    );

    if (res.success) {
        return {
            success: true,
            data: res.data.user
        }
    }
    return res;
}

export const updateUserNameService = async (body) => {
    const res = await patchRequest(
        `${process.env.REACT_APP_API_BASE_URL}/user/update/name`, 
        body, 
        getToken()
    );

    if (res.success) {
        return {
            success: true,
            data: res.data.user
        }
    }
    return res;
}

export const deleteUserService = async (body) => {
    const res = await deleteRequest(
        `${process.env.REACT_APP_API_BASE_URL}/user/delete`,
        getToken(), 
        body
    );

    if (res.success) {
        return {
            success: true
        }
    }
    return res;
}