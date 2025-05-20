const express = require('express');
const router = express.Router();
const sseManager = require('../sse/sseManager');

router.get('/:user_id', (req, res) => {
  const userId = parseInt(req.params.user_id, 10);

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  sseManager.addClient(userId, res);

  const keepAlive = setInterval(() => {
    res.write(`event: ping\ndata: keep-alive\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(keepAlive);
    sseManager.removeClient(userId);
  });
});

module.exports = router;
