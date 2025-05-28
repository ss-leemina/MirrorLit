module.exports = (sequelize, Sequelize) => {
  const CommentReaction = sequelize.define('comment_reaction', {
    reaction_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    reaction_type: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "comments",
        key: "comment_id",
        onDelete: "SET NULL"
      },
    },
    user_id: { 
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id"
      },
      onDelete: "SET NULL"
    }
  }, {
    timestamps: false,
    tableName: 'comment_reaction'
  });

  return CommentReaction;
};
