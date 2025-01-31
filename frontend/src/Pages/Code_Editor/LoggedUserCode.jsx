import React, { useState, useEffect } from "react";
import AiChatBot from "../../Components/Ai_Chat_Boat";
import ai from "../../assets/ai.png";
import Navbar from "../../Components/NavBar";
import FileStore from "./FileStore.jsx";
import OpenFile from "./OpenFile.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";
import Guest from "./Guest.jsx";
const LoggedUserCode = () => {
  const { email } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const { openfile, setOpenFile, defaultId } = useAuth();




  useEffect(() => {
    
    if (!openfile) {
      setOpenFile(defaultId);
    }
    const savedChatVisibility = localStorage.getItem("showChat");
    if (savedChatVisibility === null) {
      localStorage.setItem("showChat", JSON.stringify(false));
    } else {
      setShowChat(JSON.parse(savedChatVisibility));
    }
  }, [openfile]);

 

  const toggleChat = () => {
    setShowChat((prev) => {
      const newValue = !prev;
      localStorage.setItem("showChat", JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <div className="flex flex-col">
      <Navbar />

      <div className="grid grid-cols-3 gap-4 h-screen">
        {/* FileStore takes 1/3 of the width */}
        <div className="col-span-1 bg-[#5D8AA8] p-4">
          <FileStore email={email} />
        </div>

        {/* OpenFile takes 2/3 of the width */}
        <div className="col-span-2 p-4">
          <Guest id={openfile} />
        </div>
      </div>

      

      <div
        className="fixed bottom-5 right-5 z-50 cursor-pointer"
        onClick={toggleChat}
      >
        <img
          src={ai}
          alt="Chat with AI"
          style={{ width: "60px", height: "60px" }}
        />
      </div>

      {showChat && (
        <div className="fixed bottom-20 right-5 w-72 h-96 bg-white shadow-lg rounded-lg overflow-hidden z-[1000]">
          <AiChatBot showChat={showChat} setShowChat={setShowChat} />
        </div>
      )}
    </div>
  );
};

export default LoggedUserCode;
