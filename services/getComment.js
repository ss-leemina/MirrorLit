const db = require("../models"),
  Comment = db.comment;

const getCommentCount = async (article_id) => {
  const counts = await Comment.count({
    where: { article_id }
  });
  return counts;
};

module.exports = { getCommentCount };