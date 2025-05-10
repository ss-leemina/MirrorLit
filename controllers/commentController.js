const db = require('../db');

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