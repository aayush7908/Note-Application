import React, { useContext } from "react";
import Info from "./Info";
import authContext from "../../context/auth/authContext";
import NoteInfiniteScroll from "./NoteInfiniteScroll";

export default function HomePage() {

    const { user } = useContext(authContext);

    return (
        <div className="md:pt-[1rem] pb-[3rem]">
            {
                user ? (
                    <NoteInfiniteScroll />
                ) : (
                    <Info />
                )
            }
        </div>
    );
}