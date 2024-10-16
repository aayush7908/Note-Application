import { getPasswordResetToken, removePasswordResetToken, savePasswordResetToken, saveToken } from '../cookie/cookie-utils';

export const registerUserAPI = async (body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            saveToken(data.authToken);
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

export const loginUserAPI = async (body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            saveToken(data.authToken);
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

export const sendOtpAPI = async (body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/forgot-password/otp/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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

export const verifyOtpAPI = async (body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/forgot-password/otp/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            savePasswordResetToken(data.token);
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

export const resetPasswordAPI = async (body) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/forgot-password/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": getPasswordResetToken()
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            savePasswordResetToken(data.token);
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
    } finally {
        removePasswordResetToken();
    }
}