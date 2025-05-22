module.exports = (sequelize, Sequelize) => {
  const comment = sequelize.define("comment", {
    comment_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        len: [1, 500]
      }
    },
    source: {
      type: Sequelize.STRING(512),
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    article_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "articles",
        key: "article_id",
      },
      onDelete: "CASCADE"
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id"
      },
      onDelete: "SET NULL"
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
  }, {
    timestamps: false,
    tableName: "comments"
  });
  return comment;
}
