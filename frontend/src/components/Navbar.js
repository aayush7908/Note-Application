import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authContext from '../context/auth/authContext';
import themeContext from '../context/theme/themeContext';
import noteContext from '../context/notes/noteContext';
import alertContext from '../context/alert/alertContext';

export default function Navbar() {
    const location = useLocation();
    let navigate = useNavigate();
    let isNavbarOpen = false;
    const [searchText, setSearchText] = useState("");
    const { modifyForSearch } = useContext(noteContext);
    const { isAuthenticated, logoutUser } = useContext(authContext);
    const { themeColorPalette, toggleTheme } = useContext(themeContext);
    const { createAlert } = useContext(alertContext);

    const handleLogout = () => {
        logoutUser();
        setSearchText("");
        navigate("/");
    };

    const controlThemeVisibility = () => {
        toggleTheme();
    };

    const handleNavbarToggler = () => {
        if (!isNavbarOpen) {
            document.body.addEventListener("click", collapseNavbar);
        }
    };

    const handleOnChangeSearchText = (event) => {
        setSearchText(event.target.value);
    };

    const handleSearchBtn = async () => {
        const { errors } = await modifyForSearch(searchText);
        if (errors) createAlert("danger", errors);
    };

    const collapseNavbar = (event) => {
        if (event.target.id !== "navbar-toggler" && event.target.id !== "searchField") {
            if (!isNavbarOpen) {
                isNavbarOpen = true;
                document.getElementById("navbar-toggler").click();
            } else {
                isNavbarOpen = false;
                document.getElementById("navbar-toggler").click();
                document.body.removeEventListener("click", collapseNavbar);
            }
        }
    };

    const searchFieldFocus = () => {
        document.getElementById("collapsibleSearchField").classList.remove("text-center");
        document.getElementById("collapsibleSearchField").classList.add("form-control");
        document.getElementById("collapsibleSearchField").value = searchText;
        document.getElementById("searchDiv").classList.remove("translate-middle-x");
        document.getElementById("searchDiv").classList.remove("position-absolute");
        document.getElementById("searchDiv").classList.remove("start-50");
        document.getElementById("searchDiv").classList.add("w-100");
        document.getElementById("searchDiv").classList.add("justify-content-center");
        document.getElementById("searchBtn").classList.remove("d-none");
    };

    const searchFieldBlur = () => {
        document.getElementById("collapsibleSearchField").classList.add("text-center");
        document.getElementById("collapsibleSearchField").classList.remove("form-control");
        document.getElementById("searchDiv").classList.remove("justify-content-center");
        document.getElementById("searchDiv").classList.remove("w-100");
        document.getElementById("searchDiv").classList.add("translate-middle-x");
        document.getElementById("searchDiv").classList.add("position-absolute");
        document.getElementById("searchDiv").classList.add("start-50");
        document.getElementById("searchBtn").classList.add("d-none");
    };

    return (
        <nav className={`navbar fixed-top navbar-expand-lg navbar-${themeColorPalette.themeMode} bg-${themeColorPalette.themeMode} shadow-sm`}>
            <div className="container-fluid">
                <Link className="navbar-brand ps-2" to="/">
                    <img src="images/logo.png" draggable="false" style={{ width: "50px" }} />
                    <span>iNotebook</span>
                </Link>
                <div className="btn-group">
                    <div className="theme-toggle mx-2 my-1 d-lg-none">
                        <i className={`fa-solid fa-sun text-light bg-dark p-2 rounded-circle theme ${themeColorPalette.themeMode === "light" ? "d-none" : ""}`} id="light" onClick={controlThemeVisibility} title="Switch to Light Mode"></i>
                        <i className={`fa-solid fa-moon bg-light p-2 rounded-circle theme ${themeColorPalette.themeMode === "dark" ? "d-none" : ""}`} id="dark" onClick={controlThemeVisibility} title="Enable Dark Mode"></i>
                    </div>
                    <button className="navbar-toggler" type="button" onClick={handleNavbarToggler}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <button className="d-none" id="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"></button>
                </div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                        </li>
                    </ul>
                    {
                        isAuthenticated && (
                            <div className="position-absolute start-50 translate-middle-x px-5 d-none d-lg-flex" id="searchDiv" onFocus={() => { searchFieldFocus() }} onBlur={() => { setTimeout(searchFieldBlur, 500) }}>
                                <input
                                    type="text"
                                    className={`rounded-pill px-3 py-2 border-0 text-center text-${themeColorPalette.contrastMode}`}
                                    id="collapsibleSearchField"
                                    placeholder="Search"
                                    style={{ backgroundColor: themeColorPalette.backgroundColor }}
                                    value={searchText}
                                    onChange={handleOnChangeSearchText}
                                />
                                <button className="btn btn-secondary d-none ms-2 rounded-pill" type="button" id="searchBtn" onClick={handleSearchBtn}>Search</button>
                            </div>
                        )
                    }
                    <div className="theme-toggle mx-2 d-none d-lg-block">
                        <i className={`fa-solid fa-sun text-light bg-dark p-2 rounded-circle theme ${themeColorPalette.themeMode === "light" ? "d-none" : ""}`} id="light" onClick={controlThemeVisibility} title="Switch to Light Mode"></i>
                        <i className={`fa-solid fa-moon bg-light p-2 rounded-circle theme ${themeColorPalette.themeMode === "dark" ? "d-none" : ""}`} id="dark" onClick={controlThemeVisibility} title="Enable Dark Mode"></i>
                    </div>
                    {
                        isAuthenticated ? (
                            <>
                                <div className="d-flex">
                                    <div className="mx-2 mt-1 d-none d-lg-block">
                                        <h3 data-bs-toggle="dropdown" aria-label="profile icon" aria-expanded="false" role="button"><i className={`fa-solid fa-circle-user text-${themeColorPalette.contrastMode} option navbar-profile-icon`}></i></h3>
                                        <ul className={`dropdown-menu ${themeColorPalette.themeMode === "dark" ? "dropdown-menu-dark" : ""} dropdown-menu-end m-2 bg-${themeColorPalette.themeMode}`}>
                                            <li><Link className="dropdown-item" to="/profile">Show Profile</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><Link className="dropdown-item" to="/" onClick={handleLogout}>Logout <i className="fa-solid fa-arrow-right-from-bracket ms-2"></i></Link></li>
                                        </ul>
                                    </div>
                                    <div className="d-lg-none">
                                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                            <li className="nav-item">
                                                <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">Show Profile</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/" onClick={handleLogout}>Logout <i className="fa-solid fa-arrow-right-from-bracket ms-2"></i></Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="d-lg-none">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li className="nav-item">
                                            <div className="input-group my-3">
                                                <input type="text" className="form-control" placeholder="Search Notes" value={searchText} id="searchField" onChange={handleOnChangeSearchText} />
                                                <span className="input-group-text" onClick={handleSearchBtn}>
                                                    <i className="fa-solid fa-search"></i>
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="d-flex justify-content-center">
                                <Link className={`btn btn-${themeColorPalette.themeMode === "light" ? "primary" : "success"} mx-1`} id="login" to="/login">Login</Link>
                                <Link className={`btn btn-${themeColorPalette.themeMode === "light" ? "danger" : "primary"} mx-1`} id="signup" to="/signup">Signup</Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </nav>
    );
};