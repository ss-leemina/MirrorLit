const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 댓글 작성 (POST)
router.post('/articles/:articleId/comment', commentController.createComment);



module.exports = router;
