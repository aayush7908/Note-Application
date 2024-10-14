import './App.css';
import React, { useContext, useEffect, useState } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route
} from "react-router-dom";
import { LoaderCircle } from 'lucide-react';
import authContext from './context/auth/authContext';
import alertContext from './context/alert/alertContext';
import { authenticateUserAPI } from './utils/api-calls/user'
import { getToken, removeToken } from './utils/cookie/cookie-utils'
import Navbar from './components/Navbar';
import Alert from './components/Alert';
import HomePage from './components/home/HomePage';
import LoginPage from './components/auth/login/LoginPage';
import RegisterPage from './components/auth/register/RegisterPage';

function App() {

	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const { authenticateUser, logoutUser } = useContext(authContext);
	const { createAlert } = useContext(alertContext);

	useEffect(() => {
		(async () => {
			if(getToken() === null) {
				return;
			}
			setIsAuthenticating(true);
			const { success, data, errors } = await authenticateUserAPI();
			if (success) {
				authenticateUser(data);
			} else {
				removeToken();
				logoutUser();
				createAlert("danger", errors[0]);
			}
			setIsAuthenticating(false);
		})();
	}, []);

	return (
		<>
			<Router>
				<Navbar />
				<div className="h-full pt-[5rem] px-[1rem] md:px-[2rem]">
					{
						isAuthenticating ? (
							<div className="flex justify-center items-center gap-[0.5rem]">
								<LoaderCircle className="size-[3rem] animate-spin" />
							</div>
						) : (
							<Routes>
								<Route exact path="/" element={<HomePage />} />
								<Route exact path="/auth/login" element={<LoginPage />} />
								<Route exact path="/auth/register" element={<RegisterPage />} />
								{/* <Route exact path="/about" element={<About />} />
								<Route exact path="/forgot-password" element={<ForgotPassword />} />
								<Route exact path="/reset-password" element={<ResetPassword />} />
								<Route exact path="/login" element={<Login />} />
								<Route exact path="/signup" element={<Signup />} />
								<Route exact path="/profile" element={<Profile />} />
								<Route exact path="/admin" element={<Admin />} />
								<Route exact path="/*" element={<NotFound />} /> */}
							</Routes>
						)
					}
				</div>
				<Alert />
			</Router>
		</>
	);
}

export default App;