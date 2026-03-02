const express = require('express');
const router = express.Router();
const { signup, register, login, getMe, updatePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');

// Public routes
router.post('/signup', validate(schemas.register), signup);
router.post('/login', validate(schemas.login), login);

// Protected routes
router.get('/me', auth(), getMe);
router.put('/password', auth(), validate(schemas.updatePassword), updatePassword);

// Admin only
router.post('/register', auth('admin'), validate(schemas.register), register);

module.exports = router;
