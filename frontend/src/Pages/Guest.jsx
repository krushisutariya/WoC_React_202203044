import React, { useState, useEffect } from "react";
import AiChatBot from "../Components/Ai_Chat_Boat";
import ai from "../assets/ai.png";
import Navbar from "../Components/NavBar";
import FileStore from "./Code_Editor/Filestore"

const Guest = () => {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const savedChatVisibility = localStorage.getItem("showChat");
    if (savedChatVisibility === null) {
      localStorage.setItem("showChat", JSON.stringify(false));
    } else {
      setShowChat(JSON.parse(savedChatVisibility));
    }
  }, []);

  const toggleChat = () => {
    setShowChat((prev) => {
      const newValue = !prev;
      localStorage.setItem("showChat", JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <div className="flex flex-col">
     
     <Navbar/>
   
   
     
      <div className="flex flex-col justify-center  items-center col-span-3 bg-white p-4">
        <h1 className="text-3xl font-bold mb-4 fixed">Welcome to the Guest Page</h1>
      </div>

    
      <div  className="fixed bottom-5 right-5 z-50 cursor-pointer" onClick={toggleChat}>
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

export default Guest;
