import React, { useContext } from "react";
import { Link } from "react-router-dom";
import authContext from "../context/auth/authContext";

export default function Navbar() {

    const { user } = useContext(authContext);

    return (
        <div className="h-[4rem] w-full fixed top-0 border-b-2 border-slate-300 bg-slate-200">
            <div className="h-full w-full px-[2rem] flex justify-between items-center">
                {/* Logo */}
                <Link
                    to={"/"}
                    className="flex items-center gap-[0.5rem]"
                >
                    <img
                        src={"images/logo.png"}
                        alt="iNotebook"
                        draggable={false}
                        className="h-[2rem]"
                    />
                    <h1 className="text-xl font-medium">iNotebook</h1>
                </Link>

                {/* Navigation Menu */}
                <ul className="flex items-center gap-[1rem]">
                    {
                        user ? (
                            <>
                                <li>
                                    <Link
                                        to={"/account"}
                                        className="text-lg font-medium underline-offset-2 hover:underline"
                                    >
                                        Account
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to={"/auth/login"}
                                        className="text-lg font-medium underline-offset-2 hover:underline"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={"/auth/register"}
                                        className="text-lg font-medium underline-offset-2 hover:underline"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )
                    }
                </ul>
            </div>
        </div>
    );
}