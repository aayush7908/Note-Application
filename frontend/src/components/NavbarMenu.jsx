import React, { useContext } from "react";
import authContext from "../context/auth/authContext";
import NavbarMenuItem from "./NavbarMenuItem";

export default function NavbarMenu() {

    const { user } = useContext(authContext);

    return (
        <>
            {
                user ? (
                    <>
                        <NavbarMenuItem to={"/account"}>Account</NavbarMenuItem>
                        <NavbarMenuItem to={"/auth/logout"}>Logout</NavbarMenuItem>
                    </>
                ) : (
                    <>
                        <NavbarMenuItem to={"/auth/login"}>Login</NavbarMenuItem>
                        <NavbarMenuItem to={"/auth/register"}>Register</NavbarMenuItem>
                    </>
                )
            }
        </>
    );
}