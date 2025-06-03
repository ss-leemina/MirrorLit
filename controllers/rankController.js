const db = require("../models");
const User = db.User,
  UserRank = db.UserRank,
  Comment = db.comment,
  Reaction = db.CommentReaction;
const { getUserCommentCount } = require("../services/getComment");

exports.getUserRank = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId, {
      include: [{
        model: UserRank,
        as: 'user_rank',
        attributes: ['rank_name', 'min_comments', 'min_upvotes']
      }]
    });

    if (!user) {
      return res.status(404).render("mypage", {
        user: null,
        errorMessage: "사용자를 찾을 수 없습니다."
      });
    }
    //댓글 수 확인
    const commentCount = await getUserCommentCount(userId);

    //추천 수 확인
    const upvoteCount = await Reaction.count({
      where: {
        user_id: userId,
        reaction_type: 'like'
      }
    });

    return res.render("mypage", {
      user,
      commentCount,
      upvoteCount
    });

  } catch (err) {
    console.error("등급 조회 실패:", err);
    return res.status(500).render("mypage", {
      user: null,
      errorMessage: "서버 오류로 마이페이지를 불러올 수 없습니다."
    });
  }
};
