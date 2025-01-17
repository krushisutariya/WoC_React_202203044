import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImCross } from "react-icons/im";
import { FaFaceSmileBeam } from "react-icons/fa6";

const AiChatBot = ({ showChat, setShowChat }) => {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Retrieve showChat and conversation state from localStorage on page load
  useEffect(() => {
    const savedChatVisibility = localStorage.getItem("showChat");
    const savedConversation = localStorage.getItem("conversation");

    if (savedChatVisibility !== null) {
      setShowChat(JSON.parse(savedChatVisibility));
    }

    if (savedConversation) {
      setConversation(JSON.parse(savedConversation));
    }
  }, []);

  // Save showChat and conversation state to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("showChat", JSON.stringify(showChat));
  }, [showChat]);

  useEffect(() => {
    localStorage.setItem("conversation", JSON.stringify(conversation));
  }, [conversation]);

  const hideAi = () => {
    setShowChat(false); // Only close the chat
  };

  async function getAnswer() {
    if (!question.trim()) return;
    setIsThinking(true);

    setConversation((prev) => [...prev, { sender: "user", text: question }]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse =
        response?.data?.candidates[0]?.content?.parts[0]?.text ||
        "No response available.";
      setConversation((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error fetching the answer:", error);
      setConversation((prev) => [
        ...prev,
        { sender: "ai", text: "An error occurred. Please try again." },
      ]);
    } finally {
      setIsThinking(false);
      setQuestion(""); // Clear the input
    }
  }

  return (
    showChat && (
      <div className="flex flex-col h-full p-4 bg-gray-100">
        {/* Close Button */}
        <div className="flex justify-between rounded-lg bg-blue-500 text-white py-2 px-2 mb-2">
          Hi, I am here to help you........{" "}
          <FaFaceSmileBeam className="text-[#FFD65A]" />
          <ImCross className="cursor-pointer" onClick={hideAi} />
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto bg-white shadow-md rounded-md p-4 space-y-2">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <span className="px-4 py-2 bg-gray-200 rounded-lg animate-pulse">
                Thinking...
              </span>
            </div>
          )}
        </div>

        {/* Input Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getAnswer();
          }}
          className="mt-4 flex"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
            disabled={isThinking}
          >
            Send
          </button>
        </form>
      </div>
    )
  );
};

export default AiChatBot;
