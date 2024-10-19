import React, { useContext, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import FormButton from "../../FormButton";
import alertContext from "../../../context/alert/alertContext";
import { resetPasswordAPI, sendOtpAPI, verifyOtpAPI } from "../../../utils/api-calls/auth";
import { validateEmail, validateOtp, validatePassword } from "../../../utils/validation/validation-utils";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordForm() {

    const otp = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEmailSectionVisible, setIsEmailSectionVisible] = useState(true);
    const [isOtpSectionVisible, setIsOtpSectionVisible] = useState(false);
    const [isPasswordSectionVisible, setIsPasswordSectionVisible] = useState(false);
    const { createAlert } = useContext(alertContext);
    const navigate = useNavigate();

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        const isEmailValid = validateEmail(email.current.value);
        if (!isEmailValid) {
            alert("Enter a valid Email Address");
            return;
        }
        setIsProcessing(true);
        const formData = {
            email: email.current.value
        };
        const { success, data, errors } = await sendOtpAPI(formData);
        if (success) {
            setIsEmailSectionVisible(false);
            setIsOtpSectionVisible(true);
            createAlert("success", "OTP sent to your Email");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsProcessing(false);
    }

    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        const isOtpValid = validateOtp(otp.current.value);
        if (!isOtpValid) {
            alert("Enter a valid Otp");
            return;
        }
        setIsProcessing(true);
        const formData = {
            email: email.current.value,
            otp: otp.current.value
        };
        const { success, data, errors } = await verifyOtpAPI(formData);
        if (success) {
            setIsOtpSectionVisible(false);
            setIsPasswordSectionVisible(true);
            createAlert("success", "OTP Verified");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsProcessing(false);
    }

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        let error = "";
        const isPasswordValid = validatePassword(password.current.value);
        const isPasswordMatch = (password.current.value === confirmPassword.current.value);
        if (!isPasswordValid) {
            error += "\nEnter a valid Password"
        }
        if (!isPasswordMatch) {
            error += "\Passwords donot match"
        }
        if (!isPasswordValid || !isPasswordMatch) {
            alert(error);
            return;
        }
        setIsProcessing(true);
        const formData = {
            email: email.current.value,
            password: password.current.value,
            confirmPassword: confirmPassword.current.value
        };
        const { success, data, errors } = await resetPasswordAPI(formData);
        if (success) {
            navigate("/auth/login");
            createAlert("success", "Password Changed");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsProcessing(false);
    }

    return (
        <div className={`w-[30rem] flex flex-col gap-[1rem] p-[2rem] border-2 rounded-lg`}>

            {/* HEADING */}
            <div className="grid justify-center">
                <h1 className="text-2xl font-semibold underline underline-offset-2">
                    Reset Password
                </h1>
            </div>

            {/* EMAIL FORM */}
            <form
                onSubmit={handleEmailSubmit}
                className={`grid gap-[1rem] ${!isEmailSectionVisible && "hidden"}`}
            >
                <div className="grid">
                    <label
                        htmlFor="email"
                        className="font-medium"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="john@gmail.com"
                        ref={email}
                        className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                        autoFocus={true}
                    />
                </div>
                <div className="flex justify-center">
                    <FormButton
                        disabled={isProcessing}
                        handleClick={handleEmailSubmit}
                    >
                        {
                            isProcessing ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <span>Send OTP</span>
                            )
                        }
                    </FormButton>
                </div>
            </form>

            {/* OTP FORM */}
            <form
                onSubmit={handleOtpSubmit}
                className={`grid gap-[1rem] ${!isOtpSectionVisible && "hidden"}`}
            >
                <div className="grid">
                    <label
                        htmlFor="otp"
                        className="font-medium"
                    >
                        OTP
                    </label>
                    <input
                        id="otp"
                        type="text"
                        ref={otp}
                        className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                        autoFocus={true}
                    />
                </div>
                <div className="flex justify-center">
                    <FormButton
                        disabled={isProcessing}
                        handleClick={handleOtpSubmit}
                    >
                        {
                            isProcessing ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <span>Verify OTP</span>
                            )
                        }
                    </FormButton>
                </div>
                <div>
                    <p>
                        <b>NOTE: </b>
                        <span>An email containing OTP has been sent to your Email Address. It might take upto </span>
                        <b>5 minutes</b>
                        <span> for the email to arrive. Please be patient.</span>
                    </p>
                </div>
            </form>

            {/* PASSWORD FORM */}
            <form
                onSubmit={handlePasswordSubmit}
                className={`grid gap-[1rem] ${!isPasswordSectionVisible && "hidden"}`}
            >
                <div className="grid gap-[1rem]">
                    <div className="grid">
                        <label
                            htmlFor="password"
                            className="font-medium"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type={isPasswordVisible ? "text" : "password"}
                            ref={password}
                            className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                            autoFocus={true}
                        />
                    </div>
                    <div className="grid">
                        <label
                            htmlFor="confirmPassword"
                            className="font-medium"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={isPasswordVisible ? "text" : "password"}
                            ref={confirmPassword}
                            className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-[0.3rem]">
                    <input
                        id="passwordVisibility"
                        type="checkbox"
                        onChange={() => { setIsPasswordVisible((isPasswordVisible) => (!isPasswordVisible)) }}
                        className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                    />
                    <label
                        htmlFor="passwordVisibility"
                        className=""
                    >
                        Show Password
                    </label>
                </div>
                <div className="flex justify-center">
                    <FormButton
                        disabled={isProcessing}
                        handleClick={handlePasswordSubmit}
                    >
                        {
                            isProcessing ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <span>Reset Password</span>
                            )
                        }
                    </FormButton>
                </div>
            </form>

        </div>
    );
}