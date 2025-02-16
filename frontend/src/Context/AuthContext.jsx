import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {

  
   const url=`http://localhost:3001`;
  //const url=`https://code-ide-backend-5yjb.onrender.com`;

  const [userLoggedIn, setuserLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem("userLoggedIn");
    return savedUser === "true";
  });
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [otp, setOtp] = useState(() => localStorage.getItem("otp") || "");

  
 
    const [rootId, setrootId] = useState(null);
    const [defaultId, setdefaultId]=useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [openfile, setOpenFile] = useState(() => {
      return localStorage.getItem("openfile") || null; // Use stored value or default
    });
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

  useEffect(()=>{
    localStorage.setItem("openfile", openfile);
  })

  return (
    <AuthContext.Provider
      value={{ url,userLoggedIn, setuserLoggedIn, email, setEmail, otp, setOtp ,rootId, setrootId,refreshTrigger, setRefreshTrigger,defaultId, setdefaultId,openfile,setOpenFile}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
