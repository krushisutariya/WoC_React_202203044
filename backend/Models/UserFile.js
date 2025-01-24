const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["folder", "file"] },
  language: { type: String, required: function () { return this.type === "file"; } },
  code: { type: String, required: function () { return this.type === "file"; } },
  expanded: { type: Boolean, default: false },
  children: { type: [this], default: [] },
});

const userFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Coders" },
  fileStructure: fileSchema,
});

const UserFile = mongoose.model("UserFile", userFileSchema);

module.exports = UserFile;
