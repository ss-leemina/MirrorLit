const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.get("/new", userController.showSignupForm);
router.post("/create", userController.create, userController.redirectView);
router.get("/reset-password", userController.showResetRequestForm);
router.get("/reset-form", userController.showResetForm);
router.post("/reset2", userController.resetPasswordFinal, userController.redirectView);
router.get("/logout", userController.logout, userController.redirectView);

router.get("/:login", userController.login);
router.post("/:login", userController.authenticate, userController.redirectView);

module.exports = router;