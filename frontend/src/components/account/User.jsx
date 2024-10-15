import React, { useContext, useEffect, useRef, useState } from "react";
import FormButton from "../FormButton";
import { LoaderCircle, PencilLine, Save, SquareX } from "lucide-react";
import { updateUserAPI } from "../../utils/api-calls/user";
import alertContext from "../../context/alert/alertContext";

export default function User({ user }) {

    const [isProcessing, setIsProcessing] = useState(false);
    const [isNameDisabled, setIsNameDisabled] = useState(true);
    const { createAlert } = useContext(alertContext);
    const name = useRef(null);

    const validateFormData = () => {
        let error = "";
        const isNameValid = (name.current.value.length >= 3);
        if (!isNameValid) {
            error += "\nEnter a valid Name (Length >= 3 characters)"
        }
        if (!isNameValid) {
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
            name: name.current.value
        };
        const { success, data, errors } = await updateUserAPI(formData);
        if (success) {
            setIsNameDisabled((isNameDisabled) => (!isNameDisabled));
            createAlert("success", "Account Updated Successfully");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsProcessing(false);
    }

    useEffect(() => {
        name.current.value = user.name;
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[1rem] p-[2rem] border-2 rounded-lg"
        >
            <div className="grid justify-center">
                <h1 className="text-2xl font-semibold underline underline-offset-2">
                    Account Info.
                </h1>
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
                    ref={name}
                    disabled={isNameDisabled}
                    className="w-full px-[1rem] py-[0.5rem] border-2 rounded-md"
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
                    value={user.email}
                    disabled={true}
                    className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                />
            </div>
            <div className="flex justify-center gap-[1rem]">
                {
                    isNameDisabled ? (
                        <FormButton
                            type={"button"}
                            disabled={isProcessing}
                            handleClick={() => {
                                setIsNameDisabled((isNameDisabled) => (!isNameDisabled));
                            }}
                        >
                            {
                                isProcessing ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    <PencilLine />
                                )
                            }
                        </FormButton>
                    ) : (
                        <>
                            <FormButton
                                type={"button"}
                                disabled={isProcessing}
                                handleClick={() => {
                                    setIsNameDisabled((isNameDisabled) => (!isNameDisabled));
                                    name.current.value = user.name;
                                }}
                            >
                                {
                                    isProcessing ? (
                                        <LoaderCircle className="animate-spin" />
                                    ) : (
                                        <SquareX />
                                    )
                                }
                            </FormButton>
                            <FormButton
                                disabled={isProcessing}
                                handleClick={() => { }}
                            >
                                {
                                    isProcessing ? (
                                        <LoaderCircle className="animate-spin" />
                                    ) : (
                                        <Save />
                                    )
                                }
                            </FormButton>
                        </>
                    )
                }
            </div>
        </form>
    );
}