const UserFile = require("../Models/UserFile");





const getFileStructure = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const userFile = await UserFile.findOne({ userId });

    if (!userFile) {
      return res.status(404).json({ message: "File structure not found. Initializing default structure..." });
    }

    res.json(userFile.fileStructure);
  } catch (error) {
    console.error("Error fetching file structure:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const addToParent = async (node, path, newItem) => {
  console.log("Current Node:", node);
  console.log("Path:", path);

  // If the path is empty, add the new item to the current node's children
  if (path.length === 0) {
    // Check if children is an array
    if (!Array.isArray(node.children)) {
      throw new Error("Node's children is not an array.");
    }

    // Check for duplicate names
    if (node.children.some((child) => child.name === newItem.name)) {
      throw new Error("Duplicate file or folder name detected.");
    }

    node.children.push(newItem);
    return true;
  }

  // Get the index from the path
  const index = path[0];
  if (index < 0 || index >= node.children.length) {
    throw new Error(`Invalid path index: ${index}`);
  }

  // Traverse to the next child in the path
  const nextNode = node.children[index];
  if (nextNode.type !== "folder") {
    throw new Error("Path leads to a non-folder node.");
  }

  // Recurse into the next level
  return addToParent(nextNode, path.slice(1), newItem);
};







const addFileOrFolder = async (req, res) => {
  try {
    console.log(req);
    const { userId, path, newItem } = req.body;
    
    if (!userId || !newItem || !newItem.name || !newItem.type) {
      return res.status(400).json({ message: "Invalid request body." });
    }

    const userFile = await UserFile.findOne({ userId });

    if (!userFile) {
      return res.status(404).json({ message: "File structure not found." });
    }
    

    const added = await addToParent(userFile.fileStructure, path, newItem);

    if (!added) {
      return res.status(400).json({ message: "Invalid path or folder not found." });
    }

    await userFile.save();
    res.json({ message: "File or folder added successfully." });
  } catch (error) {
    console.error("Error adding file or folder:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Update file content
async function updateFileContent(userId, filePath, newContent) {
  const userFile = await UserFile.findOne({ userId });
  if (!userFile) throw new Error("File structure not found.");

  function updateNode(node, path) {
    if (path.length === 0) {
      if (node.type === "file") {
        node.code = newContent;
        return true;
      }
      throw new Error("Path does not point to a file.");
    }

    for (let child of node.children) {
      if (child.name === path[0]) {
        return updateNode(child, path.slice(1));
      }
    }
    return false;
  }

  const success = updateNode(userFile.fileStructure, filePath.split("/"));
  if (!success) throw new Error("File not found.");
  await userFile.save();
  return "File updated successfully.";
}


const deleteFromParent = async (node, path) => {
  if (path.length === 1) {
    const index = node.children.findIndex(child => child.name === path[0]);
    if (index === -1) {
      return false;
    }
    node.children.splice(index, 1);
    return true;
  }

  for (let child of node.children) {
    if (child.name === path[0] && child.type === "folder") {
      return deleteFromParent(child, path.slice(1));
    }
  }
  return false;
};



const deleteNode= async (req, res) => {
  try {
    const { userId, path } = req.body;

    if (!userId || !path || path.length === 0) {
      return res.status(400).json({ message: "Invalid request body." });
    }

    const userFile = await UserFile.findOne({ userId });

    if (!userFile) {
      return res.status(404).json({ message: "File structure not found." });
    }

    const isDefaultFile = path.length === 1 && path[0] === "Default File";
    if (isDefaultFile) {
      return res.status(403).json({ message: "Default file cannot be deleted." });
    }

    const deleted = await deleteFromParent(userFile.fileStructure, path);

    if (!deleted) {
      return res.status(400).json({ message: "Invalid path or file/folder not found." });
    }

    await userFile.save();
    res.json({ message: "File or folder deleted successfully." });
  } catch (error) {
    console.error("Error deleting file or folder:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  addFileOrFolder,
  getFileStructure,
  updateFileContent,
  deleteNode,
};
