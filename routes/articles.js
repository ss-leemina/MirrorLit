const express = require("express"),
  router = express.Router(),
  articleController = require("../controllers/articleController"),
  factcheckController = require("../controllers/factcheckController");


router.get("/", articleController.showArticleList);
router.get("/:articleId", articleController.showArticle);
router.post("/:articleId/factcheck", factcheckController.factCheckButton);


module.exports = router;