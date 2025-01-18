import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { email } = useAuth();

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const changePassword = (event) => {
    event.preventDefault();

    if (!validatePassword(password)) {
     
      toast.error("Password must contain at least 8 characters, including a letter, a number, and a special character (!@#$%^&*).")
      return;
    }

    
    axios
      .post("http://localhost:3001/resetpassword", {
        // Corrected the API endpoint
        email: email,
        newPassword: password,
      })
      .then((response) => {
        console.log("Password changed successfully:", response.data.message);
        toast.success("Password changed successfully!");
      })
      .catch((error) => {
        console.error(
          "Error changing password:",
          error.response?.data?.message || error.message
        );
        toast.error("Error changing password. Please try again.");
      });
  };

  return (
    <div className="flex flex-col bg-gray-100 gap-10">
      <Navbar/>

      <div className="flex items-center justify-center mb-5 mt-5 ">
      <div className="bg-white p-8 shadow-xl rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Change Password
        </h2>
        <form onSubmit={changePassword} className="space-y-6">
          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg text-gray-800 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
    
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
    
      <Footer/>
    </div>
  );
};

export default ResetPassword;
