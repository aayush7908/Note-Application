import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

import { loginUserService } from "services/auth";
import authContext from "context/auth/authContext";
import alertContext from "context/alert/alertContext";
import { validateEmail, validatePassword } from "utils/validation";

import FormButton from "components/FormButton";

export default function LoginForm() {

    const email = useRef(null);
    const password = useRef(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { authenticateUser } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const navigate = useNavigate();

    const validateFormData = () => {
        let error = "";
        const isEmailValid = validateEmail(email.current.value);
        const isPasswordValid = validatePassword(password.current.value);
        if (!isEmailValid) {
            error += "\nEnter a valid Email Address"
        }
        if (!isPasswordValid) {
            error += "\nEnter a valid Password"
        }
        if (!isEmailValid || !isPasswordValid) {
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
            email: email.current.value,
            password: password.current.value
        };
        const { success, data, errors } = await loginUserService(formData);
        if (success) {
            authenticateUser(data);
            navigate("/");
            createAlert("success", "Logged In Successfully");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsProcessing(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-[30rem] flex flex-col gap-[1rem] p-[2rem] border-2 rounded-lg"
        >
            <div className="grid justify-center">
                <h1 className="text-2xl font-semibold underline underline-offset-2">Login</h1>
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
                    autoFocus={true}
                />
            </div>
            <div className="grid gap-[0.5rem]">
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
                            <span>Login</span>
                        )
                    }
                </FormButton>
            </div>
            <div>
                <Link
                    to={"/auth/forgot-password"}
                    className="underline-offset-2 hover:underline text-blue-700"
                >
                    Forgot Password ?
                </Link>
            </div>
        </form>
    );
}