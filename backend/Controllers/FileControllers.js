const UserFile = require("../Models/UserFile");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const { exec } = require("child_process");
const fs = require("fs");
const { stdin } = require("process");


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

    res.json(userFiles);
  } catch (error) {
    console.error("Error fetching file structure:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





const addFileOrFolder = async (req, res) => {
  try {
    const { name, isFolder, parent,language, content,owner } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }
    const deleted=false;

    const existingFileOrFolder = await UserFile.findOne({
      name,
      parent,
      deleted: false, // Only check for non-deleted items
    });

    if (existingFileOrFolder) {
      return res.status(400).json({ message: `File or folder with the name "${name}" already exists in this location.` });
    }

    const newFileOrFolder = new UserFile({
      name,
      isFolder,
      parent: parent || null, // Allow root-level items
      children: [],
      content, // Only files have content
      owner,
      deleted,
      language // Use owner from request
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
  const { id, language, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await UserFile.findByIdAndUpdate(
      id,
      { content,language },
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



const updateFileName = async (req, res) => {
  const { id, name, parent, language } = req.body;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  // Validate the name field
  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Filename is required" });
  }

  console.log(name);
  console.log(parent);

  try {
    // Check if a file with the same name already exists (excluding the current file)
    const existingFileOrFolder = await UserFile.findOne({
      name,
      parent,
      deleted: false, // Only check for non-deleted items
      _id: { $ne: id }, // Exclude the current file from the check
    });

    console.log(existingFileOrFolder);

    if (existingFileOrFolder) {
      return res.status(400).json({
        message: `File or folder with the name "${name}" already exists in this location.`,
      });
    }

    // Find the file and update its name
    const file = await UserFile.findByIdAndUpdate(
      id,
      { name, language },
      { new: true } // Return the updated file object
    );

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ message: "File name updated successfully", file });
  } catch (error) {
    console.error("Error updating name:", error);
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

    res.json({ name: file.name, content: file.content });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Server error" });
  }
};


const getLanguage = async (req, res) => {
  const { id } = req.query;
 


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await UserFile.findById(id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    console.log(file.language);
    res.json({ language: file.language, name: file.name});
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





const executeCode=async(req,res) =>{
  try {

    const sourceData=req.body;
    if(!sourceData?.language || !sourceData?.version){
      return res.status(400).json({ error: "Fileds are required!" });
    }
  
    const {
      language = "javascript",
      version = "18.15.0",
      code = "",
      input = ""
    } = sourceData;
  
    console.log("this is backenf");
    console.log(sourceData);
    if (!code.trim()) {
      return res.status(400).json({ error: "Source code cannot be empty." });
    }
    
    const data={
      language,
      version,
      files:[
        {
          content: code,
        }
      ],
      stdin: input,
    };
  
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "Failed to execute code.",
        details: errorText,
      });
    }

    // Parse and return the response
    const results = await response.json();
    if (results && results.run) {
      return res.status(200).json(results.run);
    } else {
      return res.status(500).json({ error: "Unexpected API response format." });
    }
     
  }
  catch(err)
  {
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message || "An unexpected error occured."
    })
  }
  
  
}




module.exports = {
  addFileOrFolder,
  getFileStructure,
  updateFileContent,
  deleteFileOrFolder,
  getContent,
  executeCode,
  updateFileName,
  getLanguage
};
