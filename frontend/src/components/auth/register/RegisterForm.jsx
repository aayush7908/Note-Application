import React, { useContext, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import FormButton from "../../FormButton";
import authContext from "../../../context/auth/authContext";
import alertContext from "../../../context/alert/alertContext";
import { registerUserAPI } from "../../../utils/api-calls/auth";
import { validateEmail, validatePassword } from "../../../utils/validation/validation-utils";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {

    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { authenticateUser } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const navigate = useNavigate();

    const validateFormData = () => {
        let error = "";
        const isNameValid = (name.current.value.length >= 3);
        const isEmailValid = validateEmail(email.current.value);
        const isPasswordValid = validatePassword(password.current.value) && (password.current.value === confirmPassword.current.value);
        if (!isNameValid) {
            error += "\nEnter a valid Name (Length >= 3 characters)"
        }
        if (!isEmailValid) {
            error += "\nEnter a valid Email Address"
        }
        if (!isPasswordValid) {
            error += "\nEnter a valid Password"
        }
        if (!isNameValid || !isEmailValid || !isPasswordValid) {
            alert(error);
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isDataValid = validateFormData();
        if (!isDataValid) {
            return;
        }
        setIsProcessing(true);
        const formData = {
            name: name.current.value,
            email: email.current.value,
            password: password.current.value
        };
        const { success, data, errors } = await registerUserAPI(formData);
        if (success) {
            authenticateUser(data);
            navigate("/");
            createAlert("success", "Account Created Successfully");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsProcessing(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="min-w-[20rem] flex flex-col gap-[1rem] p-[2rem] border-2 rounded-lg"
        >
            <div className="grid justify-center">
                <h1 className="text-2xl font-semibold underline underline-offset-2">Register</h1>
            </div>
            <div className="grid">
                <label
                    htmlFor="name"
                    className="font-medium"
                >
                    Name
                </label>
                <input
                    id="name"
                    type="name"
                    placeholder="John Doe"
                    ref={name}
                    className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                    autoFocus={true}
                />
            </div>
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
                />
            </div>
            <div className="grid gap-[0.5rem]">
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
            </div>
            <div className="flex justify-center">
                <FormButton
                    disabled={isProcessing}
                    handleClick={() => { }}
                >
                    {
                        isProcessing ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <span>Register</span>
                        )
                    }
                </FormButton>
            </div>
        </form>
    );
}