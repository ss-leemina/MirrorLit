const db = require("../models"),
  CommentHistory = db.CommentHistory,
  CommentAlert = db.CommentAlert;

exports.handleCommentNotification = async (article_id, comment_id, user_id) => {
  try {
    // 해당 사용자의 댓글 기록이 있는지 확인
    const existing = await CommentHistory.findOne({
      where: { article_id, user_id }
    });
    console.log('기존 기록 조회:', existing);

    // 기록이 없으면 추가
    if (!existing) {
      await CommentHistory.create({ article_id,comment_id, user_id }); //comment_id 제거
    }

    const participants = await CommentHistory.findAll({  
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
