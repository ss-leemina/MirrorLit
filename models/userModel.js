const bcrypt = require("bcrypt");

module.exports =  (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
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
      password: {
        type: Sequelize.STRING(100), //bcrypt 해시 길이 때문에 100으로 설정
        allowNull: false
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
      level_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      email_verified: {
        type: Sequelize.ENUM("Y", "N"),
        allowNull: false,
        defaultValue: "N"
      },
      
      // passport-local-sequelize 용 해시/솔트 필드
      myhash: Sequelize.STRING,
      mysalt: Sequelize.STRING
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );


  User.prototype.passwordComparison = function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
  };

  User.beforeCreate(async (user, options) => {
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);
});


User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
});

  return User;
};


