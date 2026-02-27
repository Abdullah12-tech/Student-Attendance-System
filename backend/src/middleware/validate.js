const Joi = require('joi');
const logger = require('../utils/logger');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }
    
    next();
  };
};

// Common validation schemas
const schemas = {
  // Auth schemas
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'teacher').default('teacher'),
  }),

  // Class schemas
  createClass: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    schoolLatitude: Joi.number().min(-90).max(90).required(),
    schoolLongitude: Joi.number().min(-180).max(180).required(),
    allowedRadius: Joi.number().min(10).max(5000).default(200),
    presentMinutes: Joi.number().min(1).max(60).default(5),
    lateMinutes: Joi.number().min(1).max(120).default(10),
    description: Joi.string().max(500),
    subject: Joi.string().max(100),
  }),

  updateClass: Joi.object({
    name: Joi.string().min(2).max(100),
    schoolLatitude: Joi.number().min(-90).max(90),
    schoolLongitude: Joi.number().min(-180).max(180),
    allowedRadius: Joi.number().min(10).max(5000),
    presentMinutes: Joi.number().min(1).max(60),
    lateMinutes: Joi.number().min(1).max(120),
    description: Joi.string().max(500),
    subject: Joi.string().max(100),
    isActive: Joi.boolean(),
  }),

  // Student schemas
  createStudent: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email(),
    phone: Joi.string().max(20),
    parentContact: Joi.string().max(100),
    address: Joi.string().max(500),
    dateOfBirth: Joi.date(),
  }),

  updateStudent: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    phone: Joi.string().max(20),
    parentContact: Joi.string().max(100),
    address: Joi.string().max(500),
    dateOfBirth: Joi.date(),
    isActive: Joi.boolean(),
  }),

  // Attendance session schemas
  createSession: Joi.object({
    classId: Joi.string().required(),
    duration: Joi.number().min(1).max(60).default(10),
    notes: Joi.string().max(500),
  }),

  // Student check-in schemas
  checkIn: Joi.object({
    uid: Joi.string().required(),
    code: Joi.string().length(6).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  }),
};

module.exports = { validate, schemas };
