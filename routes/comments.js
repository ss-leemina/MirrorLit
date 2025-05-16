const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 댓글 작성
router.post('/', commentController.createComment);

// 댓글 삭제
router.post('/:commentId/delete', commentController.deleteComment);


module.exports = router;
