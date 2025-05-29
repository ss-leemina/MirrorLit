const express = require("express"),
  router = express.Router(),
  articleController = require("../controllers/articleController"),
  factcheckController = require("../controllers/factcheckController");

// 기사 목록
router.get("/", articleController.showArticleList);

// 기사 하나 보여주기
router.get("/:articleId", articleController.showArticle);

// 팩트체크 버튼
router.post("/:articleId/factcheck", factcheckController.createFactCheck);

module.exports = router;