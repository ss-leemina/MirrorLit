// const { SELECT } = require("sequelize/lib/query-types");
module.exports = (sequelize, Sequelize) => {
  const comment = sequelize.define("comment", {
    comment_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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
      allowNull: false
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
    user_id: {  //user 테이블 생기면 수정
      type: Sequelize.INTEGER,
      allowNull: true,
      // onDelete: "SETNULL"
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: false,
    tableName: "comments"
  });
  return comment;
}