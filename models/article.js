module.exports = (sequelize, Sequelize) => {
  const article = sequelize.define("article", {
    article_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    press: {
      type: Sequelize.STRING(10),
      allowNull: false
    }
  },
    {
      timestamps: false,
      tableName: "articles"
    });
  return article;
}