const db = require("../models"),
  Reaction = db.CommentReaction;

const getReactionCount = async (comment_id) => {
  const counts = await Reaction.findAll({
    attributes: [
      'reaction_type',
      [db.Sequelize.fn('COUNT', db.Sequelize.col('reaction_type')), 'count']
    ],
    where: { comment_id },
    group: ['reaction_type'],
    raw: true
  });

  const result = { like: 0, dislike: 0 };
  counts.forEach(({ reaction_type, count }) => {
    result[reaction_type] = parseInt(count, 10);
  });

  return result;
};

module.exports = { getReactionCount };
