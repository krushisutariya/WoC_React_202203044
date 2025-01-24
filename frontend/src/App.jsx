import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Guest from "./Pages/Guest.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import ResetPassword from "./Pages/ResetPassword/ResetPassword.jsx";
import OtpVerification from "./Pages/ResetPassword/Otpverification.jsx";
import ForgotPassword from "./Pages/ResetPassword/ForgotPassword.jsx";
import LoggedUserCode from "./Pages/Code_Editor/LoggedUserCode.jsx";
function App() {

  return (
    <div>
      <ToastContainer position="top-center"/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="/resetpassword" element={<ResetPassword/>}/>
        <Route path="/otpverification" element={<OtpVerification/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/loggeduser" element={<LoggedUserCode/>}/>
      </Routes>
    </div>
  );
}

export default App;
