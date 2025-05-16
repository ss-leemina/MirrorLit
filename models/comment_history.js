
module.exports = (sequelize, Sequelize) => {
  const CommentHistory = sequelize.define('comment_history', {
    article_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'comment_history'
  });

  return CommentHistory;
};
