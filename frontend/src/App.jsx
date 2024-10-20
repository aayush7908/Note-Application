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
import Navbar from './components/navbar/Navbar';
import Alert from './components/Alert';
import HomePage from './components/home/HomePage';
import LoginPage from './components/auth/login/LoginPage';
import RegisterPage from './components/auth/register/RegisterPage';
import NoteViewPage from './components/note/view/NoteViewPage';
import NoteEditPage from './components/note/edit/NoteEditPage';
import NoteCreatePage from './components/note/create/NoteCreatePage';
import AccountPage from './components/account/AccountPage';
import LogoutPage from './components/auth/logout/LogoutPage';
import AdminPage from './components/admin/AdminPage';
import NotFound from './components/NotFound';
import ForgotPasswordPage from './components/auth/forgot-password/ForgotPasswordPage';

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
								<Route exact path="/*" element={<NotFound />} />
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