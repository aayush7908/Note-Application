import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtpAPI } from "../utils/api-calls/auth";
import authContext from "../context/auth/authContext";
import alertContext from "../context/alert/alertContext";
import themeContext from "../context/theme/themeContext";

export default function ForgotPassword() {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { loginUser, rememberMe, toggleRememberMe, isAuthenticated } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const { themeColorPalette } = useContext(themeContext);

    const handleSendOtp = async () => {
        setProcessing(true);
        // Call send otp func
        const { success, errors } = await sendOtpAPI({ email: email });
        setProcessing(false);

        // Check the response
        if (success) {
            createAlert("success", "OTP sent successfully");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsOtpSent(true);
    };

    const handleVerifyOtp = async () => {
        setProcessing(true);
        // Call send otp func
        const { success, errors } = await sendOtpAPI({ email: email });
        setProcessing(false);

        // Check the response
        if (success) {
            createAlert("success", "OTP sent successfully");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsOtpSent(true);
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    return (
        <div className={`col-lg-4 offset-lg-4 col-md-8 offset-md-2 my-3 p-3 text-${themeColorPalette.contrastMode} border border-3 border-danger rounded`}>
            <h2 className="mb-5">Forgot Password:</h2>
            <div className="mb-3">
                <label htmlFor="email" className="form-label fs-5">Email address</label>
                <input type="email" className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} borderAnimateInput`} id="email" aria-describedby="emailHelp" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required disabled={processing} />
            </div>
            <button type="button" className={`btn btn-${themeColorPalette.themeMode === "light" ? "primary" : "success"}`} disabled={processing} onClick={handleSendOtp}>
                {
                    processing ? "Sending..." : "Send OTP"
                }
            </button>
            {
                isOtpSent && (
                    <>
                        <div className="mt-3">
                            <div className="mb-3">
                                <label htmlFor="ver_code" className="form-label fs-5">Enter OTP sent to your email</label>
                                <input type="text" className={`form-control bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} borderAnimateInput`} id="ver_code" aria-describedby="ver_code_help" name="ver_code" value={otp} onChange={(e) => { setOtp(e.target.value) }} required disabled={processing} />
                            </div>
                        </div>
                        <button type="button" className={`btn btn-${themeColorPalette.themeMode === "light" ? "primary" : "success"}`} disabled={processing} onClick={handleVerifyOtp}>
                            {
                                processing ? "Verifying..." : "Submit"
                            }
                        </button>
                    </>
                )
            }
        </div>
    );
};