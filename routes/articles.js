const express = require("express"),
  router = express.Router(),
  articleController = require("../controllers/articleController");


router.get("/", articleController.showArticleList);
router.get("/:articleId", articleController.showArticle);
router.post("/:articleId/factcheck", articleController.factCheckButton);


module.exports = router;