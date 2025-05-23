const db = require("../models"),
  Comment = db.comment,
  CommentReaction = db.CommentReaction,
  User = db.User;
const { handleCommentNotification } = require('./commentAlterHandler');
function isValidUrl(sourceUrl) {
  try {
    const url = new URL(sourceUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (err) {
    return false;
  }
}


// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const { article_id, source, content } = req.body;
    const user_id = 1; //수정
    // // 로그인 확인
    // const user_id = req.user?.user_id;
    // if (!user_id) return res.status(401).send("로그인 필요");
    // url 검사
    if (!isValidUrl(source)) { return res.redirect(`/articles/${article_id}`) };

    const newComment = await Comment.create({
      article_id: article_id,
      source,
      content,
      user_id
    });

    // 알림 핸들러 호출
    await handleCommentNotification(article_id, newComment.comment_id, user_id);

    return res.redirect(`/articles/${article_id}`);
  } catch (err) {
    console.error("댓글 작성 중 에러:", err);
    res.status(500).send("작성 실패");
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  try {
    await Comment.destroy({ where: { comment_id: req.params.commentId } });
    res.redirect(`/articles/${req.body.article_id}`);
  } catch (err) {
    console.error("댓글 삭제 중 에러: ", err);
    res.status(500).send("삭제 실패");
  }
};

// 추천, 비추천 상호작용
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

// 댓글 리스트 조회
exports.getCommentsWithReactions = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    // 댓글 목록 조회
    const comments = await Comment.findAll({
      where: { article_id: articleId },
      include: [
        {
          model: CommentReaction,
          attributes: ['reaction_type', 'user_id']
        }
      ]
    });

    // 추천/비추천 수 계산
    const formattedComments = comments.map(comment => {
      const reactions = comment.comment_reactions || [];
      const likeCount = reactions.filter(r => r.reaction_type === 'like').length;
      const dislikeCount = reactions.filter(r => r.reaction_type === 'dislike').length;

      return {
        comment_id: comment.comment_id,
        content: comment.content,
        user_id: comment.user_id,
        createdAt: comment.createdAt,
        likeCount,
        dislikeCount
      };
    });

    res.json(formattedComments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '댓글 조회 실패' });
  }
};
