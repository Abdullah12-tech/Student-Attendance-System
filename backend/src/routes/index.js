const authRoutes = require('./auth');
const classRoutes = require('./classes');
const studentRoutes = require('./students');
const attendanceRoutes = require('./attendance');
const adminRoutes = require('./admin');

module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/classes', classRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/admin', adminRoutes);
};
