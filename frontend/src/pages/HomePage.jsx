import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import authContext from "context/auth/authContext";

import Info from "components/home/Info";
import NoteInfiniteScroll from "components/home/NoteInfiniteScroll";

export default function HomePage() {

    const { user } = useContext(authContext);

    return (
        <div className="md:pt-[1rem] pb-[3rem]">
            {
                user ? (
                    <>
                        <NoteInfiniteScroll />
                        <Link
                            to={"/note/create"}
                            className="fixed bottom-[1rem] right-[1rem] p-[1rem] border-2 rounded-full border-slate-500 bg-slate-300 shadow-xl hover:bg-slate-200"
                        >
                            <Plus />
                        </Link>
                    </>
                ) : (
                    <Info />
                )
            }
        </div>
    );
}