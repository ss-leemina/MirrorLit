const db = require("../models"),
  Comment = db.comment;

exports.getCommentAnonymousNo = async (article_id, user_id) => {
  const existingAnonyNo = await Comment.findOne({
    where: { article_id, user_id }
  });

  if (existingAnonyNo) return existingAnonyNo.anonymous_no;

  const maxAnonyNo = await Comment.findOne({
    where: { article_id },
    order: [['anonymous_no', 'DESC']]
  });

  return maxAnonyNo ? maxAnonyNo.anonymous_no + 1 : 1;
};
