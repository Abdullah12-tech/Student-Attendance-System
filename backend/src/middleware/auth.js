const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'No token provided. Access denied.',
        });
      }

      const token = authHeader.replace('Bearer ', '');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.',
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated.',
        });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
        });
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      logger.error(`Auth middleware error: ${error.message}`);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.',
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
  };
};

module.exports = auth;
