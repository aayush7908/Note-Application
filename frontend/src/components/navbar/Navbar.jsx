import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MenuSquare } from "lucide-react";
import NavbarMenu from "./NavbarMenu";

export default function Navbar() {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    return (
        <div className="h-[4rem] w-full fixed top-0 border-b-2 border-slate-300 bg-slate-200">
            <div className="h-full w-full px-[1rem] md:px-[3rem] lg:px-[5rem] flex justify-between items-center">
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
                <div className="hidden md:block">
                    <ul className="flex items-center gap-[1rem]">
                        <NavbarMenu />
                    </ul>
                </div>
                <div className="md:hidden flex items-center">
                    <button
                        to={"/account"}
                        onClick={() => {
                            setIsMenuVisible((isMenuVisible) => (!isMenuVisible));
                        }}
                        className="text-lg font-medium"
                    >
                        <MenuSquare className="size-[2rem]" />
                    </button>
                </div>
            </div>

            {/* Dropdown Menu */}
            {
                isMenuVisible && (
                    <div className="fixed top-[4.5rem] right-[2rem] p-[0.5rem] border-2 rounded-lg border-slate-400 bg-slate-100">
                        <ul className="grid gap-[0.5rem]">
                            <NavbarMenu />
                        </ul>
                    </div>
                )
            }
        </div>
    );
}