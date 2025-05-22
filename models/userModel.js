const { Sequelize, DataTypes } = require("sequelize");
const passportLocalSequelize = require("passport-local-sequelize");
require("dotenv").config();
const db = require("../config/db");


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql"
  }
);


const User = sequelize.define("users", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id: {
    type: DataTypes.STRING,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  name: DataTypes.STRING,
  password: DataTypes.STRING,
  myhash: DataTypes.STRING,
  mysalt: DataTypes.STRING
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

module.exports = {
  sequelize,
  User,
  createUser,
  findUserById,
  updatePassword,
  updateEmailVerifiedStatus,
};