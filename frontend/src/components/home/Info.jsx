import React from "react";
import { Link } from "react-router-dom";

export default function Info() {
    return (
        <div className="grid gap-[2rem]">
            <div className="grid gap-[0.5rem]">
                <h1 className="text-3xl font-semibold">
                    Welcome to iNotebook !!!
                </h1>
                <p className="text-lg">
                    The cutting-edge application designed to revolutionize the way you capture, organize, and access your thoughts, ideas, and inspirations. Whether you're a student, professional, or creative thinker, iNotebook is your ultimate digital companion, seamlessly blending functionality with simplicity to enhance your productivity and creativity.
                </p>
            </div>
            <div className="grid lg:flex justify-between gap-[1rem] p-[1rem] border-4 rounded-xl border-slate-400">
                <div className="flex flex-col gap-[0.5rem] lg:p-[2rem]">
                    <h4 className="text-xl font-semibold">
                        Create, Modify and Delete notes
                    </h4>
                    <p className="text-lg">
                        You can create your personal notes and access them anywhere. <br />You can give Title and Tag to notes to keep everything sorted.
                    </p>
                </div>
                <div>
                    <img
                        src="images/notes.png"
                        draggable={false}
                        className="lg:max-w-[40rem] rounded-xl"
                    />
                </div>
            </div>
            <div className="grid lg:flex justify-between gap-[1rem] p-[1rem] border-4 rounded-xl border-slate-400">
                <div className="flex flex-col gap-[0.5rem] lg:p-[2rem]">
                    <h4 className="text-xl font-semibold">
                        Search your notes easily
                    </h4>
                    <p className="text-lg">
                        You can search your notes matching specific keywords by Title, Body or Tag.
                    </p>
                </div>
                <div>
                    <img
                        src="images/search.png"
                        draggable={false}
                        className="lg:max-w-[40rem] rounded-xl"
                    />
                </div>
            </div>
            <h4 className="text-xl text-center">
                <span>Please </span>
                <Link
                    to={"/auth/login"}
                    className="font-semibold text-blue-800 underline-offset-2 hover:underline"
                >
                    Login
                </Link>
                <span> or </span>
                <Link
                    to={"/auth/register"}
                    className="font-semibold text-blue-800 underline-offset-2 hover:underline"
                >
                    Register
                </Link>
                <span> to Coutinue ...</span>
            </h4>
        </div>
    );
}