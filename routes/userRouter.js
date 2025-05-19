const express = require("express");
const router = express.Router();

const {
  register,
  loginUser,
  logoutUser,
  resetPassword,
  verifyEmail,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);

const {
  sendVerificationCode,
  confirmVerificationCode,
} = require("../controllers/emailController");

router.post("/send-code", sendVerificationCode);
router.post("/confirm-code", confirmVerificationCode);

module.exports = router;