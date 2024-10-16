import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../../context/auth/authContext";
import alertContext from "../../context/alert/alertContext";
import UserList from "./UserList";

export default function AdminPage() {

    const { user } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate("/");
            createAlert("danger", "Access Denied");
        }
    }, []);

    return (
        <>
            {
                user && (
                    <div>
                        <div className="grid gap-[1rem]">
                            <h1 className="text-2xl font-semibold pb-[0.5rem] border-b-2">
                                All Users:
                            </h1>
                            <UserList />
                        </div>
                    </div>
                )
            }
        </>
    );
}