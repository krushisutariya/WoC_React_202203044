import React, { useState, useEffect } from "react";
import axios from "axios";
import TreeNode from "./TreeNode";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

const FileStore = ({ email }) => {
  const [fileStructure, setFileStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  
  
  const {rootId, setrootId,refreshTrigger, setRefreshTrigger,defaultId, setdefaultId}= useAuth();


  // Modal related state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState("file"); // 'file' or 'folder'
  const [newItemParentId, setNewItemParentId] = useState(null); // Parent ID for the new file/folder




  
  

 
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

  // Fetch User ID and File Structure on component load
  const [updateTrigger, setUpdateTrigger] = useState(0); // Trigger for re-fetching

  useEffect(() => {
    const fetchUserIdAndFileStructure = async () => {
      try {
        const userResponse = await axios.get(
          "http://localhost:3001/api/getUserIdByEmail",
          {
            params: { email },
          }
        );
        const userId = userResponse.data.userId;
        setUid(userId);

        const fileResponse = await axios.get(
          "http://localhost:3001/file/getFileStructure",
          {
            params: { userId },
          }
        );

        const tree = buildTree(fileResponse.data);
        setFileStructure(tree);

        if (tree && Array.isArray(tree.children)) {
          setrootId(tree._id);
         setdefaultId(tree.children.find(
          (item) => item.name === "default.js"
        )._id)
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
  }, [email,refreshTrigger]); // ✅ Trigger refetch when email or updateTrigger changes

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
      setRefreshTrigger(prev => !prev);
      return removeItem(prevData);
    });
  };

  const addItem = async () => {
  
    if (!newItemName.trim()) return toast.error("Name cannot be empty!");
    
    const userResponse = await axios.get(
      "http://localhost:3001/api/getUserIdByEmail",
      {
        params: { email },
      }
    );
    const userId = userResponse.data.userId;

    const newItem = {
      name: newItemName,
      isFolder: newItemType === "folder",
      parent: newItemParentId,
      content: newItemType === "file" ? "hi" : null, // Set content to null for folders
      owner: userId,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/file/addFileOrFolder",
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
      setRefreshTrigger(prev => !prev);
      closeModal();
    } catch (error) {
      console.error("Error adding item:", error);
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
    <div className="container mx-auto p-4">
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
      <div className="text-3xl font-bold mb-4">File Store</div>
      {fileStructure &&rootId&&defaultId&& (
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
