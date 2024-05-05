import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import NoteState from './context/notes/NoteState';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import ThemeState from './context/theme/ThemeState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ThemeState>
    <NoteState>
      <AuthState>
        <AlertState>
          <App />
        </AlertState>
      </AuthState>
    </NoteState>
  </ThemeState>
  // </React.StrictMode>
);