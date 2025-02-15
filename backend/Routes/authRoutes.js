const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");


router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/googleLogin",authController.googleLogin);
router.post("/send_recovery_email", authController.sendRecoveryEmail);
router.post("/resetpassword", authController.resetPassword);
router.get("/getUserIdByEmail", authController.getUserIdByEmail);

module.exports = router;


