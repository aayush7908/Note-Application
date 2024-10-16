const TOKEN_NAME = "authToken";
const PASSWORD_RESET_TOKEN_NAME = "token";

export function saveToken(token) {
    localStorage.setItem(TOKEN_NAME, `Bearer ${token}`);
}

export function getToken() {
    return localStorage.getItem(TOKEN_NAME);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_NAME);
}

export function savePasswordResetToken(token) {
    localStorage.setItem(PASSWORD_RESET_TOKEN_NAME, token);
}

export function getPasswordResetToken() {
    return localStorage.getItem(PASSWORD_RESET_TOKEN_NAME);
}

export function removePasswordResetToken() {
    localStorage.removeItem(PASSWORD_RESET_TOKEN_NAME);
}