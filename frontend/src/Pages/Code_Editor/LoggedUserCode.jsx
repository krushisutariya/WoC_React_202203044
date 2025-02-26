import React, { useState, useEffect } from "react";
import AiChatBot from "../../Components/Ai_Chat_Boat";
import Navbar from "../../Components/NavBar";
import FileStore from "./FileStore.jsx";
import Guest from "./Guest.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import axios from "axios";
const LoggedUserCode = () => {
  const { email } = useAuth();
  const { openfile, setOpenFile, defaultId,openname,setOpenname } = useAuth();
  const [fullScreen, setFullScreen] = useState(()=>{
    return localStorage.getItem("fullScreen")
    ? JSON.parse(localStorage.getItem("fullScreen"))
    : false;
  });

  useEffect(()=>{
   console.log("this is file store");
   console.log(email);
  });
   useEffect(() => {
      localStorage.setItem("fullScreen", fullScreen);
    }, [fullScreen]);
  
  const [showChat, setShowChat] = useState(false);
  const [mainLanguage,setMainLanguage]=useState(null);
  const {url} =useAuth();
 
  useEffect(() => {
  
    if (!openfile) setOpenFile(defaultId);
    const savedChatVisibility = localStorage.getItem("showChat");
    setShowChat(savedChatVisibility ? JSON.parse(savedChatVisibility) : false);
  }, [openfile]);

  useEffect(() => {
  

    if (!openname) setOpenFile("defaultFile");
    
  }, [openname]);

 
  useEffect(() => {


    const getLanguage = async () => {
      try {
        const { data } = await axios.get(`${url}/getLanguage`, { params: { id: openfile } });
        console.log("Fetched data:", data);
        setMainLanguage(data.language); 
        setOpenname(data.name);
       // Ensure you return the correct language
      } catch (error) {
        console.error("Error fetching language:", error);
      }
    };
  
    if (openfile&&openname) { 
      // Ensure id is not null/undefined before calling the function
      getLanguage();
    }
  }, [openfile,openname]); // Runs whenever `id` changes
  

  return (
    <div className="flex flex-col min-h-screen bg-[#E6E6FA] overflow-x-scroll md:overflow-x-auto">
    {/* Navbar */}
    <Navbar />

    {/* Fullscreen Toggle Button */}
    <div className="flex justify-end p-2 relative">
      {fullScreen ? (
        <MdFullscreenExit
          className="absolute top-1 left-1 cursor-pointer text-2xl mr-1 bg-[#662d91] rounded-lg text-gray-200 hover:text-white transition-all"
          onClick={() => setFullScreen(false)}
        />
      ) : (
        <MdFullscreen
          className="absolute  top-1 left-1 cursor-pointer text-2xl bg-[#662d91] rounded-lg text-gray-200 hover:text-white transition-all"
          onClick={() => setFullScreen(true)}
        />
      )}
    </div>

    {/* Main Content Grid */}
    <div className="flex flex-grow p-1 h-full">
      {/* Sidebar (FileStore) - Show only when not fullscreen */}
      {!fullScreen && (
        <div className="w-1/4 bg-gray-800 p-2 rounded-lg shadow-md m-2 overflow-y-auto">
          <FileStore email={email} />
        </div>
      )}

      {/* Main Content (Guest) */}
      <div
        className={`flex-grow bg-[#E6E6FA] shadow-md rounded-lg  h-full transition-all ${
          fullScreen ? "w-full" : "w-3/4"
        }`}
      >
        <Guest id={openfile} mainLanguage={mainLanguage}/>
      </div>
    </div>
  </div>
  );
};

export default LoggedUserCode;
