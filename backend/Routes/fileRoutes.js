const fileController = require("../Controllers/FileControllers");
const express = require("express");
const router = express.Router();



router.post("/addFileOrFolder", fileController.addFileOrFolder);
router.get("/getFileStructure", fileController.getFileStructure);
router.put("/updateFileContent", fileController.updateFileContent);
router.delete("/deleteNode", fileController.deleteNode);

module.exports = router;
