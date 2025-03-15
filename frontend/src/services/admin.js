import { getToken } from "utils/cookie";
import { deleteRequest, getRequest, patchRequest } from "utils/api";


export const getAllUsersService = async () => {
    const res = await getRequest(
        `${process.env.REACT_APP_API_BASE_URL}/admin/user/get/all`,
        getToken()
    );

    if (res.success) {
        return {
            success: true,
            data: res.data.users
        }
    }
    return res;
}

export const updateUserService = async (id, body) => {
    const res = await patchRequest(
        `${process.env.REACT_APP_API_BASE_URL}/admin/user/update/name/${id}`, 
        body, 
        getToken()
    );

    if (res.success) {
        return {
            success: true
        }
    }
    return res;
}

export const deleteUserService = async (id) => {
    const res = await deleteRequest(
        `${process.env.REACT_APP_API_BASE_URL}/admin/user/delete/${id}`,
        getToken()
    );

    if (res.success) {
        return {
            success: true
        }
    }
    return res;
}