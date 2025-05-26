const db = require("../models"),
  factCheck = db.factCheckButton;

// 팩트체크 버튼
exports.createFactCheck = async (req, res) => {
  try {
    const { factCheck_type } = req.body;
    const article_id = req.params.articleId;
    const user_id = 2; // 수정

    // 이미 선택한 경우
    const existing = await factCheck.findOne({
      where: { article_id, user_id }
    });
    if (existing) {
      req.flash("selected", "이미 선택했습니다.");
      return res.redirect(`/articles/${article_id}`);
    }

    // 처음 선택하는 경우
    await factCheck.create({
      article_id,
      user_id,
      factCheck_type
    });

    return res.redirect(`/articles/${article_id}`);
  } catch (err) {
    console.log("팩트 체크 에러: ", err);
    res.status(500).send("버튼 실패");
  }
};