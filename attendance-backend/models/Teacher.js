// models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  email: String,
  classAssigned: String
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
