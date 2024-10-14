import React, { useContext } from 'react';
import themeContext from "../context/theme/themeContext";

export default function NotFound() {

    const { themeColorPalette } = useContext(themeContext);

    return (
        <>
            <div className={`text-${themeColorPalette.contrastMode} text-center d-grid align-middle pb-3`}>
                <div className="text-center">
                    <img src="./images/no-notes.webp" className="inline-block" draggable="false" />
                </div>
                <div className="text-center">
                    <h1>404</h1>
                    <h1>Page Not Found !!!</h1>
                </div>
            </div>
        </>
    );
};