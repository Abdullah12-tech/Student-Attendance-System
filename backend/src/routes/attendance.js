const express = require('express');
const router = express.Router();
const {
  createSession,
  endSession,
  getActiveSession,
  getSessionByCode,
  checkIn,
  getAttendance,
  getStats,
  exportAttendance,
  manualMark,
} = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Public routes (for student check-in)
router.get('/sessions/code/:code', getSessionByCode);
router.post('/checkin', validate(schemas.checkIn), checkIn);

// Protected routes
router.use(auth());

// Session management
router.post('/sessions', validate(schemas.createSession), createSession);
router.put('/sessions/:id/end', endSession);
router.get('/sessions/active/:classId', getActiveSession);

// Attendance records
router.get('/', getAttendance);
router.get('/stats/:classId', getStats);
router.get('/export/:classId', exportAttendance);
router.post('/manual', validate(schemas.manualMark), manualMark);

module.exports = router;
