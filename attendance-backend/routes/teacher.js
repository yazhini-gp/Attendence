// routes/teacher.js
const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// ➕ Add a teacher
router.post('/', async (req, res) => {
  const { name, subject, email, classAssigned } = req.body;
  try {
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Teacher with this email already exists' });
    }

    const newTeacher = new Teacher({ name, subject, email, classAssigned });
    await newTeacher.save();
    res.status(201).json({ message: 'Teacher added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add teacher' });
  }
});

// 📋 Get all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get teachers' });
  }
});

// ❌ Delete teacher by email
router.delete('/', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await Teacher.deleteOne({ email });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Teacher removed successfully' });
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');

router.get('/generate-session', async (req, res) => {
  const { email, className, subject } = req.query;

  try {
    const sessionId = uuidv4();

    await Session.create({
      sessionId,
      teacherEmail: email,
      className,
      subject,
      createdAt: new Date()
    });

    const qrCode = await QRCode.toDataURL(sessionId);
    res.status(200).json({ qrCode, sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate session QR' });
  }
});

module.exports = router;
