const db = require("../models"),
  Article = db.article,
  ArticleImage = db.articleImage,
  Comment = db.comment,
  Op = db.Sequelize.Op;

//기사 목록 페이지
exports.showArticleList = async (req, res) => {
  try {
    const rawKeyword = req.query.search;
    const keyword = typeof rawKeyword === "string" ? rawKeyword.trim() : null;

    let data = [];

    //기사 리스트 보여주기
    if (keyword == undefined) {
      data = await Article.findAll({
        order: [['created_at', 'DESC']],
        include: [
          {
            model: ArticleImage,
            attributes: ['image_url']
          }
        ]
      });
    } //검색(공백이 아닌 경우)
    else if (keyword && keyword.length > 0) {
      data = await Article.findAll({
        order: [['created_at', 'DESC']],
        include: [
          {
            model: ArticleImage,
            attributes: ['image_url']
          }
        ],
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } },
            { content: { [Op.like]: `%${keyword}%` } },
            { author: { [Op.like]: `%${keyword}%` } },
            { press: { [Op.like]: `%${keyword}%` } }
          ]
        }
      });
    } // 공백으로 검색 
    else {
      data: [];
    }
    res.render('articlesList', { articles: data, keyword: keyword });
  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
};


//기사 상세페이지
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

//팩트체크 버튼
exports.factCheckButton = async (req, res) => {
  const articleId = req.params.articleId;
  console.log(`articleId: ${articleId}`);
  res.redirect(`/articles/${articleId}`);
}