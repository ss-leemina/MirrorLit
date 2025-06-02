const db = require("../models"),
  Comment = db.comment;

//기사 댓글 세기
const getCommentCount = async (article_id) => {
  const counts = await Comment.count({
    where: { article_id }
  });
  return counts;
};

//유저 댓글 세기
const getUserCommentCount = async (user_id) => {
  const counts = await Comment.count({
    where: { user_id }
  });
  return counts;
};

module.exports = { getCommentCount, getUserCommentCount };