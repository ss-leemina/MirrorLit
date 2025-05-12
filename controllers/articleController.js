const db = require("../models"),
  Article = db.article,
  ArticleImage = db.articleImage,
  Comment = db.comment,
  Op = db.Sequelize.Op;

// //기사 상세페이지 보여주기
exports.showArticle = async (req, res) => {
  let articleId = req.params.articleId;
  try {
    const foundArticle = await Article.findOne({
      where: { article_id: articleId },
      include: [
        {
          model: ArticleImage,
          attributes: ['image_url']
        },
        {
          model: Comment,
        }
      ],
      order: [[Comment, 'created_at', 'DESC']]
    });
    if (!foundArticle) {
      return res.status(404).send("기사 없음");
    }
    res.render("article", {
      article: foundArticle,
      iamge: foundArticle.ArticleImage || null,
      comments: foundArticle.comments
    });
  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
};


//기사 목록 보여주기
exports.showArticleList = async (req, res) => {
  try {
    data = await Article.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: ArticleImage,
          attributes: ['image_url']
        }
      ]
    });
    res.render('articlesList', { articles: data });
  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
};