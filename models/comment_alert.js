module.exports = (sequelize, Sequelize) => {
  const CommentAlert = sequelize.define('comment_alert', {
    alert_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    alert_message: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    comment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "comments",
        key: "comment_id"
      },
      onDelete: "CASCADE"
    },
    user_id: { 
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id"
      },
      onDelete: "CASCADE"
    },
    is_checked: {
      type: Sequelize.STRING(5),
      allowNull: false,
      defaultValue: 'N'
    }
  }, {
    timestamps: false,
    tableName: 'comment_alert'
  });

  return CommentAlert;
};
