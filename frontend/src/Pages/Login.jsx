import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../Components/Footer.jsx";
import Navbar from "../Components/NavBar.jsx";
import wel_come_back from "../assets/wel_come_back.png";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { userLoggedIn, setuserLoggedIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("email") ? true : false
  );
  const [showPassword, setShowPassword] = useState(false);
  const changeHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (localStorage.getItem("email")) {
      setFormData((prev) => ({
        ...prev,
        email: localStorage.getItem("email"),
      }));
    }
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("http://localhost:3001/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log(result.data);
      if (result.data == "Success") {
        toast.success("Welcome back");
        setuserLoggedIn(!userLoggedIn);
        console.log(userLoggedIn);
        if (rememberMe) {
          localStorage.setItem("email", formData.email);
        } else {
          localStorage.removeItem("email");
        }
      } else {
        toast.error(result.data);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Server error occurred");
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/guest"} replace={true} />}
      <div className="flex flex-col bg-gray-100">
        <Navbar className="w-full" />
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#F5EFE7] animate-fade-in">
          <div className="w-full md:w-1/2 p-8 text-center animate-slide-in-left">
            <h1 className="text-4xl font-bold text-[#213555] mb-4">Login</h1>
            <form onSubmit={submitHandler}>
              <div className="flex flex-col text-left">
                <label className="text-[#213555] font-medium mb-2">
                  Email Address <sup className="text-red-500">*</sup>
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter email address"
                  onChange={changeHandler}
                  className="w-full px-4 py-2 border border-[#D8C4B6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213555] transition-transform duration-300 transform focus:scale-105"
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-[#213555] font-medium mb-2 mt-4">
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
                    className="w-full px-4 py-2 border border-[#D8C4B6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213555] transition-transform duration-300 transform focus:scale-105"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2/4 text-2xl right-3 transform -translate-y-2/4 cursor-pointer text-[#3E5879] transition-transform duration-200 hover:scale-110 active:scale-95"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

               <div className="flex justify-between">

              <label className="flex items-center text-[#3E5879] mt-4">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember Me
              </label>

              <button className="flex items-center text-[#3E5879] mt-4 hover:underline" onClick={()=>navigate("/forgotpassword")}>
                Forgot password?{" "}
              </button>
               </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#213555] text-white rounded-lg hover:scale-105 hover:bg-[#3E5879] transition-transform duration-200 focus:outline-none mt-4"
              >
                Log in
              </button>

              <p className="mt-4 text-sm text-center text-[#3E5879]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#213555] ml-2 font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
          <div className="hidden md:block md:w-1/2 p-8 animate-slide-in-right">
            <img
              src={wel_come_back}
              alt="pattern"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
