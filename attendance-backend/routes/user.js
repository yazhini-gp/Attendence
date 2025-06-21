const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, password, role });
    await newUser.save();
    console.log('✅ New user signed up:', username, 'as', role);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: '❌ User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: '❌ Incorrect password' });
    }

    console.log("🔐 Login successful:", username);
    res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
