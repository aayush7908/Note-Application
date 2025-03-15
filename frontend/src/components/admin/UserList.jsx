import React, { useContext, useEffect, useState } from "react";

import { deleteUserService, getAllUsersService, updateUserService } from "services/admin";
import alertContext from "context/alert/alertContext";

import User from "components/account/User";
import DataNotFound from "components/DataNotFound";
import Loader from "components/Loader";


export default function UserList() {

    const [users, setUsers] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { createAlert } = useContext(alertContext);

    useEffect(() => {
        (async () => {
            setIsProcessing(true);
            const { success, data, errors } = await getAllUsersService();
            if (success) {
                setUsers(data);
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
                            users.length > 0 ? (
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-[1rem]">
                                    {
                                        users.map((user, index) => {
                                            return (
                                                <User
                                                    key={index}
                                                    user={user}
                                                    title={`User - ${index + 1}`}
                                                    updateFunc={async (formData) => {
                                                        return await updateUserService(user._id, formData);
                                                    }}
                                                    deleteFunc={async () => {
                                                        return await deleteUserService(user._id);
                                                    }}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <DataNotFound />
                            )
                        }
                    </>
                )
            }
        </>
    );
}