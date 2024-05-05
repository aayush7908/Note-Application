import React, { useContext } from 'react';
import Notes from './Notes';
import authContext from '../context/auth/authContext';
import Spinner from './Spinner';
import themeContext from '../context/theme/themeContext';

export default function Home() {
    const { isAuthenticated, authencating } = useContext(authContext);
    const { themeColorPalette } = useContext(themeContext);

    return (
        <>
            {
                authencating ?
                (<Spinner label={"Authenticating"} />) :
                (isAuthenticated ?
                    (<div className="container my-3 w-100">
                        <Notes />
                    </div>) :
                    (<div className={`container py-3 text-${themeColorPalette.contrastMode}`}>
                        <div className="row">
                            <h2 className="">Welcome to iNotebook !!!</h2>
                            <p className="">The cutting-edge application designed to revolutionize the way you capture, organize, and access your thoughts, ideas, and inspirations. Whether you're a student, professional, or creative thinker, iNotebook is your ultimate digital companion, seamlessly blending functionality with simplicity to enhance your productivity and creativity.</p>
                        </div>
                        <div className={`row border border-3 rounded ${themeColorPalette.themeMode === "dark" ? "bg-dark border-primary" : "bg-light"} p-lg-5 p-3 my-3`}>
                            <div className="col-md-6">
                                <h4>Create, Modify and Delete notes</h4>
                                <p>You can create your personal notes and access them anywhere. <br />You can give Title and Tag to notes to keep everything sorted.</p>
                            </div>
                            <div className={`bg-secondary p-2 col-md-6 rounded`}>
                                <img src="images/notes.png" className="w-100 rounded" draggable="false" />
                            </div>
                        </div>
                        <div className={`row border border-3 rounded ${themeColorPalette.themeMode === "dark" ? "bg-dark border-primary" : "bg-light"} p-lg-5 p-3 my-3`}>
                            <div className={`bg-secondary p-2 col-md-6 rounded d-none d-md-block`}>
                                <img src="images/search.png" className="w-100 rounded" draggable="false" />
                            </div>
                            <div className="col-md-6">
                                <h4>Search your notes easily</h4>
                                <p>You can search your notes matching specific keywords by Title, Body or Tag.</p>
                            </div>
                            <div className={`bg-secondary p-2 col-md-6 rounded d-md-none`}>
                                <img src="images/search.png" className="w-100 rounded" draggable="false" />
                            </div>
                        </div>
                        <h4 className="mt-3 text-danger text-center">Please Login or Signup to continue ...</h4>
                    </div>))
            }
        </>
    );
};