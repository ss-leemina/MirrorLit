const db = require("../models");
const EmailVerification = db.EmailVerification;
const User = db.User;


const sendVerificationCode = async (req, res) => {
  try {
    const { email, name, id, password, confirmPassword } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sent_at = new Date();

    await EmailVerification.create({
      email,
      user_id: null,
      code,
      sent_at,
      verified: 'N'
    });

    console.log(`[DEBUG] ${email}로 인증 코드 전송됨: ${code}`);
    req.flash("success", "인증 코드가 전송되었습니다.");
    return res.render("new", {
      email, name, id, password, confirmPassword,
      messages: req.flash()
    });
  } catch (err) {
    console.error("코드 전송 실패:", err);
    req.flash("error", "인증 코드 전송에 실패했습니다.");
    return res.render("new", {
      email: req.body.email,
      name: req.body.name,
      id: req.body.id,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      messages: req.flash()
    });
  }
};


const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await EmailVerification.findOne({
      where: { email, code, verified: 'N' }
    });

    if (!record) {
      req.flash("error", "잘못된 코드이거나 이미 인증되었습니다.");
      return res.redirect("/users/new");
    }

    const now = new Date();
    const sentTime = new Date(record.sent_at);
    const diffMs = now - sentTime;

    if (diffMs > 5 * 60 * 1000) {
      req.flash("error", "인증 코드가 만료되었습니다.");
      return res.redirect("/users/new");
    }

    await record.update({ verified: 'Y', verified_at: now });

    req.flash("success", "이메일 인증이 완료되었습니다.");
    return res.redirect("/users/new");
  } catch (err) {
    console.error("이메일 인증 실패:", err);
    res.status(500).send("이메일 인증 실패");
  }
};




module.exports = {
  sendVerificationCode,
  verifyCode
};
