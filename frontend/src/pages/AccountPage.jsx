import React, { useContext, useEffect, useState } from "react";

import { deleteUserService, getUserService, updateUserNameService } from "services/user";
import alertContext from "context/alert/alertContext";

import User from "components/account/User";
import Loader from "components/Loader";
import DataNotFound from "components/DataNotFound";

export default function AccountPage() {

    const [user, setUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { createAlert } = useContext(alertContext);

    const updateFunc = async (formData) => {
        return await updateUserNameService(formData);
    }

    const deleteFunc = async (formData) => {
        return await deleteUserService(formData);
    }

    useEffect(() => {
        (async () => {
            setIsProcessing(true);
            const { success, data, errors } = await getUserService();
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