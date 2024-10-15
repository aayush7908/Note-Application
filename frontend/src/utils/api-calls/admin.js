import { getToken } from "../cookie/cookie-utils";

export const getAllUsersAPI = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/user/get/all`, {
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
                data: data.users
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

export const updateUserAPI = async (id, body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/user/update/name/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
            body: JSON.stringify(body)
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

export const deleteUserAPI = async (id) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/user/delete/${id}`, {
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