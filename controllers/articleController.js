const db = require("../db");

//기사 목록 보여주기
exports.showArticleList = (req, res) => {
  const sql = 'SELECT article_id, title, press, created_at FROM articles'
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("db 오류");
    res.render('articlesList', { articles: results });
  });
};

//기사 상세페이지 보여주기
exports.showArticle = (req, res) => {
  let articleId = req.params.articleId;
  const sql = 'SELECT * FROM articles WHERE article_id = ?'
  db.query(sql, [articleId], (err, results) => {
    if (err) return res.status(500).send("db 오류");
    if (results.length === 0) return res.status(404).send("기사 없음");
    res.render('article', { article: results[0] });
  });
};

