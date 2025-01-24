const UserFile = require("../Models/UserFile");

// Initialize default file structure
async function initializeFileStructure(userId) {
  const defaultStructure = {
    name: "Root",
    type: "folder",
    expanded: true,
    children: [],
  };

  const userFile = new UserFile({
    userId,
    fileStructure: defaultStructure,
  });

  await userFile.save();
  return "Default file structure initialized.";
}



// Add file or folder
async function addFileOrFolder(userId, parentPath, newItem) {
  const userFile = await UserFile.findOne({ userId });
  if (!userFile) throw new Error("File structure not found for user.");

  function addToParent(node, path) {
    if (path.length === 0) {
      node.children.push(newItem);
      return true;
    }

    for (let child of node.children) {
      if (child.name === path[0] && child.type === "folder") {
        return addToParent(child, path.slice(1));
      }
    }
    return false;
  }

  const success = addToParent(userFile.fileStructure, parentPath.split("/"));
  if (!success) throw new Error("Parent folder not found.");
  await userFile.save();
  return "File/Folder added successfully.";
}


// Get file structure
async function getFileStructure(userId) {
  const userFile = await UserFile.findOne({ userId });
  if (!userFile) throw new Error("File structure not found.");
  return userFile.fileStructure;
}


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




// Delete node
async function deleteNode(userId, path) {
  const userFile = await UserFile.findOne({ userId });
  if (!userFile) throw new Error("File structure not found.");

  function deleteFromParent(node, path) {
    if (path.length === 1) {
      const index = node.children.findIndex((child) => child.name === path[0]);
      if (index !== -1) {
        node.children.splice(index, 1);
        return true;
      }
      return false;
    }

    for (let child of node.children) {
      if (child.name === path[0] && child.type === "folder") {
        return deleteFromParent(child, path.slice(1));
      }
    }
    return false;
  }

  const success = deleteFromParent(userFile.fileStructure, path.split("/"));
  if (!success) throw new Error("Node not found.");
  await userFile.save();
  return "Node deleted successfully.";
}

module.exports = {
  initializeFileStructure,
  addFileOrFolder,
  getFileStructure,
  updateFileContent,
  deleteNode,
};
