const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

//사용자 알림 조회
router.get('/:user_id', alertController.getAlertsByUser);

//알림 읽음 처리
router.post('/alert/:alert_id/read', alertController.markAlertAsRead);
router.post('/notification/:notification_id/read', alertController.markNotificationAsRead);

// 모든 알림 읽음 처리
router.post('/:user_id/readAll', alertController.markAlertAsReadAll);

// 알림 삭제
router.post('/alert/:alert_id/delete', alertController.deleteAlert);
router.post('/notification/:notification_id/delete', alertController.deleteNotification);

// 모든 알림 삭제
router.post('/:user_id/deleteAll', alertController.deleteAlertAll);

module.exports = router;
