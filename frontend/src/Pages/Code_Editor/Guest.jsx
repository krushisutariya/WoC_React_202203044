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
import { THEMES, registerThemes } from "./themes";
import { CiImport, CiExport } from "react-icons/ci";

const Guest = ({ id }) => {
  const themeOptions = Object.keys(THEMES);
  const [showChat, setShowChat] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("my-dark-theme");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("This is your output text.");
  const { userLoggedIn } = useAuth();

  useEffect(() => {
    if (!id && !userLoggedIn) {
      setContent("console.log('How are you?');");
    }

    if (!id) {
      return;
    }

    if (userLoggedIn) {
      const fetchFileContent = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await axios.get("http://localhost:3001/file/getContent", {
            params: { id },
          });
          console.log(res.data);
          setName(res.data.name || "");
          setContent(res.data.content || ""); // Default to an empty string if content is undefined
        } catch (err) {
          setError("Failed to fetch file content.");
          console.error("Error fetching file content:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchFileContent();
    }
    else 
    {
      
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

  const handleDownload = () => {
    // Create a Blob from the output content
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
      const newValue = !prev;
      localStorage.setItem("showChat", JSON.stringify(newValue));
      return newValue;
    });
  };

  const editorOption = {};

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    console.log("Selected theme:", selectedTheme);

    if (monaco && monaco.editor) {
      monaco.editor.setTheme(selectedTheme);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:3001/file/updateFileContent", {
        id,
        content,
      });

      toast.success("File saved successfully!");
    } catch (err) {
      toast.error("Failed to save file.");
      console.error("Error saving file:", err);
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    if (monaco) {
      console.log("Monaco editor is available, setting theme...");
      registerThemes(); // Ensure themes are registered first
      monaco.editor.setTheme(theme); // Then apply the selected theme
    }
  }, [theme]);

  const handleCodeFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target.result);
      reader.readAsText(file);
    }
  };

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

    // Use the provided name or default to 'default'
    const fileName = name ? `${name}.${extension}` : `default.${extension}`;

    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName; // Set the file name with the appropriate extension
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };



  const handleRunCode = async () => {
    try {
      console.log(language);
      console.log(content);
      const response = await axios.post("http://localhost:3001/file/runCode", {
        language,
        content,
      });
      
      console.log(response.data.output);

      setOutput(response.data.output);
    } catch (error) {
      console.log(error);
      setOutput("Error running code");
    }
  };



  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Navbar */}
      {!userLoggedIn && (
        <div className="top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      )}

      {/* Upper Section - Full Width Editor */}
  <div className="flex items-center justify-between px-6 py-3 bg-gray-100 shadow-md">
  {/* Left Section - User Name */}
  <div className="text-lg font-semibold text-gray-800">
    {userLoggedIn && <span>{name}</span>}
  </div>

  {/* Center Section - Language & Theme Selectors */}
  <div className="flex items-center gap-4">
    {/* Language Dropdown */}
    <select
      className="p-2 border rounded-md bg-white shadow-sm focus:outline-none"
      value={language}
      onChange={handleLanguageChange}
    >
      <option value="javascript">JavaScript</option>
      <option value="c">C</option>
      <option value="cpp">C++</option>
      <option value="java">Java</option>
      <option value="typescript">TypeScript</option>
      <option value="python">Python</option>
      <option value="go">Go</option>
      <option value="kotlin">Kotlin</option>
      <option value="csharp">C#</option>
      <option value="perl">Perl</option>
      <option value="php">PHP</option>
      <option value="ruby">Ruby</option>
      <option value="rust">Rust</option>
      <option value="swift">Swift</option>
      <option value="shell">Bash</option>
    </select>

    {/* Theme Dropdown */}
    <select
      className="p-2 border rounded-md bg-white shadow-sm focus:outline-none"
      value={theme}
      onChange={handleThemeChange}
    >
      {Object.keys(THEMES).map((themeKey) => (
        <option key={themeKey} value={themeKey}>
          {themeKey.replace("-", " ")}
        </option>
      ))}
    </select>
  </div>

  {/* Right Section - Buttons */}
  <div className="flex items-center gap-3">
    {/* Run Button */}
    <button   onClick={handleRunCode} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
      <FaRegPlayCircle className="text-lg" />
      <span>Run</span>
    </button>

    {/* Save Button (Visible only if logged in) */}
    {userLoggedIn && (
      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
      >
        <BiSave className="text-lg" />
        <span>Save</span>
      </button>
    )}

    {/* Code File Upload */}
    <input
      type="file"
      accept=".txt,.js,.ts,.json,.html,.css"
      onChange={handleCodeFileUpload}
      className="hidden"
      id="file-upload"
    />
    <label
      htmlFor="file-upload"
      className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition"
    >
      Import Code
    </label>

    {/* Export Code Button */}
    <button
      onClick={handleCodeFileDownload}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
    >
      Export Code
    </button>
  </div>
</div>

      
     


      <div className="h-screen grid grid-rows-[60%_40%]">
      {/* Upper Section - Code Editor (75%) */}
      <div className="p-4">
        <Editor
          height="100%"
          width="100%"
          language={language}
          theme={theme}
          value={content}
          onChange={(newValue) => setContent(newValue)}
        />
      </div>

      {/* Lower Section - Input & Output (25%) */}
      <div className="grid grid-cols-2 border-t">
        {/* Input Section */}
        <div className="p-4 border-r flex flex-col">
          <div className="flex justify-between">
          <h2 className="font-semibold mb-2">Input</h2>
          <p className="flex items-center gap-2 cursor-pointer" onClick={openFilePicker}>
            Import <CiImport />
          </p>
          </div>
          <input
            id="fileInput"
            type="file"
            accept=".txt,.json,.csv,.md"
            className="hidden"
            onChange={handleFileUpload}
          />
          <textarea
            className="w-full h-full p-2 border rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Output Section */}
        <div className="p-4 flex flex-col">
          <div className="flex justify-between">
          <h2 className="font-semibold mb-2">Output</h2>
          <p className="flex items-center gap-2 cursor-pointer" onClick={handleDownload}>
            Export <CiExport />
          </p>
          </div>
          <div className="border rounded p-2 flex-grow">
            <div>{loading ? "Running..." : output}</div>
          </div>
        </div>
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

export default Guest;
