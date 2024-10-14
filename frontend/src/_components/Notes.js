import React, { useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import NoteItem from './NoteItem';
import noteContext from '../context/notes/noteContext';
import alertContext from '../context/alert/alertContext';
import Spinner from './Spinner';
import themeContext from '../context/theme/themeContext';

export default function Notes() {
    const [isExtraAddNoteBtnVisible, setIsExtraAddNoteBtnVisible] = useState(false);
    const [editNoteValue, setEditNoteValue] = useState({ title: "", description: "", tag: "" });
    const [addNoteValue, setAddNoteValue] = useState({ title: "", description: "", tag: "" });
    const [maximizedNoteValue, setMaximizedNoteValue] = useState({ title: "", description: "", tag: "" });
    const [saving, setSaving] = useState(false);
    const { totalNotes, fetchingNotes, notes, getAllNotes, addNote, editNote, searchText } = useContext(noteContext);
    const { createAlert } = useContext(alertContext);
    const { themeColorPalette } = useContext(themeContext);
    const refForEditNote = useRef(null);
    const refForAddNote = useRef(null);
    const refForMaximizeNote = useRef(null);

    const onChangeOfEditNote = (event) => {
        setEditNoteValue({ ...editNoteValue, [event.target.name]: event.target.value });
    };

    const onChangeOfAddNote = (event) => {
        setAddNoteValue({ ...addNoteValue, [event.target.name]: event.target.value });
    };

    const handleEditBtn = async () => {
        setSaving((saving) => { return true; });
        const { success, errors } = await editNote(editNoteValue._id, editNoteValue.title, editNoteValue.description, editNoteValue.tag);
        setSaving((saving) => { return false; });
        if (success) {
            createAlert("success", "Note Saved");
            refForEditNote.current.click();
        } else {
            createAlert("danger", errors[0]);
        }
    };

    const handleAddNoteBtn = async () => {
        setSaving((saving) => { return true; });
        const { success, errors } = await addNote(addNoteValue.title, addNoteValue.description, addNoteValue.tag);
        setSaving((saving) => { return false; });
        if (success) {
            createAlert("success", "Note Added");
            refForAddNote.current.click();
        } else {
            createAlert("danger", errors[0]);
        }
    };

    const showEditNoteModal = (currentNote) => {
        refForEditNote.current.click();
        setEditNoteValue(currentNote);
    };

    const showAddNoteModal = () => {
        refForAddNote.current.click();
        setAddNoteValue({ title: "", description: "", tag: "" });
    };

    const showMaximizeNoteModal = () => {
        refForMaximizeNote.current.click();
    };

    const fetchMoreData = () => {
        getAllNotes();
    };

    const handleExtraAddNoteBtnVisibility = () => {
        if (window.scrollY > 200) setIsExtraAddNoteBtnVisible(true);
        else if (window.scrollY <= 200) setIsExtraAddNoteBtnVisible(false);
    };

    // const showAllNotes = () => {}

    useEffect(() => {
        getAllNotes();
        window.addEventListener("scroll", handleExtraAddNoteBtnVisibility);
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {/* Modal for EDIT-NOTE option */}
            <button type="button" ref={refForEditNote} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#editNoteModal"></button>
            <div className="modal fade" id="editNoteModal" tabIndex="-1" aria-labelledby="editNoteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className={`modal-content text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode}`}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="editNoteModalLabel">Edit Your Note</h5>
                            <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input type="text" className={`form-control text-${themeColorPalette.contrastMode}`} id="title" name="title" value={editNoteValue.title} onChange={onChangeOfEditNote} style={{ backgroundColor: themeColorPalette.backgroundColor }} disabled={saving} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea className={`form-control text-${themeColorPalette.contrastMode}`} id="description" rows="10" name="description" value={editNoteValue.description} onChange={onChangeOfEditNote} style={{ backgroundColor: themeColorPalette.backgroundColor }} disabled={saving}></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tag" className="form-label">Tag</label>
                                <input type="text" className={`form-control text-${themeColorPalette.contrastMode}`} id="tag" name="tag" value={editNoteValue.tag} onChange={onChangeOfEditNote} style={{ backgroundColor: themeColorPalette.backgroundColor }} maxLength={10} disabled={saving} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={saving}>Close</button>
                            <button type="button" className={`btn btn-${themeColorPalette.themeMode === "light" ? "primary" : "success"}`} onClick={handleEditBtn} disabled={editNoteValue.title.length < 3 || editNoteValue.description.length < 5 || saving}>
                                {
                                    saving ? "Saving..." : "Save Note"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal for ADD-NOTE option */}
            <button type="button" ref={refForAddNote} className="btn btn-danger d-none" data-bs-toggle="modal" data-bs-target="#addNoteModal"></button>
            <div className="modal fade" id="addNoteModal" tabIndex="-1" aria-labelledby="addNoteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className={`modal-content text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode}`}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="addNoteModalLabel">Add a new note</h5>
                            <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input type="text" className={`form-control text-${themeColorPalette.contrastMode}`} id="title" name="title" value={addNoteValue.title} onChange={onChangeOfAddNote} style={{ backgroundColor: themeColorPalette.backgroundColor }} disabled={saving} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea className={`form-control text-${themeColorPalette.contrastMode}`} id="description" rows="10" name="description" value={addNoteValue.description} onChange={onChangeOfAddNote} style={{ backgroundColor: themeColorPalette.backgroundColor }} disabled={saving}></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tag" className="form-label">Tag</label>
                                <input type="text" className={`form-control text-${themeColorPalette.contrastMode}`} id="tag" name="tag" value={addNoteValue.tag} onChange={onChangeOfAddNote} style={{ backgroundColor: themeColorPalette.backgroundColor }} maxLength={10} disabled={saving} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={saving}>Close</button>
                            <button type="button" className={`btn btn-${themeColorPalette.themeMode === "light" ? "primary" : "success"}`} onClick={handleAddNoteBtn} disabled={addNoteValue.title.length < 3 || addNoteValue.description.length < 5 || saving}>
                                {
                                    saving ? "Saving..." : "Add Note"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal for MAXIMIZE-NOTE option */}
            <button type="button" ref={refForMaximizeNote} className="btn btn-danger d-none" data-bs-toggle="modal" data-bs-target="#maximizeNoteModal"></button>
            <div className="modal fade" id="maximizeNoteModal" tabIndex="-1" aria-labelledby="maximizeNoteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                    <div className={`modal-content text-${themeColorPalette.contrastMode} bg-${themeColorPalette.themeMode}`}>
                        <div className="modal-header text-break">
                            <span className={`badge rounded-pill bg-${themeColorPalette.themeMode === "light" ? "danger" : "success"}`}>{maximizedNoteValue.tag}</span>
                            <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-break p-5">
                            <div>
                                <h3>{maximizedNoteValue.title}</h3>
                                <pre>
                                    {maximizedNoteValue.description}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`w-100 my-3 text-${themeColorPalette.contrastMode}`}>
                <h3><i className="fa-solid fa-file-circle-plus mx-3 float-end option" title="Create new note" onClick={showAddNoteModal}></i></h3>
                {
                    searchText ? (
                        <h3>
                            Search Results for "{searchText}":
                            {/* <i className="fa-solid fa-reply-all float-end option" title="Show All Notes" onClick={showAllNotes}></i> */}
                        </h3>
                    ) : (
                        <h3>Your Notes:</h3>
                    )
                }
                {
                    fetchingNotes ?
                        (<Spinner label={"Fetching Notes"} />) :
                        (notes.length === 0 ?
                            (
                                <div className="text-center">
                                    <img src="images/no-notes.webp" className="img-fluid" draggable="false" />
                                    <h2 className="text-danger">No notes found !!!</h2>
                                </div>
                            ) : (
                                <InfiniteScroll
                                    dataLength={notes.length}
                                    next={fetchMoreData}
                                    hasMore={totalNotes > notes.length}
                                    loader={<Spinner label={"Fetching More Notes"} />}
                                >
                                    <div className="row w-100 my-3">
                                        {notes.map((element) => {
                                            return (
                                                <NoteItem key={element._id} note={element} showEditNoteModal={showEditNoteModal} showMaximizeNoteModal={showMaximizeNoteModal} setMaximizedNoteValue={setMaximizedNoteValue} />
                                            )
                                        })}
                                    </div>
                                </InfiniteScroll>
                            )
                        )
                }
                <h1>
                    <i className={`fa-sharp fa-solid fa-circle-plus position-fixed bottom-0 end-0 m-3 ${isExtraAddNoteBtnVisible ? "show fade" : "hide fade"} option`} id="extraAddNoteBtn" title="Create new note" onClick={showAddNoteModal}></i>
                </h1>
            </div>
        </>
    );
};