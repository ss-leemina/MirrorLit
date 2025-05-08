const db = require("../db");

//기사 상세페이지 보여주기
exports.showArticle = (req, res) => {
  let articleId = req.params.articleId;
  const sql_article = 'SELECT * FROM articles WHERE article_id = ?';
  const sql_image = 'SELECT * FROM article_images WHERE article_id = ?';

  //기사 정보 가져오기
  db.query(sql_article, [articleId], (err, articleResults) => {
    if (err) return res.status(500).send("db 오류");
    if (articleResults.length === 0) return res.status(404).send("기사 없음");

    //기사 사진 정보 가져오기
    db.query(sql_image, [articleId], (err, imageResults) => {
      if (err) return res.status(500).send("이미지 오류");

      res.render('article', {
        article: articleResults[0],
        image: imageResults[0] || null
      });
    });
  });
};


//기사 목록 보여주기
exports.showArticleList = (req, res) => {
  const sql = 'SELECT article_id, title, press, created_at FROM articles';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("db 오류");
    res.render('articlesList', { articles: results });
  });
};