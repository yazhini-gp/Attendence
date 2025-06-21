const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');

mongoose.connect('mongodb://localhost:27017/attendanceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const attendance = new Attendance({
    date: new Date('2025-04-07'), // today's date
    present: [
      { name: 'Alice', rollNumber: 1 },
      { name: 'Bob', rollNumber: 2 }
    ],
    absent: [
      { name: 'Charlie', rollNumber: 3 },
      { name: 'David', rollNumber: 4 }
    ]
  });

  await attendance.save();
  console.log('✅ Sample attendance inserted');
  mongoose.disconnect();
}).catch(err => {
  console.error('❌ Error inserting sample:', err);
});
