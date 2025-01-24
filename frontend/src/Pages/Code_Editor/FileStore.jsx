import React, { useState, useEffect } from "react";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { MdExpandMore, MdChevronRight } from "react-icons/md";
import axios from "axios";

const FileStore = ({ email }) => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemType, setNewItemType] = useState(null);
  const [newItemPath, setNewItemPath] = useState([]);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    // Fetch file structure from backend when the component mounts
    const fetchFileStructure = async () => {
      try {
        const response = await axios.get("/file/getFileStructure");
        setData(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching file structure:", error);
      }
    };

    fetchFileStructure();
  }, []);

  const toggleFolder = (path) => {
    const update = (node, path) => {
      if (path.length === 1) {
        node[path[0]].expanded = !node[path[0]].expanded;
      } else {
        update(node[path[0]].children, path.slice(1));
      }
    };

    setData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      update(newData, path);
      return newData;
    });
  };

  const openModal = (path, type) => {
    setNewItemPath(path);
    setNewItemType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNewItemName("");
    setIsModalOpen(false);
  };

  const addItem = async () => {
    if (!newItemName.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    const newItem =
      newItemType === "folder"
        ? { name: newItemName, type: "folder", expanded: true, children: [] }
        : { name: newItemName, type: "file", language: "javascript" };

    try {
      const response = await axios.post("/file/addFileOrFolder", {
        path: newItemPath,
        newItem,
      });

      setData((prevData) => {
        const newData = JSON.parse(JSON.stringify(prevData));
        const update = (node, path) => {
          if (path.length === 0) {
            node.push(newItem);
          } else {
            update(node[path[0]].children, path.slice(1));
          }
        };

        update(newData, newItemPath);
        return newData;
      });
      closeModal();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const deleteItem = async (path) => {
    try {
      await axios.post("/file/deleteNode", { path });

      const update = (node, path) => {
        if (path.length === 0) {
          node.splice(path[0], 1);
        } else {
          update(node[path[0]].children, path.slice(1));
        }
      };

      setData((prevData) => {
        const newData = JSON.parse(JSON.stringify(prevData));
        update(newData, path);
        return newData;
      });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const renderTree = (nodes, path = []) => {
    console.log(nodes);
    console.log("hi");
    if(nodes.length==0)
    {
      return null;
    }
    return nodes.map((node, index) => {
      const currentPath = [...path, index];
      if (node.type === "folder") {
        return (
          <div key={index} className="ml-4 bg-[#2c3968] text-white">
            <div
              className="flex items-center justify-between p-2 cursor-pointer hover:bg-[#5072A7]"
              onClick={() => toggleFolder(currentPath)}
            >
              <div className="flex items-center gap-2">
                {node.expanded ? (
                  <MdExpandMore className="text-lg" />
                ) : (
                  <MdChevronRight className="text-lg" />
                )}
                <div className="text-lg font-semibold">{node.name}</div>
              </div>
              <div className="flex gap-2">
                <FaPlus
                  className="cursor-pointer text-green-500"
                  onClick={() => openModal(currentPath, "folder")}
                />
                <FaPlus
                  className="cursor-pointer text-blue-500"
                  onClick={() => openModal(currentPath, "file")}
                />
              </div>
            </div>
            {node.expanded && (
              <div className="ml-4">
                {renderTree(node.children, currentPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={index}
          className="flex items-center justify-between p-2 border-white pl-8 hover:bg-[#5072A7] rounded-md"
        >
          <div className="flex items-center gap-2">
            <i className="text-xl text-gray-500" />
            <div className="text-lg">{node.name}</div>
          </div>
          <div className="flex gap-2">
            <TiEdit className="cursor-pointer text-blue-400" />
            <RiDeleteBinLine
              className="cursor-pointer text-red-400"
              onClick={() => deleteItem(currentPath)}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="h-screen w-80 bg-gray-50 shadow-lg">
      <h1 className="text-2xl font-bold p-4 border-b">File Explorer</h1>
     

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Create {newItemType === "folder" ? "Folder" : "File"}
            </h2>
            <input
              type="text"
              placeholder="Enter name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileStore;
