import React, { useState } from "react";
import AuthContext from "context/auth/authContext";

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