module.exports = (db) => {
  //기사-기사이미지 1:1 관계
  db.article.hasOne(db.articleImage, {
    foreignKey: {
      name: "article_id",
      allowNull: false
    },
    onDelete: "CASCADE"
  });
  db.articleImage.belongsTo(db.article, {
    foreignKey: { name: 'article_id' }
  });

  //기사-댓글 1:N 관계
  db.article.hasMany(db.comment, {
    foreignKey: {
      name: "article_id"
    },
    onDelete: "CASCADE"
  });
  db.comment.belongsTo(db.article, {
    foreignKey: { name: "article_id" }
  });
}