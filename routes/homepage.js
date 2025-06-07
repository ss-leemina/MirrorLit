const express = require("express"),
  router = express.Router(),
  homeController = require("../controllers/homeController");

// '/'나 '/home' url에 대해 메인페이지로 라우트
router.get("/", homeController.showMainPage);
router.get("/home", homeController.showMainPage);

module.exports = router;
