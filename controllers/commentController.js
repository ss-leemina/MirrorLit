const db = require('../db');
// const db = require("../models"),
//   Comment = db.comment,
//   Op = db.Sequelize.Op;

exports.createComment = (req, res) => {
  //console.log('댓글 POST 요청 도착:', req.url, req.body);

  const articleId = req.params.articleId;
  const { source, content } = req.body;
  const sql = `INSERT INTO comments (source, content, article_id, user_id) VALUES (?, ?, ?, ?)`;

  //1은 user_id 테스트용, 나중에 바꾸기
  db.query(sql, [source, content, articleId, 1], (err) => {
    if (err) return res.status(500).send('댓글 작성 실패');
    res.redirect(`/articles/${articleId}`);
  });
};

// exports.createComment = async (req, res) => {
//   console.log('댓글 POST 요청 도착:', req.url, req.body);
//   console.log("articleId:", articleId);

//   try {
//     const articleId = req.params.articleId;
//     const { source, content } = req.body;
//     const newComment = await Comment.create({
//       source,
//       content,
//       article_id: parseInt(articleId),
//       user_id: 1
//     });
//     res.redirect(`/articles/${articleId}`);
//   } catch (err) {
//     console.error("댓글 작성 중 에러:", err);
//     res.status(500).send("작성 실패");
//   };
// };

//const db = require('../models');
//const CommentReaction = db.CommentReaction;
//const Comment = db.Comment;

//추천, 비추천 상호작용
exports.reactToComment = async (req, res) => {
  const userId = req.body.user_id;
  const commentId = parseInt(req.params.commentId);
  const { reaction_type } = req.body;

  if (!['like', 'dislike'].includes(reaction_type)) {
    return res.status(400).json({ message: "추천 또는 비추천만 가능합니다." });
  }

  try {
    // 1. 댓글 존재 여부 및 작성자 확인
    const comment = await Comment.findOne({
      where: { comment_id: commentId }
    });

    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 2. 자신의 댓글에는 추천/비추천 불가
    if (comment.user_id === userId) {
      return res.status(403).json({ message: "자신의 댓글에는 반응할 수 없습니다." });
    }

    // 3. 이미 반응한 적 있는지 확인
    const existingReaction = await CommentReaction.findOne({
      where: { comment_id: commentId, user_id: userId }
    });
    if (existingReaction) {
      return res.status(400).json({ message: "댓글에 이미 반응을 남겼습니다." });
    }

    // 4. 새 반응 등록
    await CommentReaction.create({
      reaction_type,
      comment_id: commentId,
      user_id: userId
    });

    return res.status(201).json({ message: `${reaction_type} 성공` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "에러 발생" });
  }
};
