const passportLocalSequelize = require("passport-local-sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id: {
      type: Sequelize.STRING(20),
      unique: true,
      allowNull: false
    },
    //등급 저장
    rank_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'user_rank',
        key: 'rank_id'
      },
      defaultValue: 1 //신규: 1 기존: 2
    },

    email: {
      type: Sequelize.STRING(50),
      unique: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(10),
      unique: true,
      allowNull: false
    },
    registerDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: true
    },

    email_verified: {
      type: Sequelize.ENUM("Y", "N"),
      allowNull: false,
      defaultValue: "N"
    },

    // passport-local-sequelize 용 해시/솔트 필드
    myhash: {
      type: Sequelize.STRING(1024),
      allowNull: false
    },
    mysalt: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  },
    {
      timestamps: false,
      tableName: "users"
    });

  passportLocalSequelize.attachToUser(User, {
    usernameField: "id",
    hashField: "myhash",
    saltField: "mysalt"
  });

<<<<<<< HEAD
  User.prototype.passwordComparison = function (password, cb) {
  return User.authenticate(password, this.myhash, this.mysalt, cb);
};
=======


  //User.beforeCreate(async (user, options) => {
  //const bcrypt = require("bcrypt");
  //const saltRounds = 10;
  //user.password = await bcrypt.hash(user.password, saltRounds);
  //});

  //User.beforeUpdate(async (user, options) => {
  //if (user.changed('password')) {
  //const bcrypt = require("bcrypt");
  //const saltRounds = 10;
  //user.password = await bcrypt.hash(user.password, saltRounds);
  //}
  //});


>>>>>>> cfcc1d190ac4171989714a2ab0e93bae3e6d92f6

  return User;
}