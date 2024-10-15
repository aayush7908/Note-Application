import React from "react";
import { Link } from "react-router-dom";

export default function LinkButton({ children, redirectPath }) {
    return (
        <Link
            to={redirectPath}
            className="px-[1rem] py-[0.5rem] border-2 rounded-md border-slate-400 bg-slate-200"
        >
            {children}
        </Link>
    );
}