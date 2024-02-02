import React, { useState } from "react";
import AlertContext from "./alertContext";

const AlertState = (props) => {
    const [alert, setAlert] = useState(null);

    const createAlert = (type, msg) => {
        const newAlert = {
            type: type,
            msg: msg
        };
        setAlert(newAlert);
        setTimeout(() => {
            setAlert(null);
        }, 2000);
    };

    return (
        <AlertContext.Provider value={{ alert, createAlert }}>
            {props.children}
        </AlertContext.Provider>
    );
};

export default AlertState;