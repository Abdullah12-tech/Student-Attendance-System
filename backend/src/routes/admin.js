const express = require('express');
const router = express.Router();
const {
  getStats,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getLogs,
} = require('../controllers/adminController');
const auth = require('../middleware/auth');

// All admin routes require admin role
router.use(auth('admin'));

// Dashboard
router.get('/stats', getStats);

// Teacher management
router.get('/teachers', getTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Logs
router.get('/logs', getLogs);

module.exports = router;
