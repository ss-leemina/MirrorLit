const passportLocalSequelize = require("passport-local-sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    name: Sequelize.STRING,
    password: Sequelize.STRING,
    myhash: Sequelize.STRING,
    mysalt: Sequelize.STRING,
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
