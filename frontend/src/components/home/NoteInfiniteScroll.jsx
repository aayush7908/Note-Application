import React, { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Note from "./Note";
import { getAllNotesAPI } from "../../utils/api-calls/note"
import authContext from "../../context/auth/authContext";
import alertContext from "../../context/alert/alertContext";
import Loader from "../Loader";
import DataNotFound from "../DataNotFound";

export default function NoteInfiniteScroll() {

    const [notes, setNotes] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalNotes, setTotalNotes] = useState(1);
    const { user } = useContext(authContext);
    const { createAlert } = useContext(alertContext);
    const { ref, inView } = useInView();

    const fetchFunction = async () => {
        const { success, data, errors } = await getAllNotesAPI(pageNumber, "");
        if (success) {
            return data;
        }
        createAlert("danger", errors[0]);
        return [];
    }

    useEffect(() => {
        if (inView && notes.length < totalNotes) {
            (async () => {
                const fetchedNotes = await fetchFunction();
                if (pageNumber === 0 && fetchedNotes.length > 0) {
                    setTotalNotes(fetchedNotes[0].totalNotes);
                }
                let newNotes = [...notes];
                newNotes = newNotes.concat(fetchedNotes);
                setNotes(newNotes);
                setPageNumber(pageNumber => pageNumber + 1);
            })();
        }
    }, [inView]);

    return (
        <>
            {
                notes.length > 0 ? (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-[2rem]">
                        {
                            notes.map((note, index) => {
                                return (
                                    <Note key={index} note={note} />
                                )
                            })
                        }
                    </div>
                ) : (
                    <DataNotFound />
                )
            }
            {
                notes.length < totalNotes && (
                    <div ref={ref}>
                        <Loader />
                    </div>
                )
            }
        </>
    );
}