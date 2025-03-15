import React, { useContext } from "react";

import alertContext from "context/alert/alertContext";

export default function Alert() {
    const { alert } = useContext(alertContext);

    return (
        <>
            {
                alert ? (
                    <div className={`fixed right-[1rem] bottom-[1rem] px-[2rem] py-[1rem] border-2 rounded-md font-medium ${alert.type === "success" ? "bg-green-300 border-green-500" : "bg-red-300 border-red-500"}`} role="alert">
                        {alert.msg}
                    </div>
                ) : (
                    <></>
                )
            }
        </>
    );
};