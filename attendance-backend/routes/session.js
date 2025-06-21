const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

router.post('/', async (req, res) => {
  const { className, sessionId } = req.body;

  if (!className || !sessionId) {
    return res.status(400).json({ message: 'className and sessionId are required' });
  }

  try {
    const session = new Session({ className, sessionId });
    await session.save();
    res.status(200).json({ message: 'Session created' });
  } catch (err) {
    console.error('❌ Failed to create session:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
