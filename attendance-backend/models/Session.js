const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: String,         // unique ID shown in QR code
  teacherEmail: String,      // identifies which teacher created this
  className: String,
  subject: String,
  createdAt: Date
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
module.exports = Session;
