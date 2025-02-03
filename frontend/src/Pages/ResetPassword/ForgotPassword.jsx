import React from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../../Components/NavBar";
import Footer from "../../Components/Footer";
const ForgotPassword = () => {
  const { email, setEmail, setOtp} = useAuth();
  const navigate = useNavigate();
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
 const {url} =useAuth();
  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString(); 
  }


  const submitHandler = (event) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    console.log(email);
    navigate("/otpverification");

    const newOTP = generateOTP();
    setOtp(newOTP);
    console.log("Generated OTP:", newOTP);
  
    axios
      .post(`${url}/send_recovery_email`, {
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
    <div className="flex flex-col gap-10 bg-gray-100">
       <Navbar/>
    <div className="flex items-center justify-center mt-5 mb-5 ">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-[#33006F] text-center mb-6">
          Forgot Password
        </h1>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#33006F]"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#33006F] text-white font-semibold rounded-lg hover:bg-[#662d91] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </div>
  );
};
export default ForgotPassword;
