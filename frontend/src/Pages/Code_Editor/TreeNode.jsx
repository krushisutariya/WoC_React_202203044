import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdDelete } from "react-icons/md";
import { FaRegFolderOpen, FaEdit, FaRegFolder } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import {
  FaJsSquare,
  FaJava,
  FaPython,
  FaMicrosoft,
  FaPhp,
  FaRust,
  FaSwift,
} from "react-icons/fa";
import { TbBrandJavascript } from "react-icons/tb";
import { FaCuttlefish } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { SiKotlin } from "react-icons/si";
import { SiRuby } from "react-icons/si";
import { FaFile } from "react-icons/fa";

const TreeNode = ({
  node,
  onAddNewItem,
  onDeleteItem,
  userId,
  setFileStructure,
}) => {
  

  const languageversion = {
    javascript: {
      version: "18.15.0",
      default: `console.log("Hello, World!");`,
      icon: <TbBrandJavascript style={{ color: "#F7DF1E" }} />, // Yellow
    },
    c: {
      version: "10.2.0",
      default: `#include <stdio.h>
      int main() {
          printf("Hello, World!");
          return 0;
      }`,
      icon: <FaCuttlefish style={{ color: "#A8B9CC" }} />, // Light blue
    },
    cpp: {
      version: "10.2.0",
      default: `#include <iostream>
      using namespace std;
      
      int main() {
          cout << "Hello, World!" << endl;
          return 0;
      }`,
      icon: <FaCuttlefish style={{ color: "#00599C" }} />, // Blue
    },
    java: {
      version: "15.0.2",
      default: `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }}`,
      icon: <FaJava style={{ color: "#007396" }} />, // Java Blue
    },
    typescript: {
      version: "5.0.3",
      default: `console.log("Hello, World!");`,
      icon: <FaJsSquare style={{ color: "#3178C6" }} />, // TypeScript Blue
    },
    python: {
      version: "3.10.0",
      default: `print("Hello, World!")`,
      icon: <FaPython style={{ color: "#3776AB" }} />, // Python Blue
    },
    go: {
      version: "1.16.2",
      default: `package main
      import "fmt"
      func main() {
          fmt.Println("Hello, World!")
      }`,
      icon: <FaGoogle style={{ color: "#00ADD8" }} />, // Go Blue
    },
    kotlin: {
      version: "1.8.20",
      default: `fun main() {
      println("Hello, World!")
      }`,
      icon: <SiKotlin style={{ color: "#F18E33" }} />, // Kotlin Orange
    },
    csharp: {
      version: "6.12.0",
      default: `using System;
      class Program {
          static void Main() {
              Console.WriteLine("Hello, World!");
          }
      }`,
      icon: <FaMicrosoft style={{ color: "#68217A" }} />, // C# Purple
    },
    perl: {
      version: "5.36.0",
      default: `print "Hello, World!\n";`,
      icon: <FaCuttlefish style={{ color: "#39457E" }} />, // Perl Blue
    },
    php: {
      version: "8.2.3",
      default: `<?php
      echo "Hello, World!";
      ?>`,
      icon: <FaPhp style={{ color: "#777BB4" }} />, // PHP Purple
    },
    ruby: {
      version: "3.0.1",
      default: `puts "Hello, World!"`,
      icon: <SiRuby style={{ color: "#CC342D" }} />, // Ruby Red
    },
    rust: {
      version: "1.68.2",
      default: `fn main() {
      println!("Hello, World!");
      }`,
      icon: <FaRust style={{ color: "#DEA584" }} />, // Rust Brown
    },
    swift: {
      version: "5.3.3",
      default: `import Swift
      print("Hello, World!")`,
      icon: <FaSwift style={{ color: "#F05138" }} />, // Swift Orange
    },
    shell: {
      version: "5.0.0",
      default: `echo "Hello, World!"`,
      icon: <FaCuttlefish style={{ color: "#89E051" }} />, // Shell Green
    },
  };
  

  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup]= useState(false);
  const [name,setName]=useState("");
  const [selectedLanguage,setSelectedLanguage]=useState("javascript");
  const isFile = !node.isFolder;
  const language = node.language?.toLowerCase();
  const icon =
    isFile && languageversion[language] ? (
      languageversion[language].icon
    ) : (
      <FaFile />
    );




  const {
    rootId,
    setrootId,
    defaultId,
    setdefaultId,
    setRefreshTrigger,
    openfile,
    setOpenFile,
  } = useAuth();

  useEffect(() => {
    if (!openfile) setOpenFile(defaultId);
  });

  const buildTree = (data) => {
    const map = new Map();

    // Create a map for quick lookup
    data.forEach((item) => {
      // Initialize children as an empty array
      map.set(item._id.toString(), { ...item, children: [] });
    });

    let root = null;

    data.forEach((item) => {
      if (item.parent) {
        // Add the current item to its parent's children array
        const parent = map.get(item.parent.toString());
        if (parent) {
          parent.children.push(map.get(item._id.toString()));
        }
      } else {
        // No parent means it's the root
        root = map.get(item._id.toString());
      }
    });

    return root;
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const handleRename = async () => {
    setRefreshTrigger((prev) => !prev);
       
    try {
      await axios.put("http://localhost:3001/file/updateFileName", {
        id: node._id,
        name: name,
        parent: node.parent,
        language: selectedLanguage,
      });
  
      toast.success("File renamed successfully!");
      setShowEditPopup(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("already exists")) {
          toast.error(errorMessage); // Show the error message sent from the backend
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  




  const handleDelete = async () => {
  
    setRefreshTrigger((prev) => !prev);
    try {
      console.log("Deleting file with ID:", node._id); // Debugging log

      // Wait for the delete operation to complete first
      await axios.delete(
        `http://localhost:3001/file/deleteFileOrFolder/${node._id}`
      );

      // Only after delete is done, call getFileStructure
      const response = await axios.get(
        "http://localhost:3001/file/getFileStructure",
        {
          params: { userId },
        }
      );

      // Update the UI based on the response data
      onDeleteItem(node._id); // Update UI
      setFileStructure(buildTree(response.data)); // Ensure UI reflects deletion
    } catch (error) {
      console.error("Error deleting:", error);
    }

    // Close the delete popup
    setShowDeletePopup(false);
  };

  // Render "Add" button only for folders and not the root
  const renderAddButton = () => {
    if (node.isFolder) {
      return (
        <button
          onClick={() => onAddNewItem(node._id)}
          className="  text-blue-500 px-1 py-1 rounded flex items-center space-x-2 transition-colors duration-200"
        >
          <MdAdd className="mr-4 text-3xl hover:text-4xl" />
        </button>
      );
    }
    return null;
  };

  // Render "Delete" button only if it's not the root or a default file
  const renderDeleteButton = () => {
    if (node._id !== rootId && node._id !== defaultId) {
      return (
        <button
          onClick={() => setShowDeletePopup(true)}
          className="  rounded text-xs"
        >
          <MdDelete className="text-red text-2xl text-[#CC0000]" />
        </button>
      );
    }
    return null;
  };

  // Corrected renderEditeButton function
  const renderEditButton = () => {
    if (!node.isFolder&& node._id !== defaultId) {
      return (
        <button
        onClick={()=>{setShowEditPopup(true)}}>
          <FaEdit className="text-2xl text-gray-300" />
        </button>
      );
    }
    return null;
  };

  return (
  <div className="ml-4">
  <div className="flex items-center justify-between w-full">
    
    {/* Left Section: Icon and Name */}
    <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleExpand}>
      {node.isFolder ? (
        isExpanded ? (
          <FaRegFolderOpen className="text-yellow-500 text-2xl" />
        ) : (
          <FaRegFolder className="text-yellow-500 text-2xl" />
        )
      ) : (

        
        <div
          className="text-2xl"
          onClick={() => {
            console.log(node.name);
            setOpenFile((prev) => {
              return node._id;
            });
          }}
        >
          {icon}
        </div>
      )}
      {node.isFolder&&
      <span className="font-bold text-white m-2"  
      onClick={() => {
        console.log(node.name);
        setOpenFile((prev) => {
          return node._id;
        });
      }}>{node.name}</span>
      }
      {!node.isFolder&&
       <span className="font-bold text-white m-2">{node.name}</span>
      }
    </div>

    {/* Right Section: Buttons */}
    <div className="flex items-center space-x-2">
      {renderAddButton()}
      {renderDeleteButton()}
      {renderEditButton()}
    </div>
  </div>

  


      {/* Show Delete Confirmation Popup */}

      {showEditPopup&&(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Rename File</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">File Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter new file name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              {Object.keys(languageversion).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setShowEditPopup(false)}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Rename
            </button>
          </div>
        </div>
      </div>
      )}






      {showDeletePopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-lg font-bold">
              Are you sure you want to delete "{node.name}"?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-400 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render children if expanded */}
      {isExpanded && node.children && node.children.length > 0 && (
        <div className="ml-6">
          {node.children.map((child) => (
            <TreeNode 

              key={child._id}
              node={child}
              onAddNewItem={onAddNewItem}
              onDeleteItem={onDeleteItem}
              userId={userId}
              setFileStructure={setFileStructure}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
