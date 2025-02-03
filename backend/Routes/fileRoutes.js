const fileController = require("../Controllers/FileControllers");
const express = require("express");
const router = express.Router();



router.post("/addFileOrFolder", fileController.addFileOrFolder);
router.get("/getFileStructure", fileController.getFileStructure);
router.put("/updateFileContent", fileController.updateFileContent);
router.get("/getContent",fileController.getContent)
router.delete('/deleteFileOrFolder/:id', fileController.deleteFileOrFolder);
router.post("/executeCode", fileController.executeCode);
router.put("/updateFileName", fileController.updateFileName);
router.get("/getLanguage", fileController.getLanguage);

module.exports = router;
