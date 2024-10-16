import { getToken } from "../cookie/cookie-utils";

export const authenticateUserAPI = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/authenticate`, {
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
                data: data.user
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

export const getUserAPI = async () => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/get`, {
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
                data: data.user
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

export const updateUserAPI = async (body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/update/name`, {
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
                success: true,
                data: data.user
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

export const deleteUserAPI = async (body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/delete`, {
            method: "DELETE",
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