import React from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const { email, setEmail } = useAuth();
  const navigate = useNavigate();
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);


   const [otp, setOtp] = useState();
  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  }



  
    
  
  const submitHandler = (event) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    console.log(email);
    navigate("/otpverification");

    const newOTP = generateOTP();
    setOtp(newOTP);
    console.log("Generated OTP:", newOTP);
  
    axios
      .post("http://localhost:3001/send_recovery_email", {
        recipient_email: email,
        OTP: newOTP,
      })
      .then((result) => {
        console.log("Email sent response:", result);
        toast.success("A new OTP has been sent to your email.");
      })
      .catch((error) => {
        console.error("Error in OTP request:", error);
        toast.error("Failed to send OTP. Please try again.");
      });
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit"> Send OTP</button>
      </form>
    </div>
  );
};
export default ForgotPassword;
