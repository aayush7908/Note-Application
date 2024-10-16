import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom"

export default function Note({ note }) {

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const searchKeyword = searchParams.get("searchKeyword");
        note.title = note.title.replaceAll(searchKeyword, `<mark>${searchKeyword}</mark>`);
        note.description = note.description.replaceAll(searchKeyword, `<mark>${searchKeyword}</mark>`);
        note.tag = note.tag.replaceAll(searchKeyword, `<mark>${searchKeyword}</mark>`);
    }, []);

    return (
        <Link
            to={`/note/view/${note._id}`}
            className="grid gap-[0.5rem] p-[1rem] border-2 rounded-lg border-slate-500 hover:bg-slate-100"
        >
            <h3 dangerouslySetInnerHTML={{ __html: note.title }} className="text-lg font-medium"></h3>
            <p dangerouslySetInnerHTML={{ __html: note.description }}></p>
            <div className="flex">
                <span dangerouslySetInnerHTML={{ __html: note.tag }} className="px-[0.5rem] py-[0.2rem] border-2 rounded-full border-slate-300 bg-slate-100"></span>
            </div>
            <i className="font-medium text-slate-600">Last Modified On: {(new Date(note.lastModifiedOn)).toLocaleString()}</i>
        </Link>
    );
}