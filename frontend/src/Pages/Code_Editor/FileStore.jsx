import React, { useState, useEffect } from "react";
import axios from "axios";
import TreeNode from "./TreeNode";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { FaJsSquare, FaJava, FaPython, FaMicrosoft, FaPhp,  FaRust, FaSwift } from "react-icons/fa";
import { TbBrandJavascript } from "react-icons/tb";
import { FaCuttlefish } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { SiKotlin } from "react-icons/si";
import { SiRuby } from "react-icons/si";


const FileStore = ({ email }) => {
  const [fileStructure, setFileStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const {url} =useAuth();
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
  

  const {
    rootId,
    setrootId,
    refreshTrigger,
    setRefreshTrigger,
    defaultId,
    setdefaultId,
  } = useAuth();

  // Modal related state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState("file"); // 'file' or 'folder'
  const [newItemParentId, setNewItemParentId] = useState(null); // Parent ID for the new file/folder
  const [newItemLanguage,setnewItemLanguage]=useState("javascript");
  const [selectedLanguage,setSelectedLanguage]=useState("javascript")


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


  useEffect(() => {
    const fetchUserIdAndFileStructure = async () => {
      try {
        const userResponse = await axios.get(
          `${url}/getUserIdByEmail`,
          {
            params: { email },
          }
        );
        const userId = userResponse.data.userId;
        setUid(userId);
        

        if(!userId)
        {
           return;
        }

        const fileResponse = await axios.get(
          `${url}/getFileStructure`,
          {
            params: { userId },
          }
        );

        const tree = buildTree(fileResponse.data);
        setFileStructure(tree);

        if (tree && Array.isArray(tree.children)) {
         
          setrootId(tree._id);
          
          setdefaultId(
            tree.children.find((item) => item.name === "defaultFile")._id
          );
         
        } else {
          console.error(
            "fileStructure or its children property is not available or is not an array"
          );
        }

        console.log(tree);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchUserIdAndFileStructure();
  }, [email, refreshTrigger]); // ✅ Trigger refetch when email or updateTrigger changes



  
  const onDeleteItem = (id) => {
    setFileStructure((prevData) => {
      const removeItem = (node) => {
        if (!node) return null;
        if (node._id === id) return null; // Remove the node
        return {
          ...node,
          children: node.children?.map(removeItem).filter(Boolean), // Recursively update children
        };
      };
      setRefreshTrigger((prev) => !prev);
      return removeItem(prevData);
    });
  };

  

  const addItem = async () => {
    if (!newItemName.trim()) return toast.error("Name cannot be empty!");

    const userResponse = await axios.get(
      `${url}/getUserIdByEmail`,
      {
        params: { email },
      }
    );
    const userId = userResponse.data.userId;

    const newItem = {
      name: newItemName,
      isFolder: newItemType === "folder",
      parent: newItemParentId,
      language: selectedLanguage,
      content: newItemType === "file" ? "hi" : null, // Set content to null for folders
      owner: userId,
    };

    try {
      const response = await axios.post(
        `${url}/addFileOrFolder`,
        newItem
      );
      const newEntry = response.data.newEntry;

      setFileStructure((prevData) => {
        const newData = { ...prevData }; // Create a shallow copy of the previous data

        const addNewItem = (node, parentId) => {
          if (parentId === null || node._id === parentId) {
            node.children = node.children || []; // Initialize children if undefined
            node.children.push(newEntry);
          } else {
            node.children.forEach((child) => addNewItem(child, parentId));
          }
        };

        // Start adding the new entry from the root
        addNewItem(newData, newItemParentId);

        return newData;
      });
      setRefreshTrigger((prev) => !prev);
      closeModal();
    } catch (error) {
      console.error("Error adding item:", error);
      
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message.includes("already exists")
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewItemName("");
    setNewItemType("file");
    setNewItemParentId(null);
  };

  const handleAddNewItem = (parentId) => {
    setNewItemParentId(parentId);
    setIsModalOpen(true);
  };

 

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  if (!fileStructure) {
    return (
      <div className="text-center text-xl">No file structure available.</div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-800">
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              Create New File/Folder
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addItem();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                >
                  <option value="file">File</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
              {newItemType === "file" && (
                <div>
                  <label className="block text-sm font-medium">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    {Object.keys(languageversion).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="text-3xl font-bold mb-4 text-white">File Store</div>
      {fileStructure && rootId && defaultId && (
        <TreeNode
          node={fileStructure}
          onAddNewItem={handleAddNewItem}
          onDeleteItem={onDeleteItem}
    
          userId={uid}
          setFileStructure={setFileStructure}
        />
      )}
    </div>
  );
};

export default FileStore;
