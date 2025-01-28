import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage or set default values
  const [userLoggedIn, setuserLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem("userLoggedIn");
    return savedUser === "true"; // Convert string to boolean
  });
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [otp, setOtp] = useState(() => localStorage.getItem("otp") || "");

  // Persist `userLoggedIn`, `email`, and `otp` to localStorage on change
  useEffect(() => {
    localStorage.setItem("userLoggedIn", userLoggedIn);
  }, [userLoggedIn]);

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("otp", otp);
  }, [otp]);

  return (
    <AuthContext.Provider
      value={{ userLoggedIn, setuserLoggedIn, email, setEmail, otp, setOtp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
