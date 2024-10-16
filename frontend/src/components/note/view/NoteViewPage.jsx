import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNoteAPI } from "../../../utils/api-calls/note";
import alertContext from "../../../context/alert/alertContext";
import Note from "./Note";
import Loader from "../../Loader";
import DataNotFound from "../../DataNotFound";

export default function NoteViewPage() {

    const [note, setNote] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { createAlert } = useContext(alertContext);
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            setIsProcessing(true);
            const { success, data, errors } = await getNoteAPI(id);
            if (success) {
                setNote(data);
            } else {
                createAlert("danger", errors[0]);
            }
            setIsProcessing(false);
        })();
    }, []);

    return (
        <>
            {
                isProcessing ? (
                    <Loader />
                ) : (
                    <>
                        {
                            note === null ? (
                                <DataNotFound />
                            ) : (
                                <Note note={note} />
                            )
                        }
                    </>
                )
            }
        </>
    );
}