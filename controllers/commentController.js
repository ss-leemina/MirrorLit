const db = require("../models"),
  Comment = db.comment;

// 댓글 작성
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

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    await Comment.destroy({ where: { comment_id: req.params.commentId } });
    res.redirect('/articles/' + req.body.article_id);
  } catch (err) {
    console.error("댓글 삭제 중 에러: ", err);
    res.status(500).send("삭제 실패");
  }
};