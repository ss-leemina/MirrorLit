module.exports = (sequelize, Sequelize) => {
  const CommentHistory = sequelize.define('comment_history', {
    article_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "articles",
        key: "article_id"
      },
      allowNull: false,
      primaryKey: true // ✅ 복합 기본키 1
    },
	  
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "comments",
        key: "comment_id"
      },
     // onDelete: "CASCADE"
      // primaryKey: true 
    },
    
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id"
      },
      onDelete: "CASCADE",
      primaryKey: true // ✅ 복합 기본키 2
    }
  },
  {
    timestamps: false,
    tableName: 'comment_history'
  });

  return CommentHistory;
};
