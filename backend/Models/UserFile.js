const mongoose = require('mongoose');

const fileStructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isFolder: {
    type: Boolean,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserFile',
    default: null, // Root folder will have null as parent
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserFile',
    },
  ],
  content: {
    type: String,
    default: null, // Applicable only for files, not folders
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'coders', // Links the structure to a specific coder (user)
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false, // For soft delete functionality
  },
  language: {
    type: String,
    default: null, // Applicable only for files, not folders
  },
});

const UserFile = mongoose.model('UserFile', fileStructureSchema);

module.exports = UserFile;