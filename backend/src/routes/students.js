const express = require('express');
const router = express.Router();
const {
  createStudent,
  bulkCreateStudents,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  verifyStudent,
} = require('../controllers/studentController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Public route for student verification
router.post('/verify', verifyStudent);

// Protected routes
router.use(auth());

// Student CRUD
router.post('/', validate(schemas.createStudent), createStudent);
router.post('/bulk', bulkCreateStudents);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.put('/:id', validate(schemas.updateStudent), updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;
