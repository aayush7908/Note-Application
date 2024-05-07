import React, { useContext, useEffect } from "react";
import authContext from "../context/auth/authContext";
import alertContext from "../context/alert/alertContext";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import themeContext from "../context/theme/themeContext";

export default function Profile() {
    const { user, getUserProfile } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const { themeColorPalette } = useContext(themeContext);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const { success, errors } = await getUserProfile();
            if (!success) {
                createAlert("danger", errors[0]);
                navigate("/");
            }
        })();
        // eslint-disable-next-line
    }, []);

    return (
        <div key={user}>
            {
                user ?
                    (<div>
                        <ul className="list-group list-group-horizontal mb-3">
                            <li className={`list-group-item ${themeColorPalette.themeMode === "light" ? "list-group-item-info" : ""} text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode === "light" ? "" : "danger"} col-md-3 fw-bold`}>Name: </li>
                            <li className={`list-group-item col-md-9 bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`}>{user.name}</li>
                        </ul>
                        <ul className="list-group list-group-horizontal mb-3">
                            <li className={`list-group-item ${themeColorPalette.themeMode === "light" ? "list-group-item-info" : ""} text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode === "light" ? "" : "danger"} col-md-3 fw-bold`}>Email Address: </li>
                            <li className={`list-group-item col-md-9 bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`}>{user.email}</li>
                        </ul>
                        <ul className="list-group list-group-horizontal mb-3">
                            <li className={`list-group-item ${themeColorPalette.themeMode === "light" ? "list-group-item-info" : ""} text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode === "light" ? "" : "danger"} col-md-3 fw-bold`}>Account Created On: </li>
                            <li className={`list-group-item col-md-9 bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`}>{(new Date(user.date)).toDateString()}</li>
                        </ul>
                    </div>) :
                    (<Spinner label={"Fetching User Profile"} />)
            }
        </div>
    );
};