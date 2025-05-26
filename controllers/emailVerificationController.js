const db = require("../models");
const EmailVerification = db.EmailVerification;
const User = db.User;


const sendVerificationCode = async (req, res) => {
  try {
    const { userId } = req.params;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 코드
    const sent_at = new Date();

    await EmailVerification.create({
      user_id: userId,
      code,
      sent_at,
      verified: 'N'
    });

    console.log(`[DEBUG] 사용자 ${userId}에게 인증 코드 전송됨: ${code}`);
    req.flash("success", "인증 코드가 전송되었습니다.");
    res.redirect(`/users/${userId}/verify`);
  } catch (err) {
    console.error("코드 전송 실패:", err);
    res.status(500).send("코드 전송 실패");
  }
};


const verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    const user_id = req.params.userId;

    const record = await EmailVerification.findOne({
      where: { user_id, code, verified: 'N' }
    });

    if (!record) {
      req.flash("error", "잘못된 코드이거나 이미 인증되었습니다.");
      return res.redirect(`/users/${user_id}/verify`);
    }

    const now = new Date();
    const sentTime = new Date(record.sent_at);
    const diffMs = now - sentTime;

    if (diffMs > 5 * 60 * 1000) {
      req.flash("error", "인증 코드가 만료되었습니다.");
      return res.redirect(`/users/${user_id}/verify`);
    }

    await record.update({ verified: 'Y', verified_at: now });

    await User.update(
      { email_verified: 'Y' },
      { where: { id: user_id } } 
    );

    req.flash("success", "이메일 인증이 완료되었습니다.");
    return res.redirect(`/users/${user_id}/profile`);
  } catch (err) {
    console.log("이메일 인증 실패:", err);
    res.status(500).send("이메일 인증 실패");
  }
};


module.exports = {
  sendVerificationCode,
  verifyCode
};
