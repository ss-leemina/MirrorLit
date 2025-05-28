const passportLocalSequelize = require("passport-local-sequelize");

module.exports =  (sequelize, Sequelize) => {
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
      reference: {
        model: 'user_rank',
        key: 'rank_id'
      },
      defaultValue: 1 //신규: 1 기존: 2
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
      timestamps: false,
      tableName: "users"
    });

  passportLocalSequelize.attachToUser(User, {
    usernameField: "email",
    hashField: "myhash",
    saltField: "mysalt"
  });

  const createUser = async (id, password, name, email) => {
    const query = `
      INSERT INTO users (id, password, name, email)
      VALUES (?, ?, ?, ?)
    `;
    await db.execute(query, [id, password, name, email]);
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

  const findUserById = async (id) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  };

  const updatePassword = async (userId, newPassword) => {
    const query = `UPDATE users SET password = ? WHERE id = ?`;
    await db.execute(query, [newPassword, userId]);
  };

  const updateEmailVerifiedStatus = async (userId, status) => {
    const query = `UPDATE users SET email_verified = ? WHERE user_id = ?`;
    await db.execute(query, [status, userId]);
  };

  return User;
}