import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_API_KEY}>
    <AuthProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);
