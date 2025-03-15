import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getNoteService } from "services/note";
import alertContext from "context/alert/alertContext";

import Loader from "components/Loader";
import DataNotFound from "components/DataNotFound";
import NoteForm from "components/note/NoteForm";

export default function NoteEditPage() {

    const [note, setNote] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { createAlert } = useContext(alertContext);
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            setIsProcessing(true);
            const { success, data, errors } = await getNoteService(id);
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
                                <NoteForm note={note} />
                            )
                        }
                    </>
                )
            }
        </>
    );
}