const db = require("../db");

//기사 상세페이지 보여주기
exports.showArticle = (req, res) => {
  let articleId = req.params.articleId;
  const sql_article = 'SELECT * FROM articles WHERE article_id = ?';
  const sql_image = 'SELECT * FROM article_images WHERE article_id = ?';
  const sql_comment = 'SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC';

  //기사 정보 가져오기
  db.query(sql_article, [articleId], (err, articleResults) => {
    if (err) return res.status(500).send("db 오류");
    if (articleResults.length === 0) return res.status(404).send("기사 없음");

    //기사 사진 정보 가져오기
    db.query(sql_image, [articleId], (err, imageResults) => {
      if (err) return res.status(500).send("이미지 오류");

      //기사 댓글 가져오기
      db.query(sql_comment, [articleId], (err, commentResults) => {
        if (err) return res.status(500).send("댓글 오류");

        res.render('article', {
          article: articleResults[0],
          image: imageResults[0] || null,
          comments: commentResults
        });
      });
    });
  });
};


//기사 목록 보여주기
exports.showArticleList = (req, res) => {
  const sql = 'SELECT articles.article_id, articles.title, articles.press, articles.created_at, article_images.image_url FROM articles LEFT JOIN article_images ON articles.article_id = article_images.article_id ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("db 오류");
    }
    res.render('articlesList', { articles: results });
  });
};