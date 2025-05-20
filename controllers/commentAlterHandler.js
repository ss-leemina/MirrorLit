const db = require("../models"),
  CommentHistory = db.comment_history,
  CommentAlert = db.comment_alert;

exports.handleCommentNotification = async (article_id, comment_id, user_id) => {
  try {
    await CommentHistory.create({ article_id, comment_id, user_id });

    const participants = await CommentHistory.findAll({  // 게시글 참여자 조회(중복 제거)
      where: { article_id },
      attributes: ['user_id'],
      group: ['user_id']
    });

    for (const participant of participants) {  
      if (participant.user_id !== user_id) {
        await CommentAlert.create({
          comment_id,
          user_id: participant.user_id,
          alert_message: '새 댓글이 등록되었습니다.',
          is_checked: 'N'  
        });

        if (global.sendSSE) {
          global.sendSSE(participant.user_id, '새 댓글 알림이 있습니다.');
        }
      }
    }
  } catch (err) {
    console.error("댓글 알림 처리 에러:", err);
  }
};
