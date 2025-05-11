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