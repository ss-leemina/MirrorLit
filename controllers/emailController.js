const crypto = require("crypto");
const db = require("../config/db");

exports.sendVerificationCode = async (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ message: "userId와 email을 입력해주세요." });
  }

  const code = crypto.randomBytes(3).toString("hex");
  const now = new Date();

  try {
    const query = `
      INSERT INTO email_verifications (is_verified, verification_code, sent_at, user_id)
      VALUES ('N', ?, ?, ?)
    `;
    await db.execute(query, [code, now, userId]);

    console.log(`[DEBUG] 인증 코드: ${code}`);
    res.status(200).json({
      message: "인증 코드가 생성되었습니다.",
      verificationCode: code // 실제 서비스에서는 제외
    });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};

exports.confirmVerificationCode = async (req, res) => {
  const { userId, code } = req.body;

  try {
    const [rows] = await db.execute(
      `SELECT * FROM email_verifications WHERE user_id = ? AND verification_code = ? AND is_verified = 'N'`,
      [userId, code]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "잘못된 인증 코드이거나 이미 인증되었습니다." });
    }

    const updateQuery = `
      UPDATE email_verifications SET is_verified = 'Y', verified_at = NOW()
      WHERE verification_id = ?
    `;
    await db.execute(updateQuery, [rows[0].verification_id]);

    // 사용자 테이블도 업데이트
    await db.execute(`UPDATE users SET email_verified = 'Y' WHERE user_id = ?`, [userId]);

    res.status(200).json({ message: "이메일 인증이 완료되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};