import React, { useContext, useEffect, useState } from "react";
import { authenticateUserAPI } from "../../utils/api-calls/user";
import alertContext from "../../context/alert/alertContext";
import User from "./User";
import Loader from "../Loader";
import DataNotFound from "../DataNotFound";

export default function AccountPage() {

    const [user, setUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { createAlert } = useContext(alertContext);

    useEffect(() => {
        (async () => {
            setIsProcessing(true);
            const { success, data, errors } = await authenticateUserAPI();
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
                                <User user={user} />
                            )
                        }
                    </>
                )
            }
        </>
    );
}