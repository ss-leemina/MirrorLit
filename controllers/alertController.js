const db = require("../models"),
  CommentAlert = db.comment_alert;

// 알림 목록 조회
exports.getAlertsByUser = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const alerts = await CommentAlert.findAll({
      where: { user_id: userId },
      order: [['alert_id', 'DESC']]
    });

    res.status(200).json(alerts);
  } catch (err) {
    console.error("알림 조회 실패:", err);
    res.status(500).json({ message: "알림을 불러오지 못했습니다." });
  }
};

// 알림 읽음 처리
exports.markAlertAsRead = async (req, res) => {
  try {
    const alertId = req.params.alert_id;

    const updated = await CommentAlert.update(
      { is_checked: 'Y' },
      { where: { alert_id: alertId } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: "해당 알림을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "알림을 읽음으로 표시했습니다." });
  } catch (err) {
    console.error("알림 읽음 처리 실패:", err);
    res.status(500).json({ message: "알림 상태 변경 실패" });
  }
};
