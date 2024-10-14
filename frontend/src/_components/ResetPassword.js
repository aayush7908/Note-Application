import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordAPI } from "../utils/api-calls/auth";
import authContext from "../context/auth/authContext";
import alertContext from "../context/alert/alertContext";
import themeContext from "../context/theme/themeContext";

export default function ResetPassword() {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({ password: "", password2: "" });
    const [processing, setProcessing] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { isAuthenticated } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const { themeColorPalette } = useContext(themeContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const onChangeFunc = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleResetPassword = async (event) => {
        // Prevent default submit of form
        event.preventDefault();

        // check if both passwords match
        if (formData.password !== formData.password2) {
            createAlert("danger", "Passwords donot match");
            return;
        }

        setProcessing((processing) => { return true; });

        // Call reset password func
        const { success, errors } = await resetPasswordAPI({
            password: formData.password,
            email: searchParams.get("email"),
            token: searchParams.get("token")
        });

        setProcessing((processing) => { return false; });

        // Check the response
        if (success) {
            // Redirect to home page
            navigate("/");
            createAlert("success", "Password changed successfully");
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
            <form
                className={`text-${themeColorPalette.contrastMode} m-1 p-4 rounded`}
                onSubmit={handleResetPassword}
                style={{ backgroundColor: themeColorPalette.backgroundColor }}
            >
                <h2 className="mb-5">Reset your password:</h2>
                <div className="mb-3">
                    <label
                        htmlFor="password"
                        className="form-label fs-5"
                    >
                        Password
                    </label>
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} borderAnimateInput`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={onChangeFunc}
                        required
                        disabled={processing}
                    />
                </div>
                <div className="mb-3">
                    <label
                        htmlFor="password2"
                        className="form-label fs-5"
                    >
                        Confirm Password
                    </label>
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} borderAnimateInput`}
                        id="password2"
                        name="password2"
                        value={formData.password2}
                        onChange={onChangeFunc}
                        required
                        disabled={processing}
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input borderAnimateInput"
                        id="showPassword"
                        onChange={() => {
                            setIsPasswordVisible(isPasswordVisible => !isPasswordVisible)
                        }}
                    />
                    <label
                        className="form-check-label"
                        htmlFor="showPassword"
                    >
                        Show Password
                    </label>
                </div>
                <button
                    type="submit"
                    className={`btn btn-${themeColorPalette.themeMode === "light" ? "primary" : "success"}`}
                    disabled={processing}
                >
                    {
                        processing ? "Processing..." : "Submit"
                    }
                </button>
            </form>
        </div>
    );
};