const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require("../middlewares/auth");

// 댓글 작성
// router.post('/', authenticate.authenticate, commentController.createComment);
router.post('/', commentController.createComment);

// 댓글 삭제
router.post('/:commentId/delete', commentController.deleteComment);

// 추천 비추천 상호작용
router.post('/articles/:articleId/comments/:commentId/reaction', commentController.reactToComment);

// 댓글 목록 및 추천/비추천 계산
router.get('/articles/:articleId/comments', commentController.getCommentsWithReactions);

module.exports = router;
