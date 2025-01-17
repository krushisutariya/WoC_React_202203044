import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='354613386619-49v9s6ehkks7qndjefqot4dni4dmoenq.apps.googleusercontent.com'>
    <AuthProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);
