import React from "react";
import { Link } from "react-router-dom";

export default function NavbarMenuItem({ children, to }) {
    return (
        <li className="flex items-center">
            <Link
                to={to}
                className="w-full px-[1rem] py-[0.5rem] text-lg font-medium rounded-lg border-2 border-slate-400 bg-slate-200 hover:bg-slate-300"
            >
                {children}
            </Link>
        </li>
    );
}