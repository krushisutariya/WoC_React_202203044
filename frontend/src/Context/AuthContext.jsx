import React, { createContext, useState, useContext } from "react";

// Create a context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [userLoggedIn, setuserLoggedIn] = useState(""); // Shared variable
  const [email,setEmail]=useState("");
  const [otp, setOtp] = useState();
  return (
    <AuthContext.Provider value={{ userLoggedIn, setuserLoggedIn,email,setEmail,otp, setOtp}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
