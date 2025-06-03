const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");

//(mypage에만 적용) 로그인 여부 확인 
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "로그인이 필요합니다.");
  res.redirect("/users/login");
};


router.get("/login", userController.login);

router.post("/login",
  (req, res, next) => {
    //console.log("로그인 시도: ", req.body);
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

router.get("/new", userController.showSignupForm);
router.post("/create", userController.create, userController.redirectView);

router.get("/reset-password", userController.showResetRequestForm);
router.get("/reset-form", userController.showResetForm);
router.post("/reset", userController.sendResetCode);
router.post("/reset2", userController.resetPasswordFinal, userController.redirectView);
router.post("/verify-code", userController.verifyResetCode);

router.get("/mypage", ensureAuthenticated, userController.getMyPage);

router.get("/logout", userController.logout);

//router.get("/logout", userController.logout, userController.redirectView);


module.exports = router;
