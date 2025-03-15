import { getPasswordResetToken, removePasswordResetToken, savePasswordResetToken, saveToken } from 'utils/cookie';
import { postRequest } from 'utils/api';


export const registerUserService = async (body) => {
    const res = await postRequest(
        `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
        body
    );

    if (res.success) {
        saveToken(res.data.authToken);
        return {
            success: true,
            data: res.data.user
        }
    }
    return res;
}

export const loginUserService = async (body) => {
    const res = await postRequest(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        body
    );

    if (res.success) {
        saveToken(res.data.authToken);
        return {
            success: true,
            data: res.data.user
        }
    }
    return res;
}

export const sendOtpService = async (body) => {
    const res = await postRequest(
        `${process.env.REACT_APP_API_BASE_URL}/auth/forgot-password/otp/send`,
        body
    );

    if (res.success) {
        return {
            success: true
        }
    }
    return res;
}

export const verifyOtpService = async (body) => {
    const res = await postRequest(
        `${process.env.REACT_APP_API_BASE_URL}/auth/forgot-password/otp/verify`,
        body
    );

    if (res.success) {
        savePasswordResetToken(res.data.token);
        return {
            success: true
        }
    }
    return res;
}

export const resetPasswordService = async (body) => {
    const res = await postRequest(
        `${process.env.REACT_APP_API_BASE_URL}/auth/forgot-password/reset-password`,
        body, 
        getPasswordResetToken()
    );

    removePasswordResetToken();
    if (res.success) {
        return {
            success: true
        }
    }
    return res;
}