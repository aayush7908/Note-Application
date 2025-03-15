import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Note({ note }) {

    const [title, setTitle] = useState([note.title]);
    const [description, setDescription] = useState([note.description]);
    const [tag, setTag] = useState([note.tag]);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const searchKeyword = searchParams.get("searchKeyword");
        if (searchKeyword) {
            const regex = new RegExp(`(${searchKeyword})`, 'gi');
            setTitle(note.title.split(regex));
            setDescription(note.description.split(regex));
            setTag(note.tag.split(regex));
        }
    }, []);

    return (
        <Link
            to={`/note/view/${note._id}`}
            className="flex flex-col justify-between gap-[0.5rem] p-[1rem] border-2 rounded-lg border-slate-500 hover:bg-slate-100"
        >
            <div className="flex flex-col gap-[0.5rem]">
                <h3 className="text-lg font-medium">
                    {
                        title.map((part, index) => {
                            return (
                                index % 2 === 0 ? (
                                    <span>{part}</span>
                                ) : (
                                    <mark>{part}</mark>
                                )
                            )
                        })
                    }
                    {
                        note.title.length === 25 && (
                            <span>...</span>
                        )
                    }
                </h3>
                <p>
                    {
                        description.map((part, index) => {
                            return (
                                index % 2 === 0 ? (
                                    <span>{part}</span>
                                ) : (
                                    <mark>{part}</mark>
                                )
                            )
                        })
                    }
                    {
                        note.description.length === 100 && (
                            <span>...</span>
                        )
                    }
                </p>
            </div>
            <div className="flex flex-col gap-[0.5rem]">
                <div className="flex">
                    <span className="px-[0.5rem] py-[0.2rem] border-2 rounded-full border-slate-300 bg-slate-100">
                        {
                            tag.map((part, index) => {
                                return (
                                    index % 2 === 0 ? (
                                        <span>{part}</span>
                                    ) : (
                                        <mark>{part}</mark>
                                    )
                                )
                            })
                        }
                    </span>
                </div>
                <i className="font-medium text-slate-600">Last Modified On: {(new Date(note.lastModifiedOn)).toLocaleString()}</i>
            </div>
        </Link>
    );
}