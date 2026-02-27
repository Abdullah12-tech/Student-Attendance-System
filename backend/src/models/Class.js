const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  schoolLatitude: {
    type: Number,
    required: true,
  },
  schoolLongitude: {
    type: Number,
    required: true,
  },
  allowedRadius: {
    type: Number,
    default: 200, // meters
  },
  presentMinutes: {
    type: Number,
    default: 5, // minutes after start time to mark as present
  },
  lateMinutes: {
    type: Number,
    default: 10, // minutes after start time to mark as late
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  schedule: {
    dayOfWeek: {
      type: [Number], // 0-6, Sunday-Saturday
      default: [1, 2, 3, 4, 5],
    },
    startTime: {
      type: String, // HH:mm format
      default: '08:00',
    },
    endTime: {
      type: String,
      default: '14:00',
    },
  },
}, {
  timestamps: true,
});

// Index for faster queries
classSchema.index({ teacherId: 1, name: 1 });

module.exports = mongoose.model('Class', classSchema);
