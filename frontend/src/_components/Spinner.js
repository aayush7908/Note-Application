import React, { useContext } from 'react';
import themeContext from '../context/theme/themeContext';

export default function Spinner(props) {
    const { themeColorPalette } = useContext(themeContext);

    return (
        <>
            <div className="d-flex justify-content-center align-items-center m-3">
                <span className={`spinner-border text-${themeColorPalette.contrastMode} spinner-border-sm mx-2`} role="status" aria-hidden="true"></span>
                <span className={`text-${themeColorPalette.contrastMode}`}>{props.label}</span>
            </div>
        </>
    );
};