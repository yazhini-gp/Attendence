const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/attendanceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));
// Import routes
const attendanceRoutes = require('./routes/attendance');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const userRoutes = require('./routes/user');
const sessionRoutes = require('./routes/session');
console.log('Session route loaded'); 
// Use routes
app.use('/api/attendance', attendanceRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/user', userRoutes);
app.use('/api/session', sessionRoutes);
// Auth routes (login/signup)
const User = require('./models/User');
const Student = require('./models/Student'); // adjust path as needed
app.post('/api/student', async (req, res) => {
  const { className, name, rollNumber } = req.body;
  if (!className || !name || !rollNumber) {
    return res.status(400).json({ message: "Missing data!" });
  }
  try {
    const newStudent = new Student({ className, name, rollNumber });
    await newStudent.save(); // 👉 This saves to MongoDB!
    console.log("Student added:", newStudent);
    res.status(200).json({ message: "Student added successfully!" });
  } catch (err) {
    console.error("Error saving student:", err);
    res.status(500).json({ message: "Failed to save student" });
  }
});
// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});