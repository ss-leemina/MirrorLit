const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rankController');

// GET /rank/user/:userId
router.get('/user/:userId', rankController.getUserRank);

module.exports = router;

