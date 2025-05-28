const express = require("express"),
  router = express.Router(),
  homeController = require("../controllers/homeController");

router.get("/", homeController.showMainPage);
router.get("/home", homeController.showMainPage);

module.exports = router;
