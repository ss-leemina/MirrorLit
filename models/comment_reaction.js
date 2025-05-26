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
      references: {
        model: "comments",
        key: "comment_id"
      },
      allowNull: true,
      //onDelete: "SET NULL"
    },
    user_id: { //추가 수정 필요
      type: Sequelize.INTEGER,

    }
  }, {
    timestamps: false,
    tableName: 'comment_reaction'
  });

  return CommentReaction;
};
