import { error } from "../error-handler/error";

const getAdminDataAPI = async () => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/get-data`, {
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

const removeUserAPI = async (userID) => {
    let response;
    try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/remove-user/${userID}`, {
            method: "DELETE",
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

export {
    getAdminDataAPI,
    removeUserAPI
};