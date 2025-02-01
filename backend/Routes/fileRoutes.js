const fileController = require("../Controllers/FileControllers");
const express = require("express");
const router = express.Router();



router.post("/addFileOrFolder", fileController.addFileOrFolder);
router.get("/getFileStructure", fileController.getFileStructure);
router.put("/updateFileContent", fileController.updateFileContent);
router.get("/getContent",fileController.getContent)
router.delete('/deleteFileOrFolder/:id', fileController.deleteFileOrFolder);
router.post("/executeCode", fileController.executeCode);

module.exports = router;
