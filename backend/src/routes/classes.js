const express = require('express');
const router = express.Router();
const {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
  getClassStudents,
} = require('../controllers/classController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// All routes require authentication
router.use(auth());

// Class CRUD
router.post('/', validate(schemas.createClass), createClass);
router.get('/', getClasses);
router.get('/:id', getClass);
router.put('/:id', validate(schemas.updateClass), updateClass);
router.delete('/:id', deleteClass);

// Class students
router.get('/:id/students', getClassStudents);

module.exports = router;
