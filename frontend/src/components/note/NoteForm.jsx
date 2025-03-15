import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Save, SquareX } from "lucide-react";

import { createNoteService, updateNoteService } from "services/note";
import alertContext from "context/alert/alertContext";

import FormButton from "components/FormButton";

export default function NoteForm({ note }) {

    const title = useRef();
    const description = useRef(null);
    const tag = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { createAlert } = useContext(alertContext);
    const navigate = useNavigate();

    const validateFormData = () => {
        let error = "";
        const isTitleValid = (title.current.value.length >= 3);
        const isDescriptionValid = (description.current.value.length >= 5);
        const isTagValid = (tag.current.value.length <= 10);
        if (!isTitleValid) {
            error += "\nTitle must contain atleast 3 characters"
        }
        if (!isDescriptionValid) {
            error += "\nDescription must contain atleast 5 characters"
        }
        if (!isTagValid) {
            error += "\nTag can contain atmost 10 characters"
        }
        if (!isTitleValid || !isDescriptionValid || !isTagValid) {
            alert(error);
            return false;
        }
        return true;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isDataValid = validateFormData();
        if (!isDataValid) {
            return;
        }
        setIsProcessing(true);
        const formData = {
            title: title.current.value,
            description: description.current.value,
            tag: tag.current.value
        };
        const { success, data, errors } = (
            note === null ? await createNoteService(formData) : await updateNoteService(note._id, formData)
        );
        if (success) {
            navigate(`/note/view/${data._id}`);
            createAlert("success", "Note Saved Successfully");
        } else {
            createAlert("danger", errors[0]);
        }
        setIsProcessing(false);
    }

    const handleCancel = () => {
        const isCancelConfirm = window.confirm("All your changes will be lost ?");
        if (isCancelConfirm) {
            window.history.back();
        }
    }

    useEffect(() => {
        if (note !== null) {
            title.current.value = note.title;
            description.current.value = note.description;
            tag.current.value = note.tag;
        }
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[1rem] py-[1rem]"
        >
            <div className="grid">
                <label
                    htmlFor="title"
                    className="font-medium"
                >
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    placeholder="Enter Note Title Here ..."
                    ref={title}
                    className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                    autoFocus={true}
                />
            </div>
            <div className="grid">
                <label
                    htmlFor="description"
                    className="font-medium"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    type="text"
                    placeholder="Enter Note Description Here ..."
                    ref={description}
                    rows={10}
                    className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                />
            </div>
            <div className="grid">
                <label
                    htmlFor="tag"
                    className="font-medium"
                >
                    Tag
                </label>
                <input
                    id="tag"
                    type="text"
                    placeholder="Enter Note Title Here ..."
                    ref={tag}
                    className="px-[1rem] py-[0.5rem] border-2 rounded-md"
                />
            </div>
            <div className="flex justify-center gap-[1rem]">
                <FormButton
                    type={"button"}
                    disabled={isProcessing}
                    handleClick={handleCancel}
                >
                    <SquareX />
                </FormButton>
                <FormButton
                    disabled={isProcessing}
                    handleClick={() => { }}
                >
                    {
                        isProcessing ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Save />
                        )
                    }
                </FormButton>
            </div>
        </form>
    );
}