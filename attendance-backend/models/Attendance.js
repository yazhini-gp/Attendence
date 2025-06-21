const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  className: { type: String, required: true },
  date: { type: String, required: true }, // or use Date if needed
  present: [
    {
      name: String,
      rollNumber: Number
    }
  ],
  absent: [
    {
      name: String,
      rollNumber: Number
    }
  ]
});

// Only define the model if it doesn't already exist
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
