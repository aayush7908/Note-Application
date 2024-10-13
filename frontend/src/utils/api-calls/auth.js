import { error } from "../error-handler/error";

const authenticateUserAPI = async () => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/authenticate-user`, {
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

const loginUserAPI = async (credentials) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

const signupUserAPI = async (credentials) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

const getUserProfileAPI = async () => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/get-user`, {
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

const sendOtpAPI = async (body) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/send-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            },
            body: JSON.stringify(body)
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

const verifyOtpAPI = async (body) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            },
            body: JSON.stringify(body)
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

const resetPasswordAPI = async (body) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authToken": localStorage.token
            },
            body: JSON.stringify(body)
        });
        response = await response.json();
    } catch (err) {
        response = error(err);
    }
    return response;
}

export {
    authenticateUserAPI,
    loginUserAPI,
    signupUserAPI,
    getUserProfileAPI,
    sendOtpAPI,
    verifyOtpAPI,
    resetPasswordAPI
};