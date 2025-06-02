const db = require("../models"),
  Comment = db.comment;

const checkSpamComment = async ({ user_id, article_id }) => {
  const recentComment = await Comment.findOne({
    where: { user_id, article_id },
    order: [['created_at', 'DESC']]
  });

  if (recentComment) {
    const now = new Date();
    const diffSec = (now - recentComment.created_at) / 1000;

    if (diffSec < 15) { //15초 이내에 새로운 댓글 작성
      return {
        type: 'tooFast',
        message: '너무 빠르게 댓글을 작성하고 있습니다.'
      };
    }
  }

  return null; 
};

module.exports = { checkSpamComment };
