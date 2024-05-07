import React, { useContext, useState } from "react";
import AuthContext from "./authContext";
import noteContext from "../notes/noteContext";
import { authenticateUserAPI, getUserProfileAPI, loginUserAPI, signupUserAPI } from "../../utils/api-calls/auth";

const AuthState = (props) => {

    const { resetValues } = useContext(noteContext);

    // State variables ...

    // 1. For 'Remember Me' option shown while Login.
    // If rememberMe === true: token stored in the localstorage will remain as it is
    // Used and updated by component: Login.js
    const [rememberMe, setRememberMe] = useState(true);
    
    // 2. To store the user data of: Name, Email address, Account creation date.
    // When the user visits the profile section, an API call is made to fetch user data
    // This data is stored in the state variable
    // Used by component: Profile.js
    const [user, setUser] = useState(null);

    // 3. This state variable stores whether user is authenticated or not.
    // If isAuthenticated === false: User is unauthenticated and is redirected to HOME page, which shows features of the application
    // Its initial value is false. A `useEffect` hook is called to authenticate user in App.js and its value is set according to API response
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 4. This state is used for showing a `Spinner` while initial authenticatitoon is being done
    // This state is helpful in deciding whether to show spinner or not, inorder to provide a better user experience
    // Used by component: Home.js
    const [authencating, setAuthencating] = useState(true);


    // Methods ...

    // 1. To authenticate a user by the token already stored in local-storage
    // This method makes an API call only if token is present in local-storage
    // Called by component: App.js => (via 'useEffect' hook to fetch details of already logged-in user)

    const authenticateUser = async () => {
        let data = {
            success: true
        }
        
        if (localStorage.token) {
            // API Call
            data = await authenticateUserAPI();

            // Set the isAuthenticated state on basis of server response
            setIsAuthenticated(data.success);

            // logout user if token is invalid
            if(!data.success) {
                logoutUser();
            }
        }

        // Set the value of 'authenticating' state as an indication of completion of the authentication process
        setAuthencating(false);

        // Return the values to the caller so that the caller can decide which ALERT message to show.
        return {
            success: data.success,
            errors: data.errors
        };
    };


    // 2. To login a user given the user credentials: Email and Password => (as parameters to the arguement 'credentials')
    // Called by component: Login.js

    const loginUser = async (credentials) => {
        setAuthencating(true);

        // API call
        const data = await loginUserAPI(credentials);

        // Set the isAuthenticated state on basis of server response
        setIsAuthenticated(data.success);

        // Check the server-response
        if (data.success) {
            // Save the token in 'local-storage' on successful authentication
            localStorage.token = data.authToken;
        }

        setAuthencating(false);

        // Return the values to the caller so that the caller can decide which ALERT message to show.
        return {
            success: data.success,
            errors: data.errors
        };
    };


    // 3. To register a new user
    // This method takes 3 parameters: Name, Email, Password => (as parameters to the arguement 'credentials')
    // Called by component: Signup.js

    const signupUser = async (credentials) => {
        setAuthencating(true);

        // API call
        const data = await signupUserAPI(credentials);

        // Set the isAuthenticated state on basis of server response
        setIsAuthenticated(data.success);

        // Check the server-response
        if (data.success) {
            // Save the token in 'local-storage' on successful account creation
            localStorage.token = data.authToken;
        }

        setAuthencating(false);
        
        // Return the values to the caller so that the caller can decide which ALERT message to show.
        return {
            success: data.success,
            errors: data.errors
        };
    };


    // 4. To Logout a user
    // This method simply removes the token from local-storage
    // Called by component: Navbar.js

    const logoutUser = () => {
        // Removing the token from local-storage
        localStorage.removeItem("token");

        // Set the isAuthenticated state variable to `false` as an indication of successful LOGOUT
        setIsAuthenticated(false);

        // reset note values
        resetValues();
    };


    // 5. To fetch user profile data like: Name, Email address and Account creation date
    // This method is called when the user visits the '/profile' page.
    // Called by component: Profile.js

    const getUserProfile = async () => {
        // API Call
        const data = await getUserProfileAPI();

        // Set user state to store the user-data received from server
        setUser(data.user);

        // Return the values to the caller so that the caller can decide which ALERT message to show.
        return {
            success: data.success,
            errors: data.errors
        }
    };


    // 6. This method will toggle the value of 'rememberMe' state variable between `true` & `false`.
    // This is helpful while login to keep a track whether user wants the browser to retain his/her token in local-storage.
    // Inorder to implement above logic, this method will store an item 'removeToken' in local-storage with a value `true`, otherwise this item is removed from 'local-storage'.
    // This means, if 'removeToken' is present and its value is `true`, we can remove the token from local-storage while loading our application for the 1st time
    // When user visits the application, we check for 'removeToken' in local-storage and decide whether or not to remove the token.
    // Called by component: Login.js => (when user checks/unchecks the 'Remember Me' check-box)

    const toggleRememberMe = () => {
        if(rememberMe) {
            setRememberMe(false);
            localStorage.setItem("removeToken", true);
        } else {
            setRememberMe(true);
            localStorage.removeItem("removeToken");
        }
    };


    // 7. This method looks for 'removeToken' item in 'local-storage'
    // If it is found and its value is `true`, the 'token' and 'removeToken' are deleted from local-storage
    // So, user will feel as if his login is valid for only on browser-session.
    // Called by component: App.js => (via 'useEffect' hook for initial check)
    const removeToken = () => {
        if(localStorage.getItem("removeToken")) {
            localStorage.removeItem("removeToken");
            localStorage.removeItem("token");
        }
    };
 

    return (
        <AuthContext.Provider value={{ user, getUserProfile, authencating, isAuthenticated, authenticateUser, loginUser, signupUser, logoutUser, rememberMe, toggleRememberMe, removeToken }} >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthState;