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
      onDelete: "CASCADE",  // 댓글 삭제 시 이력도 삭제
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id"
      },
      onDelete: "CASCADE"
    }
  }, {
    timestamps: false,
    tableName: 'comment_history'
  });

  return CommentHistory;
};
