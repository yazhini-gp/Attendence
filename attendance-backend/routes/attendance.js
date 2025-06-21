const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Save attendance
router.post('/', async (req, res) => {
  const { className, present, absent, date } = req.body;

  try {
    if (!className || !Array.isArray(present) || !Array.isArray(absent)) {
      return res.status(400).json({ error: 'Invalid data provided' });
    }

    const newRecord = new Attendance({
      className,
      present,
      absent,
      date: date || new Date()
    });

    await newRecord.save();
    console.log('✅ Attendance saved:', newRecord);
    res.status(200).json({ message: 'Attendance saved successfully!' });
  } catch (error) {
    console.error('❌ Failed to save attendance:', error);
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});

// Get attendance by date
router.get('/', async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    // Convert date string to range for that entire day
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    const record = await Attendance.findOne({
      date: {
        $gte: start,
        $lte: end
      }
    });

    if (!record) {
      return res.status(404).json({ message: 'No attendance found for the selected date' });
    }

    res.json(record);
  } catch (error) {
    console.error('❌ Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



const Student = require('../models/Student');
const Session = require('../models/Session');

// ✅ Mark attendance using sessionId and rollNumber
router.post('/mark', async (req, res) => {
  const { sessionId, rollNumber } = req.body;

  try {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    

    const student = await Student.findOne({ className: session.className, rollNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const today = new Date().toISOString().split('T')[0]; // 'yyyy-mm-dd'

    let attendance = await Attendance.findOne({ className: session.className, date: today });

    if (!attendance) {
      attendance = new Attendance({
        className: session.className,
        date: today,
        present: [],
        absent: []
      });
    }

    const alreadyMarked = attendance.present.some(s => s.rollNumber === rollNumber);
    if (alreadyMarked) {
      return res.status(409).json({ message: 'Attendance already marked' });
    }

    attendance.present.push({ name: student.name, rollNumber });
    await attendance.save();

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error('❌ Failed to mark attendance:', err);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});


module.exports = router;
