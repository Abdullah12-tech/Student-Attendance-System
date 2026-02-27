const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  startedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // minutes
    default: 10,
  },
  presentMinutes: {
    type: Number,
    default: 5,
  },
  lateMinutes: {
    type: Number,
    default: 10,
  },
  totalStudents: {
    type: Number,
    default: 0,
  },
  checkedInCount: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
attendanceSessionSchema.index({ classId: 1, code: 1 });
attendanceSessionSchema.index({ expiresAt: 1 });
attendanceSessionSchema.index({ active: 1, expiresAt: 1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
