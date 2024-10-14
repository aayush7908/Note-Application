import { getToken } from "../cookie/cookie-utils";

const pageSize = 12;

export const getAllNotesAPI = async (pageNumber, searchKeyword) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/note/get/all?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKeyword=${searchKeyword}`, {
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
                data: data.notes
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