const db = require("../models"),
  Article = db.article,
  ArticleImage = db.articleImage,
  Comment = db.comment,
  FactCheck = db.factCheckButton,
  User = db.User,
  UserRank = db.UserRank,
  Op = db.Sequelize.Op;
const { getfactCheckCount } = require("../services/getFactCheck");
const { getCommentCount } = require("../services/getComment");
const { getReactionCount } = require("../services/getReaction");

// 기사 목록 페이지
exports.showArticleList = async (req, res) => {
  try {
    const rawKeyword = req.query.search;
    const keyword = typeof rawKeyword === "string" ? rawKeyword.trim() : null;

    let data = [];

    // 기사 리스트 보여주기
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
    } // 검색(공백이 아닌 경우)
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


// 기사 상세페이지
exports.showArticle = async (req, res) => {
  const articleId = req.params.articleId;
  const factCounts = await getfactCheckCount(articleId);
  const commentCounts = await getCommentCount(articleId);
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
          include: [
            {
              model: User,
              attributes: ['name'],
              include: [
                {
                  model: UserRank,
                  attributes: ['rank_name'],
                  as: 'user_rank'
                }
              ]
            }
          ]
        }
      ],
      order: [[Comment, 'created_at', 'DESC']]
    });

    if (!foundArticle) {
      return res.status(404).send("기사 없음");
    }
    const enrichedComments = await Promise.all(
      foundArticle.comments.map(async comment => {
       const reactions = await getReactionCount(comment.comment_id);
       return {
         ...comment.dataValues,
         likeCount: reactions.like,
         dislikeCount: reactions.dislike
        };
       })
    );
    
    res.render("article", {
      article: foundArticle,
      iamge: foundArticle.ArticleImage || null,
      comments: enrichedComments,
      factCounts,
      commentCounts
    });
  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
};
