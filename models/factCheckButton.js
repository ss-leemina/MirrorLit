module.exports = (sequelize, Sequelize) => {
  const factCheckButton = sequelize.define("factCheckButton", {
    article_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "articles",
        key: "article_id"
      },
      onDelete: "CASCADE"
    },
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: "users",
        key: "user_id"
      }
    },
    factCheck_type: {
      type: Sequelize.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['팩트다', '아니다']]
      }
    }
  }, {
    timestamps: false,
    tableName: "factCheckButtons"
  });
  return factCheckButton;
}