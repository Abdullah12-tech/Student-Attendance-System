const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttendanceSession',
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['present', 'late', 'absent'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  locationValid: {
    type: Boolean,
    default: false,
  },
  distanceFromSchool: {
    type: Number, // meters
  },
  notes: {
    type: String,
    trim: true,
  },
  markedBy: {
    type: String,
    enum: ['self', 'teacher', 'system'],
    default: 'self',
  },
}, {
  timestamps: true,
});

// Compound indexes for efficient queries
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ classId: 1, date: 1 });
attendanceSchema.index({ sessionId: 1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ studentId: 1, classId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
