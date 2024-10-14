const TOKEN_NAME = "authToken";

function saveToken(token) {
    localStorage.setItem(TOKEN_NAME, `Bearer ${token}`);
}

function getToken() {
    return localStorage.getItem(TOKEN_NAME);
}

function removeToken() {
    localStorage.removeItem(TOKEN_NAME);
}

export {
    saveToken,
    getToken,
    removeToken
}