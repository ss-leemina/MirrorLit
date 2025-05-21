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

  // 댓글-댓글 반응 1:N 관계
  db.comment.hasMany(db.CommentReaction, {
    foreignKey: 'comment_id',
    as: 'comment_reactions',  // alias로 eager loading할 때 사용 가능
    onDelete: "CASCADE"
  });
  db.CommentReaction.belongsTo(db.comment, {
    foreignKey: 'comment_id'
  });
}
