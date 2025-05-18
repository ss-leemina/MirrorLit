const db = require("../config/db");

const createUser = async (id, hashedPw, name, email) => {
  const [result] = await db.query(
    "INSERT INTO users (id, password, name, email) VALUES (?, ?, ?, ?)",
    [id, hashedPw, name, email]
  );
  return result;
};

const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

module.exports = { createUser, findUserById };