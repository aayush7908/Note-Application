import React, { useContext, useEffect, useState } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route
} from "react-router-dom";
import { LoaderCircle } from 'lucide-react';

import './App.css';
import { authenticateUserService } from 'services/user'
import authContext from 'context/auth/authContext';
import alertContext from 'context/alert/alertContext';
import { getToken, removeToken } from 'utils/cookie'

import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import ForgotPasswordPage from 'pages/ForgotPasswordPage';
import NoteCreatePage from 'pages/NoteCreatePage';
import NoteViewPage from 'pages/NoteViewPage';
import NoteEditPage from 'pages/NoteEditPage';
import AccountPage from 'pages/AccountPage';
import LogoutPage from 'pages/LogoutPage';
import AdminPage from 'pages/AdminPage';
import NotFoundPage from 'pages/NotFoundPage';

import Navbar from 'components/navbar/Navbar';
import Alert from 'components/Alert';


function App() {
	
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const { authenticateUser, logoutUser } = useContext(authContext);
	const { createAlert } = useContext(alertContext);

	useEffect(() => {
		(async () => {
			if (getToken() === null) {
				return;
			}
			setIsAuthenticating(true);
			const { success, data, errors } = await authenticateUserService();
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
				<div className="h-full pt-[5rem] px-[1rem] md:px-[3rem] lg:px-[5rem]">
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
								<Route exact path="/auth/forgot-password" element={<ForgotPasswordPage />} />
								<Route exact path="/auth/logout" element={<LogoutPage />} />
								<Route exact path="/note/create" element={<NoteCreatePage />} />
								<Route exact path="/note/view/:id" element={<NoteViewPage />} />
								<Route exact path="/note/edit/:id" element={<NoteEditPage />} />
								<Route exact path="/account" element={<AccountPage />} />
								<Route exact path="/admin" element={<AdminPage />} />
								<Route exact path="/*" element={<NotFoundPage />} />
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