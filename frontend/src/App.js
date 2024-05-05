import './App.css';
import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Alert from './components/Alert';
import authContext from './context/auth/authContext';
import Profile from './components/Profile';
import themeContext from './context/theme/themeContext';
import NotFound from './components/NotFound';
import alertContext from './context/alert/alertContext';

function App() {
  const { authenticateUser, removeToken } = useContext(authContext);
  const { detectThemeOnLoad } = useContext(themeContext);
  const { createAlert } = useContext(alertContext);

  useEffect(() => {
    (async () => {
      detectThemeOnLoad();
      removeToken();
      const response = await authenticateUser();
      if(!response.success) {
        createAlert("danger", response.errors[0]);
      }
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Router>
        <Navbar divID={"body"} />
        <div className="container my-5 h-100 w-100" id="body">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/*" element={<NotFound />} />
          </Routes>
        </div>
        <Alert />
      </Router>
    </>
  );
}

export default App;