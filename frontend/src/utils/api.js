import { handleError } from "utils/error";

export const getRequest = async (url, token) => {
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: token ? {
                "Content-Type": "application/json",
                "Authorization": token
            } : {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        
        if(!res.ok) {
            return handleError(data.errors);
        }
        return {
            success: true, 
            data: data
        };

    } catch (err) {
        return handleError();
    }
}

export const postRequest = async (url, body, token) => {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: token ? {
                "Content-Type": "application/json",
                "Authorization": token
            } : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        
        if(!res.ok) {
            return handleError(data.errors);
        }
        return {
            success: true, 
            data: data
        };

    } catch (err) {
        return handleError();
    }
}

export const putRequest = async (url, body, token) => {
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: token ? {
                "Content-Type": "application/json",
                "Authorization": token
            } : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        
        if(!res.ok) {
            return handleError(data.errors);
        }
        return {
            success: true, 
            data: data
        };

    } catch (err) {
        return handleError();
    }
}

export const patchRequest = async (url, body, token) => {
    try {
        const res = await fetch(url, {
            method: "PATCH",
            headers: token ? {
                "Content-Type": "application/json",
                "Authorization": token
            } : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        
        if(!res.ok) {
            return handleError(data.errors);
        }
        return {
            success: true, 
            data: data
        };

    } catch (err) {
        return handleError();
    }
}

export const deleteRequest = async (url, token, body) => {
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: token ? {
                "Content-Type": "application/json",
                "Authorization": token
            } : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        
        if(!res.ok) {
            return handleError(data.errors);
        }
        return {
            success: true, 
            data: data
        };

    } catch (err) {
        return handleError();
    }
}