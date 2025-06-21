// routes/student.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// ➕ Add new student
router.post('/', async (req, res) => {
  const { className, name, rollNumber } = req.body;
  try {
    const existing = await Student.findOne({ className, rollNumber });
    if (existing) {
      return res.status(409).json({ message: 'Student already exists' });
    }

    const newStudent = new Student({ className, name, rollNumber });
    await newStudent.save();
    res.status(200).json({ message: 'Student added successfully', student: newStudent });
  } catch (err) {
    console.error('Error adding student:',err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// 📋 Get students by class
router.get('/:className', async (req, res) => {
  const className = req.params.className;
  try {
    const students = await Student.find({ className }).sort({ rollNumber: 1 });
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

// ❌ Delete student
router.delete('/', async (req, res) => {
  const { className, rollNumber } = req.body;
  try {
    const result = await Student.deleteOne({ className, rollNumber });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Student removed successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});


// ✏️ Update student
router.put('/', async (req, res) => {
  const { className, rollNumber, newName, newRollNumber } = req.body;

  try {
    const student = await Student.findOne({ className, rollNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Only update if provided
    if (newName) student.name = newName;
    if (newRollNumber) student.rollNumber = newRollNumber;

    await student.save();
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});


module.exports = router;
