module.exports = (sequelize, Sequelize) => {
  const CommentHistory = sequelize.define('comment_history', {
    article_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "articles",
        key: "article_id"
      },
      allowNull: false
    },
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "comments",
        key: "comment_id"
      },
      primaryKey: true
    },
    user_id: { //추가 수정 필요
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'comment_history'
  });

  return CommentHistory;
};
