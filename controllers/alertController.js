const db = require("../models"),
  CommentAlert = db.CommentAlert,
  Comment = db.comment;

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
    const Alert = await CommentAlert.findOne({ where: { alert_id: alertId} });

    // 알림이 읽지 않음 상태일 때만 읽음 처리
    if(Alert.getDataValue('is_checked') === 'N') {
      const updated = await CommentAlert.update(
        { is_checked: 'Y' },
        { where: { alert_id: alertId } }
      );

      if (updated[0] === 0) {
        return res.status(404).json({ message: "해당 알림을 찾을 수 없습니다." });
      }
    }
    console.log("알림을 읽음으로 표시했습니다.");

    // 알림이 온 기사로 redirection
    const commentId = Alert.getDataValue('comment_id');
    const alrComment = await Comment.findOne({ where: { comment_id: commentId } });
    const articleId = alrComment.getDataValue('article_id');

    return res.redirect(`/articles/${articleId}`);
  } catch (err) {
    console.error("알림 읽음 처리 실패:", err);
    res.status(500).json({ message: "알림 상태 변경 실패" });
  }
};

// 모든 알림 읽음 처리
exports.markAlertAsReadAll = async (req, res) => {
  try {
    // 사용자의 모든 알림 확인
    const userId = req.params.user_id;

    const alerts = await CommentAlert.findAll({
      where: { user_id: userId },
      order: [['alert_id', 'DESC']]
    });

    // 각 알림을 읽음으로 표시
    await alerts.forEach(alr => {
      if(alr.getDataValue('is_checked') === 'N')
        CommentAlert.update(
          { is_checked: 'Y'},
          { where: { alert_id: alr.alert_id } }
        );
    });
    console.log("알림을 읽음으로 표시했습니다.");

    // 기존 페이지 또는 홈페이지로 redirection
    return res.redirect(req.headers.referer || "/home");
  } catch (err) {
    console.error("알림 모두 읽음 처리 실패:", err);
    res.status(500).json({ message: "모든 알림 상태 변경 실패" });
  }
};

// 알림 삭제
exports.deleteAlert = async (req, res) => {
  try {
    const alertId = req.params.alert_id;
    await CommentAlert.destroy({ where: { alert_id: alertId } });
    console.log("알림을 삭제했습니다.");

    // 기존 페이지 또는 홈페이지로 redirection
    return res.redirect(req.headers.referer || "/home");
  } catch (err) {
    console.error("알림 삭제 실패:", err);
    res.status(500).json({ message: "알림 삭제 실패" });
  }
};

// 모든 알림 삭제
exports.deleteAlertAll = async (req, res) => {
  try {
    // 사용자의 모든 알림 확인
    const userId = req.params.user_id;

    const alerts = await CommentAlert.findAll({
      where: { user_id: userId },
      order: [['alert_id', 'DESC']]
    });

    // 각 알림 삭제
    await alerts.forEach(alr => {
      CommentAlert.destroy({ where: { alert_id: alr.alert_id } });
    });
    console.log("모든 알림을 삭제했습니다.");

    // 기존 페이지 또는 홈페이지로 redirection
    return res.redirect(req.headers.referer || "/home");
  } catch (err) {
    console.error("알림 모두 삭제 실패:", err);
    res.status(500).json({message: "모든 알림 삭제 실패" });
  }
};
