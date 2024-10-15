import React, { useContext, useEffect, useState } from "react";
import { deleteUserAPI, getUserAPI, updateUserAPI } from "../../utils/api-calls/user";
import alertContext from "../../context/alert/alertContext";
import User from "./User";
import Loader from "../Loader";
import DataNotFound from "../DataNotFound";

export default function AccountPage() {

    const [user, setUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { createAlert } = useContext(alertContext);

    const updateFunc = async (formData) => {
        return await updateUserAPI(formData);
    }

    const deleteFunc = async (formData) => {
        return await deleteUserAPI(formData);
    }

    useEffect(() => {
        (async () => {
            setIsProcessing(true);
            const { success, data, errors } = await getUserAPI();
            if (success) {
                setUser(data);
            } else {
                createAlert("danger", errors[0]);
            }
            setIsProcessing(false);
        })();
    }, []);

    return (
        <>
            {
                isProcessing ? (
                    <Loader />
                ) : (
                    <>
                        {
                            user === null ? (
                                <DataNotFound />
                            ) : (
                                <User
                                    user={user}
                                    title={"Account Info."}
                                    updateFunc={updateFunc}
                                    deleteFunc={deleteFunc}
                                />
                            )
                        }
                    </>
                )
            }
        </>
    );
}