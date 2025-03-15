import React, { useContext } from "react";
import { useLocation } from "react-router-dom";

import authContext from "context/auth/authContext";

import NavbarMenuItem from "components/navbar/NavbarMenuItem";

export default function NavbarMenu() {

    const { user } = useContext(authContext);
    const location = useLocation();

    return (
        <>
            {
                user ? (
                    <>
                        {
                            user.isAdmin && (
                                <NavbarMenuItem to={"/admin"}>Admin</NavbarMenuItem>
                            )
                        }
                        {
                            location.pathname === "/account" ? (
                                <NavbarMenuItem to={"/"}>Notes</NavbarMenuItem>
                            ) : (
                                <NavbarMenuItem to={"/account"}>Account</NavbarMenuItem>
                            )
                        }
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