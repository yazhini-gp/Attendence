const fs = require('fs');
console.log("Checking path:", fs.existsSync('./attendance-backend/models/Attendance'));

const mongoose = require('mongoose');
const Attendance = require('./attendance-backend/models/Attendance');

mongoose.connect('mongodb://localhost:27017/attendanceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  await Attendance.deleteMany({});
  console.log("🗑️ Old attendance records cleared");
  mongoose.disconnect();
});
