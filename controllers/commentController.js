const db = require("../models"),
  Comment = db.comment,
  CommentReaction = db.CommentReaction;

//댓글 작성
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

//댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    await Comment.destroy({ where: { comment_id: req.params.commentId } });
    res.redirect('/articles/' + req.body.article_id);
  } catch (err) {
    console.error("댓글 삭제 중 에러: ", err);
    res.status(500).send("삭제 실패");
  }
};

//추천, 비추천 상호작용
exports.reactToComment = async (req, res) => {
  const userId = req.body.user_id;
  const commentId = parseInt(req.params.commentId);
  const { reaction_type } = req.body;

  if (!['like', 'dislike'].includes(reaction_type)) {
    return res.status(400).json({ message: "추천 또는 비추천만 가능합니다." });
  }

  try {
    // 1. 댓글 존재 여부 및 작성자 확인
    const comment = await Comment.findOne({
      where: { comment_id: commentId }
    });

    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 2. 자신의 댓글에는 추천/비추천 불가
    if (comment.user_id === userId) {
      return res.status(403).json({ message: "자신의 댓글에는 반응할 수 없습니다." });
    }

    // 3. 이미 반응한 적 있는지 확인
    const existingReaction = await CommentReaction.findOne({
      where: { comment_id: commentId, user_id: userId }
    });
    if (existingReaction) {
      return res.status(400).json({ message: "댓글에 이미 반응을 남겼습니다." });
    }

    // 4. 새 반응 등록
    await CommentReaction.create({
      reaction_type,
      comment_id: commentId,
      user_id: userId
    });

    return res.status(201).json({ message: `${reaction_type} 성공` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "에러 발생" });
  }
};
