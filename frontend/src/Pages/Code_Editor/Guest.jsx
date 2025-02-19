import React, { useState, useEffect } from "react";
import AiChatBot from "../../Components/Ai_Chat_Boat";
import ai from "../../assets/ai.png";
import Navbar from "../../Components/NavBar";
import { useAuth } from "../../Context/AuthContext";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { FaRegPlayCircle } from "react-icons/fa";
import { BiSave } from "react-icons/bi";
import { toast } from "react-toastify";
import * as monaco from "monaco-editor";
import { CiImport, CiExport } from "react-icons/ci";
import { TbTextWrapColumn } from "react-icons/tb";
import { IoTerminalOutline } from "react-icons/io5";
import Spinner from "react-bootstrap/Spinner";
import { useRef } from "react";


const Guest = ({ id, mainLanguage }) => {
  const { userLoggedIn, url, email, openname, setOpenname } = useAuth();
  const storageKey = userLoggedIn ? `loggedUser_${email}` : "explore_output";
  const [showChat, setShowChat] = useState(
    () => localStorage.getItem("showChat") === "true"
  );

  

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "javascript";
    
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("selectedTheme") || "vs-dark";
  });
  const [input, setInput] = useState(() => {
    return (
      localStorage.getItem("input") ||
      "Write your input here or you can drop file here"
    );
  });

  const [output, setOutput] = useState(() => {
    const storedData = localStorage.getItem(storageKey);
    try {
      return storedData
        ? JSON.parse(storedData).output
        : "This is your output text.";
    } catch (error) {
      return "This is your output text."; 
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ output }));
  }, [output]);

  const [dragOver, setDragOver] = useState(false);
  const [fullScreen, setFullscreen] = useState(() => {
    return localStorage.getItem("fullScreen")
      ? JSON.parse(localStorage.getItem("fullScreen"))
      : false;
  });
  const [wrap, setWrap] = useState(() => {
    return localStorage.getItem("wrap")
      ? JSON.parse(localStorage.getItem("wrap"))
      : false;
  });

  // Store `id` in localStorage when it changes
  const languageversion = {
    javascript: {
      version: "18.15.0",
      default: `console.log("Hello, World!");`,
    },
    c: {
      version: "10.2.0",
      default: `#include <stdio.h>
  int main() {
      printf("Hello, World!");
      return 0;
  }`,
    },
    cpp: {
      version: "10.2.0",
      default: `#include <iostream>
  using namespace std;
  
  int main() {
      cout << "Hello, World!" << endl;
      return 0;
  }`,
    },
    java: {
      version: "15.0.2",
      default: `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }`,
    },
    typescript: {
      version: "5.0.3",
      default: `console.log("Hello, World!");`,
    },
    python: {
      version: "3.10.0",
      default: `print("Hello, World!")`,
    },
    go: {
      version: "1.16.2",
      default: `package main
  
  import "fmt"
  
  func main() {
      fmt.Println("Hello, World!")
  }`,
    },
    kotlin: {
      version: "1.8.20",
      default: `fun main() {
      println("Hello, World!")
  }`,
    },
    csharp: {
      version: "6.12.0",
      default: `using System;
  
  class Program {
      static void Main() {
          Console.WriteLine("Hello, World!");
      }
  }`,
    },
    perl: {
      version: "5.36.0",
      default: `print "Hello, World!\n";`,
    },
    php: {
      version: "8.2.3",
      default: `<?php
  echo "Hello, World!";
  ?>`,
    },
    ruby: {
      version: "3.0.1",
      default: `puts "Hello, World!"`,
    },
    rust: {
      version: "1.68.2",
      default: `fn main() {
      println!("Hello, World!");
  }`,
    },
    swift: {
      version: "5.3.3",
      default: `import Swift
  
  print("Hello, World!")`,
    },
    shell: {
      version: "5.0.0",
      default: `echo "Hello, World!"`,
    },
  };


  const [content, setContent] = useState(() => {
    const savedLanguage = localStorage.getItem("language") || "javascript";
    return localStorage.getItem(`content-${savedLanguage}`) || getDefaultContent(savedLanguage);
  });

  


  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchFileContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${url}/getContent`, {
          params: { id },
        });
        console.log(res.data);
        setOpenname(res.data.name || "");
        setContent(res.data.content || ""); // Default to an empty string if content is undefined
      } catch (err) {
        setError("Failed to fetch file content.");
        console.error("Error fetching file content:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userLoggedIn) {
      fetchFileContent();
    } else {
    }

    const savedChatVisibility = localStorage.getItem("showChat");
    setShowChat(savedChatVisibility ? JSON.parse(savedChatVisibility) : false);
  }, [id]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setInput(e.target.result);
      reader.readAsText(file);
    }
  };

  const openFilePicker = () => {
    document.getElementById("fileInput").click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) readFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });

    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "output.txt"; // Name of the file to be downloaded

    // Trigger a click event to download the file
    link.click();
  };

  const toggleChat = () => {
    setShowChat((prev) => {
      localStorage.setItem("showChat", !prev);
      return !prev;
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${url}/updateFileContent`, {
        id,
        language,
        content,
      });

      toast.success("File saved successfully!");
    } catch (err) {
      toast.error("Failed to save file.");
      console.error("Error saving file:", err);
    }
  };


  
 
  

 
  

  useEffect(() => {
    // Save id to localStorage when it changes
    if (id) {
      localStorage.setItem("id", id);
    }
  }, [id]);

  useEffect(() => {
    // If `id` remains the same, set language to `mainLanguage`
    const currId = localStorage.getItem("id");
    if (currId === id && mainLanguage) {
      setLanguage(mainLanguage);
    }
  }, [id, mainLanguage]);

  useEffect(() => {
    localStorage.setItem("showChat", showChat);
  }, [showChat]);

  const handleCodeFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target.result);
      reader.readAsText(file);
    }
  };
  useEffect(() => {
    setOpenname(openname);
  }, [openname]);



  // Function to handle file export
  const handleCodeFileDownload = () => {
    let extension;
    switch (language) {
      case "javascript":
        extension = "js";
        break;
      case "c":
        extension = "c";
        break;
      case "cpp":
        extension = "cpp";
        break;
      case "java":
        extension = "java";
        break;
      case "typescript":
        extension = "ts";
        break;
      case "python":
        extension = "py";
        break;
      case "go":
        extension = "go";
        break;
      case "kotlin":
        extension = "kt";
        break;
      case "csharp":
        extension = "cs";
        break;
      case "perl":
        extension = "pl";
        break;
      case "php":
        extension = "php";
        break;
      case "ruby":
        extension = "rb";
        break;
      case "rust":
        extension = "rs";
        break;
      case "swift":
        extension = "swift";
        break;
      case "shell":
        extension = "sh";
        break;
      default:
        extension = "txt";
    }

    // Use the provided openname or default to 'default'
    const fileName = openname
      ? `${openname}.${extension}`
      : `default.${extension}`;

    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName; // Set the file openname with the appropriate extension
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const runcode = async () => {
    try {
      setIsRunning(true);
      console.log(language);
      console.log(languageversion[language]?.version);
      console.log(content);
      console.log(input);

      const response = await fetch(`${url}/executeCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          version: languageversion[language]?.version, // Sending only the version string
          code: content, // Code from your editor
          input, // If you have input for the program
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.error) {
        setOutput(data.error);
      } else {
        setOutput(data.output);
      }

      setIsRunning(false);
    } catch (error) {
      setOutput("Error executing code.");
    }
  };
 

  const getDefaultContent = (lang) => {
    return languageversion[lang]?.default || "";
  };
  
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
  
    if (!userLoggedIn) {
      // Store current content for previous language
      localStorage.setItem(`content-${language}`, content);
    } else {
      // Store content based on id and language
      const fileKey = `${id}-${language}`;
      localStorage.setItem(`content-${fileKey}`, content);
    }
  };
  
  // Effect to load content when language changes
  useEffect(() => {
    if (!userLoggedIn) {
      const savedContent = localStorage.getItem(`content-${language}`);
      setContent(savedContent || getDefaultContent(language));
    } else {
      const fileKey = `${id}-${language}`;
      const savedContent = localStorage.getItem(`content-${fileKey}`);
      setContent(savedContent || getDefaultContent(language));
    }
  }, [language, userLoggedIn, id]);
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "javascript";
    setLanguage(savedLanguage);
  
    if (!userLoggedIn) {
      const savedContent = localStorage.getItem(`content-${savedLanguage}`);
      setContent(savedContent || getDefaultContent(savedLanguage));
    } else {
      const fileKey = `${id}-${savedLanguage}`;
      const savedContent = localStorage.getItem(`content-${fileKey}`);
      setContent(savedContent || getDefaultContent(savedLanguage));
    }
  }, [userLoggedIn, id]);
  
  const handleEditorChange = (newValue) => {
    setContent(newValue);
  
    if (!userLoggedIn) {
      localStorage.setItem(`content-${language}`, newValue);
    } else {
      const fileKey = `${id}-${language}`;
      localStorage.setItem(`content-${fileKey}`, newValue);
    }
  };
  
  
  

  useEffect(() => {
    localStorage.setItem("wrap", JSON.stringify(wrap));
  }, [wrap]);

  useEffect(() => {
    if (!userLoggedIn) {
      localStorage.setItem("selectedTheme", theme);
    }
  }, [theme, userLoggedIn]);
  useEffect(() => {
    localStorage.setItem("fullScreen", JSON.stringify(fullScreen));
  }, [fullScreen]);

  useEffect(() => {
    localStorage.setItem("input", input);
  }, [input]);

  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      setOutput(JSON.parse(storedData).output);
    }
  }, [userLoggedIn, email]);

  return (
    <div
      className={`grid grid-rows-[auto_auto_1fr_auto] grid-cols-1 box-border bg-[#E6E6FA] max-h-[70%]`}
    >
      {/*grid grid-rows-[auto_1fr_auto] min-h-screen box-border bg-[#E6E6FA]*/}
      {/*grid grid-rows-[auto_auto_1fr_auto] grid-cols-1  box-border bg-[#E6E6FA] max-h-[70%]*/}
      {!userLoggedIn && (
        <div className="top-0 right-0  mb-2">
          <Navbar />
        </div>
      )}
<div className="flex flex-wrap items-center justify-between px-6 bg-gray-900 shadow-md gap-4">
  {/* Left Section - User Name & Language Selector */}
  <div className={`flex items-center gap-4 rounded-lg ${userLoggedIn ? "p-2" : "p-3"}`}>
    {/* Terminal Icon */}
    <div
      onClick={() => {
        setFullscreen(!fullScreen);
      }}
      className={`text-white border-gray-700 bg-gray-800 focus:border-white focus:outline-none ${
        userLoggedIn ? "text-lg md:text-xl" : "text-xl md:text-2xl"
      }`}
    >
      <IoTerminalOutline className={`${userLoggedIn ? "text-2xl" : "text-4xl"}`} />
    </div>

    {/* User Name Display */}
    {!openname && <Spinner animation="border" variant="secondary" size="sm" />}
    {userLoggedIn && (
      <span className={`font-semibold bg-gray-800 text-white ${userLoggedIn ? "text-xs md:text-sm" : "text-sm md:text-base lg:text-lg"}`}>
        {openname}
      </span>
    )}

    {/* Language Selection Dropdown */}
    <select
      value={language}
      onChange={handleLanguageChange}
      className={`border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:border-white focus:outline-none ${
        userLoggedIn ? "text-xs p-1" : "md:p-2"
      }`}
    >
      {Object.entries(languageversion).map(([key, { version }]) => (
        <option key={key} value={key}>
          {key.charAt(0).toUpperCase() + key.slice(1)} ({version})
        </option>
      ))}
    </select>
  </div>

  {/* Center Section - Run & Save Buttons */}
  <div className="flex flex-wrap items-center gap-4">
    <button
      disabled={isRunning}
      onClick={runcode}
      className={`flex items-center gap-2 bg-gray-700 text-white shadow-md hover:bg-blue-600 transition rounded-3xl ${
        userLoggedIn ? "px-3 py-1 text-xs sm:px-4 sm:py-1 sm:text-sm" : "px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg"
      }`}
    >
      {isRunning ? (
        <>
          <Spinner animation="border" variant="secondary" size="sm" />
          <span className="text-xs">Running</span>
        </>
      ) : (
        <>
          <FaRegPlayCircle className={`${userLoggedIn ? "text-base" : "text-lg sm:text-xl"}`} />
          <span>Run</span>
        </>
      )}
    </button>

    {userLoggedIn && (
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 bg-gray-700 text-white shadow-md hover:bg-blue-600 transition rounded-3xl ${
          userLoggedIn ? "px-3 py-1 text-xs sm:px-4 sm:py-1 sm:text-sm" : "px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg"
        }`}
      >
        <BiSave className={`${userLoggedIn ? "text-base" : "text-lg sm:text-xl"}`} />
        <span>Save</span>
      </button>
    )}
  </div>

  {/* Right Section - Theme & Enable Wrapping */}
  <div className="flex flex-wrap items-center gap-4">
    {/* Theme Dropdown */}
    <select
      className={`border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:border-white focus:outline-none ${
        userLoggedIn ? "text-xs p-1" : "md:p-2"
      }`}
      value={theme}
      onChange={(e) => {
        setTheme(e.target.value);
        localStorage.setItem("selectedTheme", e.target.value);
      }}
    >
      <option value="vs-dark">Dark Theme</option>
      <option value="vs-light">Light Theme</option>
      <option value="hc-black">High Contrast</option>
    </select>

    {/* Enable Wrapping Button */}
    <button
      onClick={() => setWrap(!wrap)}
      className={`flex items-center gap-2 border-2 border-gray-700 rounded-lg bg-gray-800 text-white focus:border-white focus:outline-none ${
        userLoggedIn ? "text-xs p-1" : "md:p-2"
      }`}
    >
      <TbTextWrapColumn className={`${userLoggedIn ? "text-xm" : "text-lg sm:text-xl"}`} />
      {!wrap ? <span>Enable Wrapping</span> : <span>Disable Wrapping</span>}
    </button>
  </div>
</div>


      {/* Upper Section - Code Editor (75%) */}
      <div className={`p-2 relative ${fullScreen ? "h-[80vh]" : "h-[55vh]"}`}>
        <input
          type="file"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleCodeFileUpload} // Handle file selection
          accept=".js, .cpp, .java, .py, .ts, .go, .kt, .cs, .pl, .php, .rb, .rs, .swift, .sh" // Optional file type restriction
        />

        <p
          className="rounded-lg absolute z-10 text-white cursor-pointer hover:text-white-300 top-4 right-4 bg-[#662d91] p-2 flex items-center justify-center transition-all duration-200"
          onClick={() => document.getElementById("file-upload").click()} // Trigger file input
        >
          <CiImport className="text-1xl font-bold" />
        </p>
        <p
          className="rounded-lg absolute z-10 text-white top-4 right-14 bg-[#662d91] cursor-pointer hover:text-white-300 p-2 flex items-center justify-center transition-all duration-200"
          onClick={handleCodeFileDownload}
        >
          <CiExport className="text-1xl font-bold" />
        </p>

        <Editor
          height="100%"
          width="100%"
          language={language}
          theme={theme}
          value={content}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            fontFamily: "Jetbrains-Mono",
            fontLigatures: true,
            wordWrap: wrap,
            minimap: {
              enabled: false,
            },
            bracketPairColorization: {
              enabled: true,
            },
            cursorBlinking: "expand",
            formatOnPaste: true,
            suggest: {
              showFields: false,
              showFunctions: false,
            },
          }}
        />
      </div>
      {!fullScreen && (
        <div className="grid grid-cols-2 box-border gap-2 h-[25vh] bg-gray-800 border-gray-700  ">
          {/* Input Section */}
          <div
            className="flex flex-col p-2  border-4 border-gray-700"
            style={{ scrollbarWidth: "none", overflow: "auto" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-white">Input</h2>
              <p
                className="flex text-white items-center gap-2 cursor-pointer text-gray-300 hover:text-white"
                onClick={openFilePicker}
              >
                Import <CiImport size={20} />
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              id="fileInput"
              type="file"
              accept=".txt,.json,.csv,.md"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Drag & Drop Area */}
            <textarea
              className={`w-full h-full p-3 border rounded-lg transition bg-gray-900 text-white resize-none focus:outline-none ${
                dragOver ? "border-white" : "border-gray-600"
              } focus:border-white`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              placeholder="Drag & drop a file here or type..."
              style={{ scrollbarWidth: "none", overflow: "auto" }}
            />
          </div>

          {/* Output Section */}
          <div
            className="flex flex-col p-2  border-4 border-gray-700"
            style={{ scrollbarWidth: "none", overflow: "auto" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-2 ">
              <h2 className="text-lg font-semibold text-white">Output</h2>
              <p
                className="flex text-white items-center gap-2 cursor-pointer  hover:text-white"
                onClick={handleDownload}
              >
                Export <CiExport size={20} />
              </p>
            </div>

            {/* Output Container */}
            <div
              className="h-full p-3 bg-gray-900 text-white rounded-lg border border-gray-00 "
              style={{ scrollbarWidth: "none", overflow: "auto" }}
            >
              <pre className="whitespace-pre-wrap ">
                {loading ? "Running..." : output}
              </pre>
            </div>
          </div>
        </div>
      )}

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

export default Guest;
