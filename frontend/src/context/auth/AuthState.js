import React, { useContext, useState } from "react";
import AuthContext from "./authContext";
import { authenticateUserAPI, getUserProfileAPI, loginUserAPI, signupUserAPI } from "../../utils/api-calls/auth";

const AuthState = (props) => {

    const [user, setUser] = useState(null);

    const authenticateUser = async (newUser) => {
        setUser(newUser);
    };

    const logoutUser = async () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            authenticateUser,
            logoutUser
        }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;