const db = require("../db");

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
  createUser,
  findUserById,
  updatePassword,
  updateEmailVerifiedStatus,
};
