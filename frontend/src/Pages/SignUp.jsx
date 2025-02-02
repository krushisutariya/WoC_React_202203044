import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import sign_up from "../assets/sign_up.png";
import "../animation.css";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../Components/Footer.jsx";
import Navbar from "../Components/NavBar.jsx";
import {useAuth} from "../Context/AuthContext"


import axios from "axios";
const SignUp = () => {
  const navigate = useNavigate();
  const {userLoggedIn, setuserLoggedIn,setEmail} = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  
  

  // Add a validation function
const validatePassword = (password) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
};

const submitHandler = async (event) => {
  event.preventDefault();
  setErrorMessage(""); // Clear previous error messages
  setEmail((email)=>formData.email);
  // Validate password
  if (!validatePassword(formData.password)) {
    setErrorMessage(
      "Password must contain at least 8 characters, including a letter, a number, and a special character (!@#$%^&*)."
    );
    return;
  }

  try {
    const response = await axios.post("http://localhost:3001/api/register", {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    // Handle success response
    console.log(response.data);
    if (response.data.message === "User registered successfully, and default file structure created.") {
      toast.success("Account has been created successfully!");
      navigate("/");
      setuserLoggedIn(true);
    } else if (response.data.message === "User registered, but error creating default file.") {
      setErrorMessage("User registered, but there was an issue creating the default file.");
      toast.error("There was an issue creating your default file.");
    } else {
      setErrorMessage(response.data.message);
      toast.error("User already registered with this email."); // Handle custom backend messages
    }
  } catch (error) {
    console.error("Error while creating account:", error);
    
   
    if (error.response) {
      setErrorMessage(error.response.data.message || "An error occurred.");
    } else {
      setErrorMessage("Unable to connect to the server. Please try again.");
    }

    toast.error("An error occurred while creating the account.");
  }
};





return (
  
  <>
    <div className="flex flex-col bg-[#E6E6FA]">
     <Navbar/>
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#E6E6FA] animate-fade-in">
      {userLoggedIn && <Navigate to={"/loggeduser"} replace={true} />}
      <div className="w-full md:w-1/2 p-8 text-center animate-slide-in-left">
        <h1 className="text-4xl font-bold text-[#213555] mb-4">Sign Up</h1>
        <div>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col text-left">
              <label className="text-[#33006F] font-medium mb-2">
                UserName<sup className="text-red-500">*</sup>
              </label>
              <input
                required
                type="text"
                name="username"
                value={formData.username}
                placeholder="Enter username"
                autoComplete="off" 
                onChange={changeHandler}
                className="w-full px-4 py-2 border border-[#D8C4B6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#720e9e] transition-transform duration-300 transform focus:scale-105"
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="text-[#33006F] font-medium mb-2 mt-2">
                Email Address <sup className="text-red-500">*</sup>
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter email address"
                autoComplete="off" 
                onChange={changeHandler}
                className="w-full px-4 py-2 border border-[#D8C4B6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#720e9e] transition-transform duration-300 transform focus:scale-105"
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="text-[#33006F] font-medium mb-2 mt-4">
                Password <sup className="text-red-500">*</sup>
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="Enter password"
                  onChange={changeHandler}
                  className="w-full px-4 py-2 border border-[#D8C4B6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#720e9e] transition-transform duration-300 transform focus:scale-105"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2/4 text-2xl right-3 transform -translate-y-2/4 cursor-pointer text-[#3E5879] transition-transform duration-200 hover:scale-110 active:scale-95"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#33006F] text-white rounded-lg hover:scale-105 hover:bg-[#3E5879] transition-transform duration-200 focus:outline-none mt-4"
              disabled={isRegistering}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>

           
          </form>
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="h-px w-1/4 bg-[#D8C4B6]"></div>
          <p className="px-2 text-[#3E5879]">OR</p>
          <div className="h-px w-1/4 bg-[#D8C4B6]"></div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 p-8 animate-slide-in-right">
        <img src={sign_up} alt="pattern" className="w-full h-auto rounded-lg" />
      </div>
    </div>
    <Footer/>
    </div>
    </>
  );
};

export default SignUp;
