// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  className: String,
  name: String,
  rollNumber: Number
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
