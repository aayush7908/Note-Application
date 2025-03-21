import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, PencilLine, Trash2 } from "lucide-react";

import { deleteNoteService } from "services/note";
import alertContext from "context/alert/alertContext";

import LinkButton from "components/LinkButton";
import FormButton from "components/FormButton";

export default function Note({ note }) {

    const [isProcessing, setIsProcessing] = useState(false);
    const { createAlert } = useContext(alertContext);
    const navigate = useNavigate();

    const handleDelete = async () => {
        setIsProcessing(true);
        const isDeleteConfirm = window.confirm("Do you want to delete this Note ?");
        if (isDeleteConfirm) {
            const { success, errors } = await deleteNoteService(note._id);
            if (success) {
                navigate("/");
                createAlert("success", "Note Deleted Successfully");
            } else {
                createAlert("danger", errors[0]);
            }
        }
        setIsProcessing(false);
    }

    return (
        <div className="grid gap-[1rem] py-[1rem]">
            <div className="flex justify-end gap-[1rem]">
                <LinkButton redirectPath={`/note/edit/${note._id}`}>
                    <PencilLine />
                </LinkButton>
                <FormButton
                    disabled={isProcessing}
                    handleClick={handleDelete}
                >
                    {
                        isProcessing ? (
                            <Loader />
                        ) : (
                            <Trash2 />
                        )
                    }
                </FormButton>
            </div>
            <div className="grid gap-[2rem]">
                <h1 className="text-xl font-medium">{note.title}</h1>
                <p className="text-lg whitespace-pre-wrap">{note.description}</p>
                <div className="flex">
                    <span className="px-[1rem] py-[0.2rem] border-2 rounded-full border-slate-300 bg-slate-100">
                        {note.tag}
                    </span>
                </div>
                <i className="font-medium text-slate-600">
                    Last Modified On: {(new Date(note.lastModifiedOn)).toLocaleString()}
                </i>
            </div>
        </div>
    );
}