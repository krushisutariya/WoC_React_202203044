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
  const [newItemPath, setNewItemPath] = useState(["root"]);
  const [newItemName, setNewItemName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItemPath, setEditItemPath] = useState([]);
  const [editItemName, setEditItemName] = useState("");

  useEffect(() => {
    const fetchUserIdAndFileStructure = async () => {
      try {
        const userResponse = await axios.get(
          "http://localhost:3001/api/getUserIdByEmail",
          { params: { email } }
        );
        const userId = userResponse.data.userId;

        const fileResponse = await axios.get(
          "http://localhost:3001/file/getFileStructure",
          { params: { userId } }
        );

        let fileStructure = fileResponse.data;

        setData(fileStructure);
        console.log(fileStructure);
        renderTree([fileStructure]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserIdAndFileStructure();
  }, [email]);

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
    console.log(path);
    setNewItemPath(path);
    setNewItemType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNewItemName("");
    setIsModalOpen(false);
  };







  const addItem = async () => {
    if (!newItemName.trim()) return alert("Name cannot be empty!");
    
    
    const newItem =
      newItemType === "folder"
        ? { name: newItemName, type: "folder", expanded: true, children: [] }
        : { name: newItemName, type: "file", language: "javascript" };
  
    try {

      const userResponse = await axios.get(
        "http://localhost:3001/api/getUserIdByEmail",
        { params: { email } }
      );
      const userId = userResponse.data.userId;
      console.log(userId);
      console.log(newItemName);
      console.log(newItemPath);
      await axios.post("http://localhost:3001/file/addFileOrFolder", {
        userId,
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
    const isDefaultFile =
      path.length === 1 && data[path[2]].name === "default.txt";
    if (isDefaultFile) {
      return alert("You cannot delete the default file!");
    }

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.post("http://localhost:3001/file/deleteNode", { path });

      const update = (node, path) => {
        if (path.length === 1) {
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

  const openEditModal = (path, name) => {
    setEditItemPath(path);
    setEditItemName(name);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditItemName("");
    setIsEditModalOpen(false);
  };

  const editItem = async () => {
    if (!editItemName.trim()) return alert("Name cannot be empty!");

    try {
      await axios.post("http://localhost:3001/file/editNode", {
        path: editItemPath,
        newName: editItemName,
      });

      setData((prevData) => {
        const newData = JSON.parse(JSON.stringify(prevData));
        const update = (node, path) => {
          if (path.length === 1) {
            node[path[0]].name = editItemName;
          } else {
            update(node[path[0]].children, path.slice(1));
          }
        };

        update(newData, editItemPath);
        return newData;
      });
      closeEditModal();
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const renderTree = (nodes, path = []) => {
    return nodes.map((node, index) => {
      const currentPath = [...path, index];
      if (node.type === "folder") {
        return (
          
            <div key={index} className="ml-4 bg-[#2c3968]">
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-[#5072A7]"
                
              >
                <div className="flex items-center gap-2">
                  {node.expanded ? (
                    <MdExpandMore onClick={() => toggleFolder(currentPath)} className="text-lg text-black" />
                  ) : (
                    <MdChevronRight onClick={() => toggleFolder(currentPath)} className="text-lg" />
                  )}
                  <div className="text-lg font-semibold">{node.name}</div>
                </div>
                <div className="flex gap-2">
                  <TiEdit
                    className="cursor-pointer text-yellow-500"
                    onClick={() => openEditModal(currentPath, node.name)}
                  />
                  <RiDeleteBinLine
                    className="cursor-pointer text-red-500"
                    onClick={() => deleteItem(currentPath)}
                  />
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
      } else {
        return (
          <div>
            <div className="flex">

            </div>
            <div key={index} className="ml-4">
              <div className="flex justify-between items-center p-2">
                {node.name}
                <div className="flex gap-2">
                  <TiEdit
                    className="cursor-pointer text-yellow-500"
                    onClick={() => openEditModal(currentPath, node.name)}
                  />
                  {node.name != "Default File" && (
                    <RiDeleteBinLine
                      className="cursor-pointer text-red-500"
                      onClick={() => deleteItem(currentPath)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
  };

  return (
    <div className="h-screen w-80 bg-gray-50 shadow-lg">
      <h1 className="text-2xl font-bold p-4 border-b">File Explorer</h1>
      <div className="h-full overflow-y-auto p-4">
        {renderTree(Array.isArray(data) ? data : [data])}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-black">
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

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
            <input
              type="text"
              placeholder="Enter new name"
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={editItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileStore;
