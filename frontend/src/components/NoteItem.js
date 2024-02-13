import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";
import alertContext from '../context/alert/alertContext';
import themeContext from "../context/theme/themeContext";

export default function NoteItem(props) {
    const { note, showEditNoteModal, showMaximizeNoteModal, setMaximizedNoteValue } = props;
    const { deleteNote } = useContext(noteContext);
    const { createAlert } = useContext(alertContext);
    const { themeColorPalette } = useContext(themeContext);

    const handleMaximizeBtn = () => {
        setMaximizedNoteValue({
            title: note.title,
            description: note.description,
            tag: note.tag
        })
        showMaximizeNoteModal();
    };

    const handleDeleteBtn = async () => {
        const { success, errors } = await deleteNote(note._id);
        if(success) createAlert("success", "Note Deleted");
        else createAlert("danger", errors[0]);
    };

    const handleEditBtn = () => {
        showEditNoteModal(note);
    };

    return (
        <div className="col-md-4 my-2">
            <div className={`card bg-${themeColorPalette.themeMode} border-glow`}>
                <div className="card-body">
                    <span className={`badge rounded-pill bg-${themeColorPalette.themeMode === "light" ? "danger" : "success"} mb-3`}>{note.tag}</span>
                    <i className="fa-solid fa-expand float-end mx-2 option" onClick={handleMaximizeBtn} title="Maximize"></i>
                    <i className="fa-solid fa-trash-can float-end mx-2 option" onClick={handleDeleteBtn} title="Delete Note"></i>
                    <i className="fa-solid fa-pen-to-square float-end mx-2 option" onClick={handleEditBtn} title="Edit Note"></i>
                    <input className={`card-title fs-4 fw-bold d-block bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`} value={note.title} style={{ width: "100%", overflow: "hidden", border: "0px" }} title={note.title} disabled />
                    <textarea className={`card-text bg-${themeColorPalette.themeMode} text-${themeColorPalette.contrastMode}`} value={note.description} style={{ width: "100%", overflow: "hidden", border: "0px" }} rows={10} title="Maximize to view on full screen" disabled></textarea>
                    <p className="card-text text-secondary">Last Modified: {(new Date(note.date)).toDateString()}</p>
                </div>
            </div>
        </div>
    );
};