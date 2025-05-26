const express = require("express"),
  router = express.Router(),
  emailVerificationController = require("../controllers/emailVerificationController");

// 인증 코드 전송
router.post("/:userId/send", emailVerificationController.sendVerificationCode);

// 인증 코드 확인
router.post("/:userId/verify", emailVerificationController.verifyCode);

module.exports = router;
