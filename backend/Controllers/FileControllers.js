const UserFile = require("../Models/UserFile");
const mongoose = require("mongoose");


const getFileStructure = async (req, res) => {
  try {
    const { userId } = req.query;

  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const userFiles = await UserFile.find({ owner: userId });
   

    if (!userFiles || userFiles.length === 0) {
      return res.status(404).json({ message: "File structure not found. Initializing default structure..." });
    }

    // Send the entire array
    res.json(userFiles);
  } catch (error) {
    console.error("Error fetching file structure:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





const addFileOrFolder = async (req, res) => {
  try {
    const { name, isFolder, parent, content,owner } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const newFileOrFolder = new UserFile({
      name,
      isFolder,
      parent: parent || null, // Allow root-level items
      children: [],
      content, // Only files have content
      owner, // Use owner from request
    });

    // Save to database
    await newFileOrFolder.save();

    // If it has a parent, update the parent's children array
    if (parent) {
      const parentFolder = await UserFile.findById(parent);
      if (parentFolder) {
        parentFolder.children.push(newFileOrFolder._id);
        await parentFolder.save();
      }
    }

    res.status(201).json({ newEntry: newFileOrFolder }); // Ensure the response matches frontend expectations
  } catch (error) {
    console.error("Error creating new file/folder:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







const updateFileContent = async (req, res) => {
  const { id, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await UserFile.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ message: "File updated successfully" });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getContent = async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await UserFile.findById(id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ content: file.content });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Server error" });
  }
};



const deleteFileOrFolder = async (req, res) => {
  try {
      console.log("Received request to delete:", req.params);  // Debugging log
      const fileId = req.params.id;
      console.log("Received request to delete:",fileId);
      // Find and delete the file/folder from the database
      const deletedFile = await UserFile.findByIdAndDelete(fileId);
      if (!deletedFile) {
          return res.status(404).json({ message: 'File/Folder not found' });
      }

      res.json({ message: 'File/Folder deleted successfully' });
  } catch (error) {
      console.error('Error deleting file/folder:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};






module.exports = {
  addFileOrFolder,
  getFileStructure,
  updateFileContent,
  deleteFileOrFolder,
  getContent
};
