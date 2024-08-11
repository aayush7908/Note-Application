import React, { useContext, useEffect, useState } from "react";
import authContext from "../context/auth/authContext";
import alertContext from "../context/alert/alertContext";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import themeContext from "../context/theme/themeContext";
import { getAdminDataAPI, removeUserAPI } from "../utils/api-calls/admin";

export default function Admin() {
    const { user, getUserProfile } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const { themeColorPalette } = useContext(themeContext);
    const navigate = useNavigate();
    const [data, setData] = useState();

    useEffect(() => {
        (async () => {
            const { success, errors } = await getUserProfile();
            if (!success) {
                createAlert("danger", errors[0]);
                navigate("/");
            } else if (user && !user.isAdmin) {
                createAlert("danger", ["Unauthorized Access"]);
                navigate("/");
            } else {
                const data = await getAdminDataAPI();
                setData(data.data);
            }
        })();
        // eslint-disable-next-line
    }, []);

    const removeUser = async (user, index) => {
        if (window.confirm(`Name: ${user.name}\nEmail: ${user.email}\nRemove User ?`)) {
            const { success } = await removeUserAPI(user._id);
            if (success) {
                createAlert("success", "User Removed");
                const temp = {...data};
                temp.users = temp.users.filter((element, i) => {
                    return (i !== index);
                })
                setData(temp);
            } else {
                createAlert("danger", "Some Error Occurred");
            }
        }
    }

    return (
        <div key={user}>
            {
                data ?
                    (<div className="pb-5">
                        {
                            data.users.map((user, index) => {
                                return (<div key={index} className="border p-3 m-3">
                                    <ul className="list-group mb-3">
                                        <div className="d-flex justify-content-between">
                                            <p className={`text-${themeColorPalette.contrastMode}`}>User - {index + 1}</p>
                                            <button className="btn btn-danger" onClick={() => removeUser(user, index)}>Remove</button>
                                        </div>
                                    </ul>
                                    <ul className="list-group list-group-horizontal-md mb-3">
                                        <li className={`list-group-item ${themeColorPalette.themeMode === "light" ? "list-group-item-info" : ""} text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode === "light" ? "" : "danger"} col-md-3 fw-bold`}>Name: </li>
                                        <li className={`list-group-item col-md-9 bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} overflow-auto`}>{user.name}</li>
                                    </ul>
                                    <ul className="list-group list-group-horizontal-md mb-3">
                                        <li className={`list-group-item ${themeColorPalette.themeMode === "light" ? "list-group-item-info" : ""} text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode === "light" ? "" : "danger"} col-md-3 fw-bold`}>Email Address: </li>
                                        <li className={`list-group-item col-md-9 bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} overflow-auto`}>{user.email}</li>
                                    </ul>
                                    <ul className="list-group list-group-horizontal-md mb-3">
                                        <li className={`list-group-item ${themeColorPalette.themeMode === "light" ? "list-group-item-info" : ""} text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode === "light" ? "" : "danger"} col-md-3 fw-bold`}>Account Created On: </li>
                                        <li className={`list-group-item col-md-9 bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} overflow-auto`}>{(new Date(user.date)).toDateString()}</li>
                                    </ul>
                                    <ul className="list-group list-group-horizontal-md mb-3">
                                        <li className={`list-group-item ${themeColorPalette.themeMode === "light" ? "list-group-item-info" : ""} text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode === "light" ? "" : "danger"} col-md-3 fw-bold`}>Number Of Notes: </li>
                                        <li className={`list-group-item col-md-9 bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode} overflow-auto`}>{user.totalNotes}</li>
                                    </ul>
                                </div>)
                            })
                        }
                    </div>) :
                    (<Spinner label={"Fetching User Profile"} />)
            }
        </div>
    );
};