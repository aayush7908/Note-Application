import React from "react";
import { Link } from "react-router-dom"

export default function Note({ note }) {
    return (
        <Link
            to={`/note/view/${note._id}`}
            className="grid gap-[0.5rem] p-[1rem] border-2 rounded-lg border-slate-500 hover:bg-slate-100"
        >
            <h3 className="text-lg font-medium">{note.title}...</h3>
            <p>{note.description} ...</p>
            <div className="flex">
                    <span className="px-[0.5rem] py-[0.2rem] border-2 rounded-full border-slate-300 bg-slate-100">
                        {note.tag}
                    </span>
                </div>
            <i className="font-medium text-slate-600">Last Modified On: {(new Date(note.lastModifiedOn)).toLocaleString()}</i>
        </Link>
    );
}