const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 댓글 작성 (POST)
router.post('/articles/:articleId/comment', commentController.createComment);
//추천 비추천 상호작용(POST)
router.post('/articles/:articleId/comments/:commentId/reaction', commentController.reactToComment);


module.exports = router;
