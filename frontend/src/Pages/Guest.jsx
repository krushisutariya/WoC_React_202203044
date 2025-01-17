import React, { useState, useEffect } from "react";
import AiChatBot from "../Components/Ai_Chat_Boat";
import ai from "../assets/ai.png";

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
    <div>
      <h1>Welcome to the Guest Page</h1>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          cursor: "pointer",
        }}
        onClick={toggleChat}
      >
        <img src={ai} alt="Chat with AI" style={{ width: "60px", height: "60px" }} />
      </div>
      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "#fff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "10px",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <AiChatBot showChat={showChat} setShowChat={setShowChat} />
        </div>
      )}
    </div>
  );
};

export default Guest;
