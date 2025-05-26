module.exports = (db) => {
  //사용자-기사 N:M 관계
  db.User.belongsToMany(db.article, {
    through: "user_reads",
    foreignKey: "user_id",
    otherKey: "article_id",
    timestamps: false
  });
  db.article.belongsToMany(db.User, {
    through: "user_reads",
    foreignKey: "article_id",
    otherKey: "user_id",
    timestamps: false
  });

  //기사-기사이미지 1:1 관계
  db.article.hasOne(db.articleImage, {
    foreignKey: {
      name: "article_id",
      allowNull: false
    },
    onDelete: "CASCADE"
  });
  db.articleImage.belongsTo(db.article, {
    foreignKey: "article_id"
  });

  //기사-댓글 1:N 관계
  db.article.hasMany(db.comment, {
    foreignKey: "article_id",
    onDelete: "CASCADE"
  });
  db.comment.belongsTo(db.article, {
    foreignKey: "article_id"
  });

  //기사-팩트체크버튼 1:N
  db.article.hasMany(db.factCheckButton, {
    foreignKey: "article_id",
    allowNull: false,
    onDelete: "CASCADE"
  });
  db.factCheckButton.belongsTo(db.article, {
    foreignKey: "article_id"
  });

  //사용자-팩트체크버튼 1:N
  db.User.hasMany(db.factCheckButton, {
    foreignKey: "user_id",
    allowNull: false
  });
  db.factCheckButton.belongsTo(db.User, {
    foreignKey: "user_id"
  });

  //사용자-댓글 1:N관계
  db.User.hasMany(db.comment, {
    foreignKey: "user_id",
    onDelete: "SET NULl"
  });
  db.comment.belongsTo(db.User, {
    foreignKey: "user_id"
  });

  // 댓글-댓글 반응 1:N 관계
  db.comment.hasMany(db.CommentReaction, {
    foreignKey: 'comment_id',
    as: 'comment_reactions',  // alias로 eager loading할 때 사용 가능
    onDelete: "CASCADE"
  });
  db.CommentReaction.belongsTo(db.comment, {
    foreignKey: 'comment_id',
    onDelete: "SET NULL",       
    onUpdate: "CASCADE"
  });

  // 사용자-이메일인증 1:N 관계
  db.User.hasMany(db.EmailVerification, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
  });
  db.EmailVerification.belongsTo(db.User, {
    foreignKey: "user_id"
  });

}
