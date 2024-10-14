import React from "react";
import { Link } from "react-router-dom"

export default function Note({ note }) {
    return (
        <Link
            to={`/note/${note._id}`}
            className="grid gap-[0.5rem] p-[1rem] border-2 rounded-lg border-slate-500 hover:bg-slate-100"
        >
            <h3 className="text-lg font-medium">{note.title}...</h3>
            <p>{note.description} ...</p>
            <i className="font-medium text-slate-600">Last Modified On: {(new Date(note.lastModifiedOn)).toLocaleString()}</i>
        </Link>
    );
}