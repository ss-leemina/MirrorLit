const db = require("../models"),
  Comment = db.comment,
  CommentReaction = db.CommentReaction,
  User = db.User;
const { handleCommentNotification } = require('./commentAlterHandler');
const { evaluateUserRank } = require("../services/rankService");
const { isValidUrl } = require("../services/checkUrl");

// 댓글 작성
exports.createComment = async (req, res) => {
  try {
    const { article_id, source, content } = req.body;
    // 로그인 확인
    const user_id = req.user?.user_id;
    if (!user_id) {
      req.flash("notLogin", "로그인이 필요한 기능입니다.");
      return res.redirect(`/articles/${article_id}`);
    }
    // url 검사
    if (!isValidUrl(source)) { return res.redirect(`/articles/${article_id}`) };

    const newComment = await Comment.create({
      article_id: article_id,
      source,
      content,
      user_id
    });

    // 등급 평가 (댓글 수)
    await evaluateUserRank(user_id);

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
    const user_id = req.user?.user_id;
    // 로그인 안 한 경우
    if (!user_id) {
      req.flash("notLogin", "로그인이 필요한 기능입니다.");
      return res.redirect(`/articles/${req.body.article_id}`);
    }

    // 로그인 한 경우
    // 자기 자신의 댓글 삭제(가능)
    const deleteComment = await Comment.destroy({ where: { comment_id: req.params.commentId, user_id: user_id } });
    // 다른 사람의 댓글 삭제(불가)
    if (!deleteComment) {
      req.flash("noUser", "자기 자신의 댓글만 삭제할 수 있습니다.");
    }
    return res.redirect(`/articles/${req.body.article_id}`);
  } catch (err) {
    console.error("댓글 삭제 중 에러: ", err);
    res.status(500).send("삭제 실패");
  }
};

// 추천, 비추천 상호작용
exports.reactToComment = async (req, res) => {
  const userId =  req.user?.user_id;
  const commentId = parseInt(req.params.commentId);
  const {reaction_type } = req.body;
  const {article_id} = req.body;

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
      req.flash("reactionerror", "자신의 댓글에는 반응할 수 없습니다.");
      return res.redirect(`/articles/${article_id}`);
    }

    // 3. 이미 반응한 적 있는지 확인
    const existingReaction = await CommentReaction.findOne({
      where: { comment_id: commentId, user_id: userId }
    });
    if (existingReaction) {
      req.flash("reactionselected", "댓글에 이미 반응을 남겼습니다.");
      return res.redirect(`/articles/${article_id}`);
    }

    // 4. 새 반응 등록
    await CommentReaction.create({
      reaction_type,
      comment_id: commentId,
      user_id: userId
    });

    //등급 평가(추천수)
    await evaluateUserRank(userId);

    return res.redirect(`/articles/${article_id}`);

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
