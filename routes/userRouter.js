const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 회원가입 폼 렌더링
router.get("/new", userController.showSignupForm);
// 회원가입 처리
router.post("/create", userController.create, userController.redirectView);

router.post("/send-auth-code", userController.sendResetEmail, userController.redirectView);

router.get("/reset-password", userController.showResetRequestForm);
// 인증코드 발송 (resetPassword.ejs form action="/users/reset")
router.post("/reset", userController.sendResetEmail, userController.redirectView);

// 인증코드 검증
router.post("/verify-code", userController.verifyAuthCode, userController.redirectView);
// 비밀번호 재설정
// 재설정 폼 (resetPassword2.ejs form action="/users/reset2")
router.get("/reset-form", userController.showResetForm);
// 비밀번호 변경 처리
router.post("/reset2", userController.resetPasswordFinal, userController.redirectView);

// 이메일 인증 상태 업데이트
router.post("/verify-email", userController.verifyEmail, userController.redirectView);

// 로그아웃
router.get("/logout", userController.logout, userController.redirectView);

// 로그인 폼
router.get("/:login", userController.login);
// 로그인 처리
router.post("/:login", userController.authenticate, userController.redirectView);



module.exports = router;