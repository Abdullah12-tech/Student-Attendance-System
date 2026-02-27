const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  parentContact: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
studentSchema.index({ classId: 1, uid: 1 });
studentSchema.index({ name: 'text' });

// Generate UID before saving
studentSchema.pre('save', async function (next) {
  if (this.isNew && !this.uid) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.uid = `SCH${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
