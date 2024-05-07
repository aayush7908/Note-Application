import React, { useContext } from "react";
import alertContext from "../context/alert/alertContext";

export default function Alert() {
    const { alert } = useContext(alertContext);

    return (
        <>
            {alert ? (
                <div className={`alert alert-${alert.type} position-fixed bottom-0 end-0 m-3 ${alert ? "" : "d-none"}`} role="alert">
                    {alert.msg}
                </div>
            ) :
            <></>
            }
        </>
    );
};