import React, { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { LoaderCircle } from "lucide-react";
import Note from "./Note";
import { getAllNotesAPI } from "../../utils/api-calls/note"
import authContext from "../../context/auth/authContext";
import alertContext from "../../context/alert/alertContext";

export default function NoteInfiniteScroll() {

    const [notes, setNotes] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
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
        if (inView && notes.length < user.totalNotes) {
            (async () => {
                const fetchedData = await fetchFunction();
                let newNotes = [...notes];
                newNotes = newNotes.concat(fetchedData);
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
                    <div className="flex gap-[0.5rem] justify-center items-center mt-[1rem]">
                        <span className="text-xl font-medium">No Notes Found</span>
                    </div>
                )
            }
            {
                notes.length < user.totalNotes && (
                    <div
                        ref={ref}
                        className="flex gap-[0.5rem] justify-center items-center mt-[1rem]"
                    >
                        <LoaderCircle className="animate-spin" />
                        <span>Loading More Data ...</span>
                    </div>
                )
            }
        </>
    );
}