import React, { useState } from "react";
import ThemeContext from "./themeContext";

const NoteState = (props) => {
    const lightTheme = {
        themeMode: "light",
        backgroundColor: "white",
        contrastMode: "dark"
    };

    const darkTheme = {
        themeMode: "dark",
        backgroundColor: "black",
        contrastMode: "light"
    };

    const [themeColorPalette, setThemeColorPalette] = useState(lightTheme);

    const toggleTheme = () => {
        if (themeColorPalette.themeMode === "light") {
            setThemeColorPalette(darkTheme);
            document.body.style.backgroundColor = darkTheme.backgroundColor;
            localStorage.setItem("iNotebookTheme", "dark");
        } else {
            setThemeColorPalette(lightTheme);
            document.body.style.backgroundColor = lightTheme.backgroundColor;
            localStorage.setItem("iNotebookTheme", "light");
        }
    };

    const detectThemeOnLoad = () => {
        if(localStorage.getItem("iNotebookTheme") === "dark") {
            setThemeColorPalette(darkTheme);
            document.body.style.backgroundColor = darkTheme.backgroundColor;
        }
        else if(localStorage.getItem("iNotebookTheme") === "light") {
            setThemeColorPalette(lightTheme);
            document.body.style.backgroundColor = lightTheme.backgroundColor;
        }
        else if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setThemeColorPalette(darkTheme);
            document.body.style.backgroundColor = darkTheme.backgroundColor;
        }
    };

    return (
        <ThemeContext.Provider value={{ themeColorPalette, toggleTheme, detectThemeOnLoad }}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export default NoteState;