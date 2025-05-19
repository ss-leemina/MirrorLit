const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const {
  createUser,
  findUserById,
  updatePassword,
  updateEmailVerifiedStatus,
} = require("../models/userModel");

const register = async (req, res) => {
  const { id, password, name, email } = req.body;

  if (!id || !password || !name || !email) {
    return res.status(400).send("아이디, 비밀번호, 이름, 이메일을 모두 입력해주세요.");
  }

  const existing = await findUserById(id);
  if (existing) {
    return res.status(409).send("이미 존재하는 사용자입니다.");
  }

  const hashedPw = await bcrypt.hash(password, 10);
  await createUser(id, hashedPw, name, email);
  res.status(201).send("회원가입 성공");
};

const loginUser = async (req, res) => {
  const { id, password } = req.body;

  const user = await findUserById(id);
  if (!user) {
    return res.status(401).json({ message: "아이디 또는 비밀번호가 일치하지 않습니다." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "아이디 또는 비밀번호가 일치하지 않습니다." });
  }

  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    message: "로그인 성공!",
    token,
  });
};

const logoutUser = async (req, res) => {
  res.status(200).json({ message: "로그아웃 성공!" });
};

const resetPassword = async (req, res) => {
  const { id } = req.body;

  const user = await findUserById(id);
  if (!user) {
    return res.status(404).json({ message: "존재하지 않는 아이디입니다." });
  }

  res.status(200).json({ message: "비밀번호 찾기 요청이 확인되었습니다." });
};

const verifyEmail = async (req, res) => {
  const { userId, status } = req.body;

  try {
    await updateEmailVerifiedStatus(userId, status);
    res.status(200).json({ message: "이메일 인증 상태가 업데이트되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};

module.exports = {
  register,
  loginUser,
  logoutUser,
  resetPassword,
  verifyEmail,
};