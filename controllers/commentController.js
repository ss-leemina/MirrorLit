const db = require("../models"),
  Comment = db.comment;

exports.createComment = async (req, res) => {
  try {
    const { article_id, source, content } = req.body;
    await Comment.create({
      article_id: article_id,
      source,
      content,
      user_id: 1
    });

    res.redirect(`/articles/${article_id}`);
  } catch (err) {
    console.error("댓글 작성 중 에러:", err);
    res.status(500).send("작성 실패");
  }
};