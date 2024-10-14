import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../context/auth/authContext";
import alertContext from "../context/alert/alertContext";
import themeContext from "../context/theme/themeContext";

export default function Signup() {
    let navigate = useNavigate();
    const [userData, setUserData] = useState({ name: "", email: "", password: "", password2: "" });
    const [authenticating, setAuthencating] = useState(false);
    const { signupUser, isAuthenticated } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const { themeColorPalette } = useContext(themeContext);

    const onChangeFunc = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const togglePasswordVisibility = () => {
        const passwordField = document.getElementById("password");
        const passwordField2 = document.getElementById("password2");
        if (passwordField.type === "password") {
            passwordField.type = "text";
            passwordField2.type = "text";
        }
        else {
            passwordField.type = "password";
            passwordField2.type = "password";
        }
    };

    const handleSignup = async (event) => {
        // Prevent default submit of form
        event.preventDefault();

        setAuthencating((authenticating) => { return true; });
        
        // Call the signup func from AuthState
        const { success, errors } = await signupUser({
            name: userData.name,
            email: userData.email,
            password: userData.password
        });

        setAuthencating((authenticating) => { return false; });

        // Check the response
        if (success) {
            // Redirect to home page
            navigate("/");
            createAlert("success", "Account created successfully");
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
            <form className={`text-${themeColorPalette.contrastMode} m-1 p-4 rounded`} onSubmit={handleSignup} style={{ backgroundColor: themeColorPalette.backgroundColor }}>
                <h2 className="mb-5">Enter your details to Register:</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-5">Name</label>
                    <input type="text" className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`} id="name" name="name" aria-describedby="emailHelp" value={userData.name} onChange={onChangeFunc} required disabled={authenticating} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fs-5">Email address</label>
                    <input type="email" className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`} id="email" name="email" aria-describedby="emailHelp" value={userData.email} onChange={onChangeFunc} required disabled={authenticating} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fs-5">Password</label>
                    <input type="password" className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`} id="password" name="password" value={userData.password} onChange={onChangeFunc} required disabled={authenticating} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password2" className="form-label fs-5">Re-enter Password</label>
                    <input type="password" className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`} id="password2" name="password2" value={userData.password2} onChange={onChangeFunc} required disabled={authenticating} />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="showPassword" onChange={togglePasswordVisibility} />
                    <label className="form-check-label" htmlFor="showPassword">Show Password</label>
                </div>
                <button type="submit" className={`btn btn-${themeColorPalette.themeMode === "light" ? "danger" : "primary"}`} disabled={userData.name.length < 3 || userData.password.length < 8 || userData.password2.length < 8 || userData.password !== userData.password2 || authenticating}>
                    {
                        authenticating ? "Creating Account..." : "Signup"
                    }
                </button>
            </form>
        </div>
    );
};