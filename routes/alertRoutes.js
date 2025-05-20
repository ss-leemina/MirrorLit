const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

//사용자 알림 조회
router.get('/:user_id', alertController.getAlertsByUser);

//알림 읽음 처리
router.patch('/:alert_id/read', alertController.markAlertAsRead);

module.exports = router;
