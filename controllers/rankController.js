const db = require("../models");
const User = db.users;
const UserRank = db.user_rank;

//:사용자의 등급 정보 조회
exports.getUserRank = async (req, res) => {
  try {
   i const userId = req.params.userId;

    const user = await User.findByPk(userId, {
      include: [{
        model: UserRank,
        as: 'rank',  // 관계 설정 시 alias로 설정했다면
        attributes: ['rank_name', 'min_comments', 'min_upvotes']
      }]
    });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({
      user_id: user.user_id,
      name: user.name,
      rank: user.rank.rank_name,
      commentRequirement: user.rank.min_comments,
      upvoteRequirement: user.rank.min_upvotes
    });
  } catch (err) {
    console.error("등급 조회 실패:", err);
    res.status(500).json({ message: "서버 오류로 등급 조회 실패" });
  }
};

