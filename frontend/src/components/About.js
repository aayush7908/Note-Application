import React, { useContext } from 'react';
import themeContext from "../context/theme/themeContext";

export default function About() {

    const { themeColorPalette } = useContext(themeContext);

    return (
        <>
            <div className={`text-${themeColorPalette.contrastMode} pb-3`}>
                <h2>About Us:</h2>
                <p>Welcome to iNotebook, your ultimate digital companion for organizing thoughts, ideas, and inspirations seamlessly. Designed with simplicity and efficiency in mind, iNotebook offers a sophisticated yet intuitive platform to capture, manage, and share your notes effortlessly.</p>
                <p>At iNotebook, we understand the importance of having a reliable tool to keep pace with your dynamic lifestyle. Whether you're jotting down meeting minutes, brainstorming creative projects, or simply making a to-do list, iNotebook empowers you to stay organized and productive anytime, anywhere.</p>
                <p>Our commitment to innovation drives us to continually enhance the iNotebook experience. With features like customizable notebooks, seamless syncing across devices, and intuitive search functionality, we strive to provide you with a streamlined note-taking experience that adapts to your needs.</p>
                <p>Security and privacy are paramount at iNotebook. Your data is encrypted and stored securely, ensuring that your ideas remain confidential and accessible only to you.</p>
                <p>Join the millions of users who trust iNotebook to capture their thoughts and ideas with ease. Whether you're a student, professional, or creative enthusiast, iNotebook is the perfect companion to help you unlock your potential and turn inspiration into action.</p>
                <p>Experience the power of organized creativity with iNotebook today. Welcome to a world where your ideas are limitless, and your productivity knows no bounds.</p>
            </div>
            <div className="d-lg-block d-none fixed-bottom text-center m-3 text-secondary">
                <h5>Made with ❤️ by Aayush Dalal. Copyright &copy; {(new Date()).getFullYear()}</h5>
            </div>
            <div className="d-md-none text-center m-3 text-secondary pb-3">
                <h5>Made with ❤️ by Aayush Dalal. Copyright &copy; {(new Date()).getFullYear()}</h5>
            </div>
        </>
    );
};