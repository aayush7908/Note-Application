import React, { useContext } from 'react';
import Notes from './Notes';
import authContext from '../context/auth/authContext';
import Spinner from './Spinner';

export default function Home() {
    const { isAuthenticated, authencating } = useContext(authContext);

    return (
        <>
            {
                authencating ?
                (<Spinner />) :
                (isAuthenticated ?
                    (<div className="container my-3">
                        <Notes />
                    </div>) :
                    (<div className="container my-3">
                        <h2 className="text-danger text-center">You are not authorized to view this page</h2>
                        <p className="text-danger text-center">Some features page.</p>
                        <p className="text-danger text-center">Some features page.</p>
                        <p className="text-danger text-center">Some features page.</p>
                        <p className="text-danger text-center">Some features page.</p>
                        <p className="text-danger text-center">Some features page.</p>
                    </div>))
            }
        </>
    );
};