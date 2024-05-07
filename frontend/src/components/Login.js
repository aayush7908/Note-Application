import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from './Spinner';
import authContext from "../context/auth/authContext";
import alertContext from "../context/alert/alertContext";
import themeContext from "../context/theme/themeContext";

export default function Login() {
    let navigate = useNavigate();
    const [userData, setUserData] = useState({ email: "", password: "" });
    const [authenticating, setAuthencating] = useState(false);
    const { loginUser, rememberMe, toggleRememberMe, isAuthenticated } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const { themeColorPalette } = useContext(themeContext);

    const onChangeFunc = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const togglePasswordVisibility = () => {
        const passwordField = document.getElementById("password");
        if (passwordField.type === "password") passwordField.type = "text";
        else passwordField.type = "password";
    };

    const handleLogin = async (event) => {
        // Prevent default submit of form
        event.preventDefault();

        setAuthencating((authenticating) => { return true; });
        
        // Call login func in AuthState
        const { success, errors } = await loginUser(userData);

        setAuthencating((authenticating) => { return false; });

        // Check the response
        if (success) {
            // Redirect to home page
            navigate("/");
            createAlert("success", "Logged in successfully");
        } else {
            createAlert("danger", errors[0]);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    return (
        <div className="col-md-8 offset-md-2 my-3 bg-spin">
            <form className={`text-${themeColorPalette.contrastMode} m-1 p-4 rounded`} onSubmit={handleLogin} style={{ backgroundColor: themeColorPalette.backgroundColor }}>
                <h2 className="mb-5">Enter your details to Login:</h2>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fs-5">Email address</label>
                    <input type="email" className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} borderAnimateInput`} id="email" aria-describedby="emailHelp" name="email" value={userData.email} onChange={onChangeFunc} required disabled={authenticating} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fs-5">Password</label>
                    <input type="password" className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} borderAnimateInput`} id="password" name="password" value={userData.password} onChange={onChangeFunc} required disabled={authenticating} autoComplete="true" />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input borderAnimateInput" id="showPassword" onChange={togglePasswordVisibility} />
                    <label className="form-check-label" htmlFor="showPassword">Show Password</label>
                </div>
                <button type="submit" className={`btn btn-${themeColorPalette.themeMode === "light" ? "primary" : "success"}`}  disabled={authenticating}>
                    {
                        authenticating ? "Authenticating..." : "Login"
                    }
                </button>
                <div className="my-3 form-check">
                    <input type="checkbox" className="form-check-input borderAnimateInput" id="rememberMe" onChange={toggleRememberMe} checked={rememberMe} />
                    <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                </div>
            </form>
        </div>
    );
};