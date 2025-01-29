import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdDelete } from "react-icons/md";
import { FaRegFolderOpen, FaEdit, FaRegFolder } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";

const TreeNode = ({
  node,
  onAddNewItem,
  onDeleteItem,
  userId,
  setFileStructure,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
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
    if(!openfile)
    setOpenFile(defaultId);
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

  const handleDelete = async () => {
    console.log(setRefreshTrigger);
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
          className=" hover:bg-green-600 text-blue-500 px-1 py-1 rounded flex items-center space-x-2 transition-colors duration-200"
        >
          <MdAdd className="mr-4 text-2xl" />
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
          <MdDelete className="text-red text-2xl" />
        </button>
      );
    }
    return null;
  };

  // Corrected renderEditeButton function
  const renderEditButton = () => {
    if (!node.isFolder) {
      return (
        <button
          onClick={() => {
            setOpenFile((prev) => {
              console.log("Previous:", prev, "New:", node._id);
              return node._id;
            });
          }}
          className=" px-2 py-1 rounded text-xs"
        >
          <FaEdit className="text-xl" />
        </button>
      );
    }
    return null;
  };

  return (
    <div className="ml-4">
      <div className="flex items-center space-x-2">
        <span onClick={toggleExpand} className="cursor-pointer font-bold">
          {node.isFolder ? (
            isExpanded ? (
              <FaRegFolderOpen className="text-yellow-500 text-2xl" />
            ) : (
              <FaRegFolder className="text-yellow-500 text-2xl " />
            )
          ) : (
            <CiFileOn className="text-2xl" />
          )}{" "}
          {node.name}
        </span>

        <div className="flex space-x-2">
          {renderAddButton()}
          {renderDeleteButton()}
          {renderEditButton()} {/* Edit Button */}
        </div>
      </div>

      {/* Show Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
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
