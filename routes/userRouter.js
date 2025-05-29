const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");


router.get("/login", userController.login);

router.post("/login",
  (req, res, next) => {
    console.log("로그인 시도: ", req.body);
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


router.get("/logout", userController.logout, userController.redirectView);


module.exports = router;