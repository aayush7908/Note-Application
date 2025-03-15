import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import authContext from "context/auth/authContext";
import { removeToken } from "utils/cookie";

export default function LogoutPage() {

    const { logoutUser } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        const isLogoutConfirm = window.confirm("Do you want to Logout ?");
        if (!isLogoutConfirm) {
            window.history.back();
            return;
        }
        logoutUser();
        removeToken();
        navigate("/");
    }, []);

    return (
        <></>
    );
}