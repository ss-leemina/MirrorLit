module.exports = (sequelize, Sequelize) => {
  const articleImage = sequelize.define("articleImage", {
    image_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    image_url: {
      type: Sequelize.STRING(512),
      allowNull: false
    },
    article_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "articles",
        key: "article_id"
      },
      onDelete: "CASCADE"
    }
  },
    {
      timestamps: false,
      tableName: "article_images"
    });
  return articleImage;
}